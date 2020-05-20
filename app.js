const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const mongoose = require('mongoose');
const uuid = require('uuid-random');

const mongoURI = require('./util/config').mongoURI;
const authRoutes = require('./routes/auth');
const teamRoutes = require('./routes/team');
const memberRoutes = require('./routes/member');

const app = express();
const port = process.env.PORT || 3000;

const fileStore = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'assets/testimonials');
    },
    filename: (req, file, cb) => {
        const file_name = uuid();
        cb(null, file_name + '-' + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
        cb(null, true);
    }
    else {
        cb(null, false);
    }
};

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(multer({ storage: fileStore, fileFilter: fileFilter }).single('image'));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use(authRoutes);
app.use(teamRoutes);
app.use(memberRoutes);
app.use((error, req, res, next) => {
    const status = error.statusCode || 500;
    res.status(status).json({
        message: error.message
    });
});
app.use((req, res, next) => {
    res.status(404).json({
        message: 'Invalid route'
    });
});

mongoose.connect(mongoURI)
    .then(() => {
        app.listen(port);
    })
    .catch(err => {
        throw new Error(err);
    });