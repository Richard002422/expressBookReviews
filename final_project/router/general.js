const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.setHeader('Content-Type', 'application/json');
  return res.status(200).send(JSON.stringify(books, null, 2));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  if (books[isbn]) {
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).send(JSON.stringify(books[isbn], null, 2));
  } else {
    return res.status(404).json({message: "Book not found"});
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  const bookKeys = Object.keys(books);
  const booksByAuthor = {};
  
  for (let i = 0; i < bookKeys.length; i++) {
    const isbn = bookKeys[i];
    if (books[isbn].author === author) {
      booksByAuthor[isbn] = books[isbn];
    }
  }
  
  if (Object.keys(booksByAuthor).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).send(JSON.stringify(booksByAuthor, null, 2));
  } else {
    return res.status(404).json({message: "No books found for this author"});
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  const bookKeys = Object.keys(books);
  const booksByTitle = {};
  
  for (let i = 0; i < bookKeys.length; i++) {
    const isbn = bookKeys[i];
    if (books[isbn].title === title) {
      booksByTitle[isbn] = books[isbn];
    }
  }
  
  if (Object.keys(booksByTitle).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).send(JSON.stringify(booksByTitle, null, 2));
  } else {
    return res.status(404).json({message: "No books found with this title"});
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
