const express = require('express'); 
const middlewares = require('../middlewares');
const router = express.Router();
const bananojs = require('bananojs')('http://localhost:7072');
 

router.get('/balance',middlewares.checkToken, (req, res) => {
  res.json({
    message: 'ssss'
  });
});

router.get('/hashed_roll',middlewares.checkToken, (req, res) => {
  res.json({
    message: 'ssss'
  });
});

router.post('/roll',middlewares.checkToken, (req, res) => {
  res.json({
    message: 'ssss'
  });
});  

router.get('/history',middlewares.checkToken, (req, res) => {
  res.json({
    message: 'ssss'
  });
}); 

router.get('/wallet',middlewares.checkToken, (req, res) => {
  res.json({
    message: 'ssss'
  });
}); 

module.exports = router;
