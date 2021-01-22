// routes/home.js

let express = require('express');
let router = express.Router();

// Home
router.get('/', (req, res) => {
  res.render('home/welcome');
});
router.get('/about', (req, res) => {
  res.render('home/about');
});

module.exports = router;
