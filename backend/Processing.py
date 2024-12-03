import pandas as pd

import random
import re
import pickle
import nltk
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.decomposition import TruncatedSVD
import nltk
import re
from nltk.corpus import stopwords
import collections
from nltk.corpus import wordnet

nltk.download('punkt_tab')
nltk.download('averaged_perceptron_tagger_eng')
from textblob import TextBlob

df = pd.read_csv("/workspaces/Project_Version2/backend/uploads/reviews.csv",sep="\t")

def Preprocessing(text):
    text = str(text)
    text = text.lower()
    text = re.sub(r"that's","that is",text)
    text = re.sub(r"there's","there is",text)
    text = re.sub(r"what's","what is",text)
    text = re.sub(r"where's","where is",text)
    text = re.sub(r"it's","it is",text)
    text = re.sub(r"who's","who is",text)
    text = re.sub(r"i'm","i am",text)
    text = re.sub(r"she's","she is",text)
    text = re.sub(r"he's","he is",text)
    text = re.sub(r"they're","they are",text)
    text = re.sub(r"who're","who are",text)
    text = re.sub(r"ain't","am not",text)
    text = re.sub(r"wouldn't","would not",text)
    text = re.sub(r"shouldn't","should not",text)
    text = re.sub(r"can't","can not",text)
    text = re.sub(r"couldn't","could not",text)
    text = re.sub(r"won't","will not",text)
    
    text = re.sub(r"\W"," ",text)
    text = re.sub(r"\d"," ",text)
    text = re.sub(r"\s+[a-z]\s+"," ",text)
    text = re.sub(r"^[a-z]\s+"," ",text)    
    text = re.sub(r"\s+[a-z]$"," ",text)    
    text = re.sub(r"\s+"," ",text) 

    blob = TextBlob(text).sentiment.polarity
    if blob > 0:
        return "Positive"
    elif blob < 0:
        return "Negative"
    else:
        return "Neutral"  
    
def Sentimental_Analysis(df):
	
    #Preprocessed data
    df["headline_polarity"]=''
    df["body_polarity"]=''
    df["headline_polarity"] = df["review_headline"].apply(Preprocessing)
    df["body_polarity"] = df["review_body"].apply(Preprocessing)
    #1. different sentiment in review headline and review body
    df["Fake_label"]=''
    # stores the list of review_id of fake reviews
    df.loc[df['headline_polarity'] == df['body_polarity'], 'Fake_label'] = 'No'
    df.loc[df['headline_polarity'] != df['body_polarity'], 'Fake_label'] = 'Yes'

    return df

def SameUser_DiffProduct_SameBrand(df):
    #2. Users which are posting either all positive or negative reviews on different products of same brand
    # Group by customer_id and product_id and count reviews 
    review_counts = df.groupby(['customer_id', 'product_id']).size().reset_index(name='review_count')
    # Filter to get customers with more than one review for the same product
    multiple_reviews = review_counts[review_counts['review_count'] > 1] 
    # Get the list of customer_ids 
    customer_ids_duplicate = multiple_reviews['customer_id'].unique() 

    df.loc[df['customer_id'].isin(customer_ids_duplicate), 'Fake_label'] = 'Yes'
    return df

def Check_SameIp_SameDay(df):
	#5. Reviews(>3) from same IP on the same day with all the reviews are either positive or negative.
	
	ip_group = df.groupby("IP Address")
	# grouping the dataset by ip addresses
	
	ip_list = df["IP Address"].unique().tolist()
	# stores the list of unique ip addresses
	
	size = len(ip_list)
	# total no of unique ip addresses
	
	for i in range(size):
		# iterate through all the ip addresses
	
		reviews = ip_group.get_group( ip_list[i] )
		# dataframe of each ip
	
		dates_list = reviews["review_date"].unique().tolist()
		# list of dates of reviews by each ip addresses
	
		reviews_by_date = reviews.groupby("review_date");
		# grouping the dataframe by date
	
		for j in range(len(dates_list)):
			# iterate through all the dates
	
			reviews_by_date_for_pos = []
			reviews_by_date_for_neg = []
	
			reviews_for_each_day = reviews_by_date.get_group(dates_list[j])
			#dataframe of reviews for a day by each ip addresses
	
			indices = reviews_for_each_day.index.tolist()
			# list of indices of the dataframe reviews_for_each_day
	
			for k in range(len(reviews_for_each_day)):
				#iterate through all the reviews on a day by each ip addresses
	
				text = reviews_for_each_day["review_body"][ indices[k] ]
				# reviews on a day for an ip addresses
	
				if(Preprocessing(text) == 0):
	
					#if sentiment is negative, append review_id to list of negative reviews
					reviews_by_date_for_neg.append(reviews_for_each_day["review_id"][ indices[k] ])
				else:
	
					#if sentiment is positive, append review_id to list of positive reviews
					reviews_by_date_for_pos.append(reviews_for_each_day["review_id"][ indices[k] ])
	
			# CONDITION FOR CONSIDERING THE FAKE REVIEW
	
			#removing postive reviews that are written by a reviewer that are > 3 on same day
			if(len(reviews_by_date_for_pos)>3):
				df['Fake_label'][indices[k]] = 'Yes'
				#remove_reviews.extend(reviews_by_date_for_pos)
	
			#removing postive reviews that are written by a reviewer that are > 3 on same day
			if(len(reviews_by_date_for_neg)>3):
				df['Fake_label'][indices[k]] = 'Yes'
	return df

def RudeReviews(df):
    
	for i in range(len(df)):
		#iterate the whole dataset
	
		words = nltk.word_tokenize(str(df["review_body"][i]))
		#storing the words from the reviews into the list
	
		tagged_words = nltk.pos_tag(words)
		# returns list of tuples of words along with their parts of speech
	
		nouns_count = 0
		verbs_count = 0
	
		for j in range(len(tagged_words)):
			#iterate through all the words
	
			if(tagged_words[j][1].startswith("NN")):
				nouns_count+=1
				#counts the no. of nouns in the review
	
			if(tagged_words[j][1].startswith("VB")):
				verbs_count+=1
				#counts the no. of verbs in the review
	
		if(verbs_count>nouns_count):
			#comparing the no. of verbs and nouns
			df["Fake_label"][i] = "Yes"
			#storing the review to be removed
	return df
def LSA(text):
	#text is list of reviews of same product
	
	
	# Created TF-IDF Model
	vectorizer = TfidfVectorizer()
	X = vectorizer.fit_transform(text)
	
	# Created SVD(Singular Value Decomposition)
	lsa = TruncatedSVD(n_components = 1,n_iter = 100)
	lsa.fit(X)
	
	# Use get_feature_names_out() instead of get_feature_names()
	terms = vectorizer.get_feature_names_out()  
	concept_words={}
	
	for j,comp in enumerate(lsa.components_):
		componentTerms = zip(terms,comp)
		sortedTerms = sorted(componentTerms,key=lambda x:x[1],reverse=True)
		sortedTerms = sortedTerms[:10]
		concept_words[str(j)] = sortedTerms
	
	sentence_scores = []
	for key in concept_words.keys():
		for sentence in text:
			words = nltk.word_tokenize(sentence)
			scores = 0
			for word in words:
				for word_with_scores in concept_words[key]:
					if word == word_with_scores[0]:
						scores += word_with_scores[1]
			sentence_scores.append(scores)
	return sentence_scores

def LatentSemanticAnalysis(df):
	from sklearn.feature_extraction.text import TfidfVectorizer
	from sklearn.decomposition import TruncatedSVD
	import nltk

	
	df.set_index("review_id",inplace=True)
	
	# Latent symantic analysis
	# it will analyse all reviews and determine all reviews belong to the same concept
	
	
	import nltk
	
	# Ensure the nltk POS tagger resources are downloaded
	nltk.download('punkt')
	nltk.download('averaged_perceptron_tagger')
	
	# Initialize an empty list to store review IDs for removal
	remove_reviews = []
	
	# Add a Fake_label column if it doesn't already exist
	if 'Fake_label' not in df.columns:
		df['Fake_label'] = "No"
	
	# Iterate through the dataset
	for i in range(len(df)):
		# Tokenize the review body
		words = nltk.word_tokenize(str(df["review_body"][i]))
		
		# Tag words with their parts of speech
		tagged_words = nltk.pos_tag(words)
		
		# Initialize noun and verb counters
		nouns_count = 0
		verbs_count = 0
		
		# Count nouns and verbs in the review
		for j in range(len(tagged_words)):
			if tagged_words[j][1].startswith("NN"):
				nouns_count += 1
			if tagged_words[j][1].startswith("VB"):
				verbs_count += 1
		
		# Check if the review is fake (verbs > nouns)
		if verbs_count > nouns_count:
			# Add review ID to the removal list
			remove_reviews.append(df["review_id"][i])
			
			# Update the Fake_label column to "Yes"
			df.loc[i, 'Fake_label'] = "Yes"
	
	return df

def meaningless_reviews(df):
	import re
	import nltk
	from nltk.corpus import wordnet
	
	# Group dataset by product_id
	product_df = df.groupby("product_id")
	
	# List of unique product IDs
	unique_products = df["product_id"].unique()
	
	# Total number of products
	no_products = len(unique_products.tolist())
	
	remove_reviews = []  # Store review_ids that are fake
	
	for i in range(no_products):
		# Iterate through all product reviews
		
		df = product_df.get_group(unique_products[i])  # Get a dataframe of a single product
		unique_reviews = df.index.tolist()            # List of review_ids for the same product
		no_reviews = len(unique_reviews)              # Number of reviews for the product
		count = no_reviews                            # Count of reviews that can be analyzed
		
		reviews = []    # List to store review texts
		review_id = []  # List to store review IDs
		
		for j in range(no_reviews):
			# Process each review
			
			text = str(df.loc[unique_reviews[j]]["review_body"])  # Extract review text
			
			# Cleaning the text
			text = re.sub(r"\W", " ", text)
			text = re.sub(r"\d", " ", text)
			text = re.sub(r"\s+[a-z]\s+", " ", text)
			text = re.sub(r"^[a-z]\s+", " ", text)
			text = re.sub(r"\s+[a-z]$", " ", text)
			text = re.sub(r"\s+", " ", text)
			
			words = nltk.word_tokenize(text)  # Tokenize the cleaned text into words
			
			# Check for single-word reviews or invalid words
			if len(words) == 1:
				if len(text) <= 1 or not wordnet.synsets(text):
					# Mark the review as fake
					remove_reviews.append(unique_reviews[j])
					df.loc[unique_reviews[j], 'Fake_label'] = "Yes"
					count -= 1
					continue  # Skip to the next review
			
			# Check for empty reviews
			elif len(words) == 0:
				# Mark the review as fake
				remove_reviews.append(unique_reviews[j])
				df.loc[unique_reviews[j], 'Fake_label'] = "Yes"
				count -= 1
				continue  # Skip to the next review
			
			# Otherwise, consider the review valid for analysis
			review_id.append(unique_reviews[j])
			reviews.append(text)
		
		# Skip further checks if no reviews are left for analysis
		if count <= 0:
			continue
		
		# Special case: If only one review is left, analyze it with the product title
		if count == 1:
			text = [reviews[0], str(df.loc[review_id[0]]["product_title"])]
			sentence_scores = LSA(text)  # Compute LSA scores
			
			if sentence_scores[0] == 0:
				# Mark the review as fake
				remove_reviews.append(review_id[0])
				df.loc[review_id[0], 'Fake_label'] = "Yes"
			continue
		
		# General case: Compute LSA scores for all reviews
		sentence_scores = LSA(reviews)
		
		for j in range(len(sentence_scores)):
			if sentence_scores[j] == 0.00:
				# Mark the review as fake
				remove_reviews.append(review_id[j])
				df.loc[review_id[j], 'Fake_label'] = "Yes"
	
	df.loc[df['review_id'].isin(remove_reviews), 'Fake_label'] = "Yes"
	return df

pipeline=[Preprocessing,Sentimental_Analysis,SameUser_DiffProduct_SameBrand,Check_SameIp_SameDay,RudeReviews,LatentSemanticAnalysis,meaningless_reviews ]
