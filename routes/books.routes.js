const router = require('express').Router();
const authMiddleware = require('../middlewares/auth.middleware');
const booksController = require('../controllers/books.controller');
const multer = require('../middlewares/multer-config');

router.get('/', booksController.getBooks);
router.get('/bestrating', booksController.getBestRatingBooks);
router.get('/:id', booksController.getOneBook);

router.post('/', authMiddleware, multer, booksController.addBook);
router.post('/:id/rating', authMiddleware, booksController.rateBook);

router.put('/:id', authMiddleware, multer, booksController.updateBook);

router.delete('/:id', authMiddleware, booksController.deleteBook);

module.exports = router;
