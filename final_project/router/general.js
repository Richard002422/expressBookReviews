const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Helper function to get books using Promise (simulating async operation)
const getBooks = () => {
  return new Promise((resolve, reject) => {
    try {
      resolve(books);
    } catch (error) {
      reject(error);
    }
  });
};

// Helper function to get book by ISBN using Promise (simulating async operation)
const getBookByISBN = (isbn) => {
  return new Promise((resolve, reject) => {
    try {
      if (books[isbn]) {
        resolve(books[isbn]);
      } else {
        reject(new Error("Book not found"));
      }
    } catch (error) {
      reject(error);
    }
  });
};

// Helper function to get books by author using Promise (simulating async operation)
const getBooksByAuthor = (author) => {
  return new Promise((resolve, reject) => {
    try {
      const bookKeys = Object.keys(books);
      const booksByAuthor = {};
      
      for (let i = 0; i < bookKeys.length; i++) {
        const isbn = bookKeys[i];
        if (books[isbn].author === author) {
          booksByAuthor[isbn] = books[isbn];
        }
      }
      
      if (Object.keys(booksByAuthor).length > 0) {
        resolve(booksByAuthor);
      } else {
        reject(new Error("No books found for this author"));
      }
    } catch (error) {
      reject(error);
    }
  });
};

// Helper function to get books by title using Promise (simulating async operation)
const getBooksByTitle = (title) => {
  return new Promise((resolve, reject) => {
    try {
      const bookKeys = Object.keys(books);
      const booksByTitle = {};
      
      for (let i = 0; i < bookKeys.length; i++) {
        const isbn = bookKeys[i];
        if (books[isbn].title === title) {
          booksByTitle[isbn] = books[isbn];
        }
      }
      
      if (Object.keys(booksByTitle).length > 0) {
        resolve(booksByTitle);
      } else {
        reject(new Error("No books found with this title"));
      }
    } catch (error) {
      reject(error);
    }
  });
};


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  
  if (!username || !password) {
    return res.status(400).json({message: "Username and password are required"});
  }
  
  // Check if username already exists
  const existingUser = users.find(user => user.username === username);
  if (existingUser) {
    return res.status(409).json({message: "Username already exists"});
  }
  
  // Register new user
  users.push({username: username, password: password});
  return res.status(200).json({message: "Usuario registrado correctamente"});
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  //Write your code here
  try {
    // Using async-await with Promise
    const booksList = await getBooks();
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).send(JSON.stringify(booksList, null, 2));
  } catch (error) {
    return res.status(500).json({message: "Error retrieving books", error: error.message});
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  //Write your code here
  try {
    const isbn = req.params.isbn;
    // Using async-await with Promise
    const book = await getBookByISBN(isbn);
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).send(JSON.stringify(book, null, 2));
  } catch (error) {
    if (error.message === "Book not found") {
      return res.status(404).json({message: "Book not found"});
    }
    return res.status(500).json({message: "Error retrieving book", error: error.message});
  }
 });
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  //Write your code here
  try {
    const author = req.params.author;
    // Using async-await with Promise
    const booksByAuthor = await getBooksByAuthor(author);
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).send(JSON.stringify(booksByAuthor, null, 2));
  } catch (error) {
    if (error.message === "No books found for this author") {
      return res.status(404).json({message: "No books found for this author"});
    }
    return res.status(500).json({message: "Error retrieving books by author", error: error.message});
  }
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  //Write your code here
  try {
    const title = req.params.title;
    // Using async-await with Promise
    const booksByTitle = await getBooksByTitle(title);
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).send(JSON.stringify(booksByTitle, null, 2));
  } catch (error) {
    if (error.message === "No books found with this title") {
      return res.status(404).json({message: "No books found with this title"});
    }
    return res.status(500).json({message: "Error retrieving books by title", error: error.message});
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  if (books[isbn]) {
    const reviews = books[isbn].reviews;
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).send(JSON.stringify(reviews, null, 2));
  } else {
    return res.status(404).json({message: "Book not found"});
  }
});

module.exports.general = public_users;
