const multer = require('multer');

const MIME_TYPES = {
	'image/jpg': 'jpg',
	'image/jpeg': 'jpeg',
	'image/png': 'png',
};

// Configuration de stockage pour multer
const storage = multer.diskStorage({
	destination: (req, file, callback) => {
		callback(null, 'images');
	},

	filename: (req, file, callback) => {
		const name = file.originalname.split(' ').join('_');
		const extension = MIME_TYPES[file.mimetype];
		callback(null, `${name}_${Date.now()}.${extension}`);
	},
});

module.exports = multer({ storage: storage }).single('image');
