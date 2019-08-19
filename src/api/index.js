
const express = require('express'); 
const middlewares = require('../middlewares');
const router = express.Router();
const bananojs = require('bananojs')('http://localhost:7072');
const betService = require('../service/betsService');
const userService = require('../service/userService');
const chips_permited = [1,10,100];
router.get('/balance',middlewares.checkToken, (req, res) => {

  let balance = await bananojs.getAccountBalance("get account")
  balance = await bananojs.rawToBan(balance);
  res.json({
    balance: balance
  });
});

router.get('/hashed_roll',middlewares.checkToken, async (req, res) => {
let roll_number = betService.roll();
let server_hash = betService.getRandomHash();
let client_hash = betService.getSHA256(roll_number+':'+server_hash);
let bet = await betService.createBet('user_id',client_hash,server_hash,roll_number,'0','0','0','created')

  res.json({
    current_hash: client_hash
  });
});

router.post('/roll',middlewares.checkToken, async (req, res) => {
  let hash = req.body.current_hash;
  let account_address = "get account";
  let bet = betService.getBetByClientHash(hash);
  let number = parseInt(bet.result);
  if (!req.body.user_bet) {
    res.json({
      error: 'error: need a bet'
    });
    return;
  }
  if (!req.body.chip_amount) {
    res.json({
      error: 'error: no chip amount'
    });
    return;
  }
  if (isNaN(chip_amount)) {
    res.json({
      error: 'error: chip_amount isNaN'
    });
  }
  if (!chips_permited.includes(chip_amount)) {
    res.json({
      error: 'error: amount per chip not permited'
    });
  }
  let user_bet = req.body.user_bet;
  let chip_amount = req.body.chip_amount;
  //check bet integrity
  let integrity_fail = false;


  let message = "";
  let bet_amount = 0;
  user_bet.forEach(b => {
    if (b.number == -1 || b.number == -2) {
      if (b.count < 3 || b.count > 9) {
        integrity_fail = true;
        break;
      }
    }else{
      if (b.count < 1 || b.count > 5) {
        integrity_fail = true;
        next();
        break;
      }
    }
    bet_amount = bet_amount + (b.count * parseInt(chip_amount));
  }); 

  if (integrity_fail) {
    res.json({
      error: 'bet integrity fail, rules are violated'
    });
    return;    
  }
  //check balance
  let current_wallet_balance = await bananojs.getAccountBalance(account_address);
  current_wallet_balance = bananojs.rawToBan(current_wallet_balance);
  if (bet_amount > current_wallet_balance) {
    res.json({
      error: 'No balance in wallet'
    });
    return;    
  }

  //now all is clear get winings

  let red_numbers = [32];
  let win_amount = 0;

  user_bet.forEach(b => {    
    if (b.number == -1 || b.number == -2) {
      
    }else{
      
    }    
  }); 


  res.json({
    win_amount: '0',
    server_hash: '0',
    message: message
  });
  return;
  
  
  
});  

router.get('/history',middlewares.checkToken, (req, res) => {
  let user = await userService.getUserByEmail('get ban address');
  let bets = await betService.getBetsByUser(user.idx);
  res.json({
    bets: bets
  });
}); 

router.get('/wallet',middlewares.checkToken, (req, res) => {
  let wallet = await userService.getUserByEmail('get ban address');

  res.json({
    wallet: wallet.address
  });
}); 

module.exports = router;
