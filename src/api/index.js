const express = require('express'); 
const middlewares = require('../middlewares');
const router = express.Router();

router.get('/',middlewares.checkToken, (req, res) => {
  res.json({
    message: 'ssss'
  });
});
 

module.exports = router;
