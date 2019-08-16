const express = require('express'); 
const  jwt  =  require('jsonwebtoken');

const SECRET_KEY = "998m7nu6by5vt45bv4c4vtby";

const router = express.Router();

router.get('/signup', (req, res) => { 
  
    res.status(200).send("ok"); 
});

router.post('/signup', (req, res) => { 
    const  email  =  req.body.email;
    const  password  =  req.body.password;
 
    const  expiresIn  =  24  *  60  *  60;
    const  accessToken  =  jwt.sign({ id:  email }, SECRET_KEY, {
        expiresIn:  expiresIn
    });
    res.status(200).send({ "access_token":  accessToken }); 
});

router.post('/signin', (req, res) => {
    const  email  =  req.body.email;
    const  password  =  req.body.password; 
    const  expiresIn  =  24  *  60  *  60;
    const  accessToken  =  jwt.sign({ id:  email }, SECRET_KEY, {
        expiresIn:  expiresIn
    }); 
    res.status(200).send({ "access_token":  accessToken});
});
 
router.post('/check_token', (req, res) => {
    const  token  =  req.body.token;
    if (token) {
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
          return res.json({
            success: false,
            message: 'Token is not valid'
          });
        } else {
            return res.json({
                success: true,
                message: 'mmmm looks fine...'
              });
        }
      });
    } else {
      return res.json({
        success: false,
        message: 'Auth token is not supplied'
      });
    }
});
 
module.exports = router;
