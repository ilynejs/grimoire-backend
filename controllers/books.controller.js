const mongoose = require('mongoose');
const Book = require('../models/book.model');
const { json } = require('express');

const getBooks = async (req, res, next) => {
	try {
		const books = await Book.find();
		res.json(books);
	} catch (error) {
		next(error);
	}
};

const getOneBook = async (req, res, next) => {
	try {
		const book = await Book.findById(req.params.id);
		if (!book) {
			return res.status(404).json({ message: 'Book not found' });
		}
		res.json(book);
	} catch (error) {
		next(error);
	}
};

const getBestRatingBooks = async (req, res, next) => {
	try {
		const books = await Book.find().sort({ averageRating: -1 }).limit(3);
		res.json(books);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

const addBook = async (req, res, next) => {
	try {
		const bookObject = JSON.parse(req.body.book);
		delete bookObject._id;
		delete bookObject.userId;

		if (bookObject.ratings && bookObject.ratings.length > 0) {
			bookObject.ratings = bookObject.ratings.map((rating) => ({
				userId: req.auth.userId,
				grade: rating.grade,
			}));
		}

		const book = new Book({
			...bookObject,
			userId: req.auth.userId,
			imageUrl: req.file
				? `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
				: undefined,
		});

		await book.save();
		res.status(201).json(book);

		next();
	} catch (error) {
		res.status(400).json({ message: 'Invalid data' });
	}
};

const updateBook = async (req, res, next) => {};

const rateBook = async (req, res, next) => {};

const deleteBook = async (req, res, next) => {
	try {
		const book = await Book.findById(req.params.id);
		if (!book) {
			return res.status(404).json({ message: 'Book not found' });
		}

		if (book.userId.toString() !== req.auth.userId) {
			return res.status(403).json({ message: 'Unauthorized' });
		}

		await book.deleteOne();

		res.status(204).end();
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

module.exports = {
	getBooks,
	getOneBook,
	getBestRatingBooks,
	addBook,
	updateBook,
	rateBook,
	deleteBook,
};
