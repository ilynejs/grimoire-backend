const Book = require('../models/book.model');
const fs = require('fs');

const getBooks = async (req, res, next) => {
	try {
		const books = await Book.find();
		res.json(books);
	} catch (error) {
		res.status(400).json(error);
	}
};

const getOneBook = async (req, res, next) => {
	try {
		const book = await Book.findById(req.params.id);
		if (!book) {
			return res.status(404).json(new Error('Book not found'));
		}
		res.json(book);
	} catch (error) {
		res.status(400).json(error);
	}
};

const getBestRatingBooks = async (req, res, next) => {
	try {
		const books = await Book.find().sort({ averageRating: -1 }).limit(3);
		res.json(books);
	} catch (error) {
		res.status(400).json(error);
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
	} catch (error) {
		res.status(400).json(error);
	}
};

const updateBook = async (req, res, next) => {
	try {
		const book = await Book.findById(req.params.id);
		if (!book) {
			return res.status(404).json(new Error('Book not found'));
		}

		if (book.userId.toString() !== req.auth.userId) {
			return res.status(403).json({ message: 'Unauthorized request' });
		}

		console.log(req.body, req.file, req.body.book);
		const bookObject = req.body.book
			? JSON.parse(req.body.book)
			: { ...req.body };

		if (req.file && book.imageUrl) {
			const filename = book.imageUrl.split('/images/')[1];
			fs.unlink(`images/${filename}`, (err) => {
				if (err) console.error(err);
			});
		}

		const updatedData = {
			...bookObject,
			imageUrl: req.file
				? `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
				: book.imageUrl,
		};

		const updatedBook = await Book.findOneAndUpdate(
			{ _id: req.params.id, userId: req.auth.userId },
			updatedData,
			{ new: true },
		);

		if (!updatedBook) {
			return res.status(404).json(new Error('Book not found'));
		}

		res.json(updatedBook);
	} catch (error) {
		res.status(400).json(error);
	}
};

const rateBook = async (req, res, next) => {
	try {
		console.log(req.body, req.params.id);

		const book = await Book.findById(req.params.id);
		if (!book) {
			return res.status(404).json(new Error('Book not found'));
		}

		const rating = book.ratings.find(
			(rating) => rating.userId.toString() === req.auth.userId,
		);
		if (rating) {
			rating.grade = req.body.rating;
		} else {
			book.ratings.push({
				userId: req.auth.userId,
				grade: req.body.rating,
			});
		}

		const totalRating = book.ratings.reduce(
			(acc, rating) => acc + rating.grade,
			0,
		);

		book.averageRating = totalRating / book.ratings.length;
		await book.save();

		res.json(book);
	} catch (error) {
		res.status(400).json(error);
	}

	next();
};

const deleteBook = async (req, res, next) => {
	try {
		const book = await Book.findById(req.params.id);
		if (!book) {
			return res.status(404).json(new Error('Book not found'));
		}

		if (book.userId.toString() !== req.auth.userId) {
			return res.status(403).json(new Error('Unauthorized request'));
		}

		if (book.imageUrl) {
			const filename = book.imageUrl.split('/images/')[1];
			fs.unlink(`images/${filename}`, () => {});
		}

		await book.deleteOne();

		res.status(204).end();
	} catch (error) {
		res.status(400).json(error);
	}

	next();
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
