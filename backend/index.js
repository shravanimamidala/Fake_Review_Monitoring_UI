const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const path = require('path');
const cors = require('cors');
const knex = require('knex');

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({ secret: 'your_secret_key', resave: true, saveUninitialized: true }));
app.use(cors());

// SQLite Database Connection
const db = knex({
  client: 'sqlite3',
  connection: {
    filename: './mydb.sqlite'
  },
  useNullAsDefault: true
});

// Create users table if it doesn't exist
db.schema.hasTable('users').then(exists => {
  if (!exists) {
    return db.schema.createTable('users', table => {
      table.increments('id').primary();
      table.string('username').unique();
      table.string('password');
    });
  }
});

// Serve Static Files
app.use(express.static(path.join(__dirname, '../frontend/my-frontend/build')));

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to My Web App');
});

// Registration Page
app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/my-frontend/build/index.html'));
});

// Registration Handling
app.post('/register', (req, res) => {
  const { username, password } = req.body;

  bcrypt.hash(password, 10, (err, hash) => {
    if (err) throw err;

    db('users')
      .insert({ username, password: hash })
      .then(() => {
        res.send('Registration successful! <a href="/login">Go to Login</a>');
      })
      .catch(err => {
        console.error(err);
        res.status(500).send('Error registering user');
      });
  });
});

// Login Page
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/my-frontend/build/index.html'));
});

// Login Handling
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  db('users')
    .where({ username })
    .first()
    .then(user => {
      if (!user) {
        res.send('User not found');
      } else {
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;

          if (isMatch) {
            req.session.loggedin = true;
            req.session.username = username;
            res.redirect('/dashboard');
          } else {
            res.send('Incorrect password');
          }
        });
      }
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Error logging in');
    });
});

// Dashboard Page
app.get('/dashboard', (req, res) => {
  if (req.session.loggedin) {
    res.send(`Welcome to your dashboard, ${req.session.username}`);
  } else {
    res.send('Please login to view this page');
  }
});

app.listen(3000, () => {
  console.log('Server started on http://localhost:3000');
});
