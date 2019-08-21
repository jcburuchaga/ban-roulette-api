
const express = require('express'); 
const middlewares = require('../middlewares');
const router = express.Router();
const bananojs = require('bananojs')('http://localhost:7072');
const betService = require('../service/betsService');
const userService = require('../service/userService');
const chips_permited = [1,10,100];
const cashier_address = "ban_16tduo1cu9ydp8ris3o5w4rm96myqics5o8tjw8s13ja8owba6xfpwc8399r";
const cashier_wallet = "097568DABFCA359B97A09C918A66A7E60957D096DABEBD44CC1500AC72AEC952";

router.get('/balance',middlewares.checkToken, async (req, res) => { 
  let user = await userService.getUserByEmail(req.decoded.ban_address); 
 
  let balance = await bananojs.getAccountBalance(user.address);
  balance = await bananojs.rawToBan(balance); 
  res.json({
    balance: balance
  });
});

router.get('/hashed_roll',middlewares.checkToken, async (req, res) => {
let roll_number = betService.roll();
let server_hash = betService.getRandomHash();
let client_hash = betService.getSHA256(roll_number+':'+server_hash);
let user = await userService.getUserByEmail(req.decoded.ban_address);
let bet = await betService.createBet(user.idx,client_hash,server_hash,roll_number,'0','0','0','created');
  res.json({
    current_hash: client_hash
  });
});

router.post('/roll',middlewares.checkToken, async (req, res) => {
  let hash = req.body.current_hash;
  let user =  await userService.getUserByEmail(req.decoded.ban_address);
  let account_address = user.address;
  let bet = await betService.getBetByClientHash(hash); 
  if(bet.state == "completed"){
    res.json({
      error: 'error: invalid hash'
    }); 
    return;
  }
  let result = parseInt(bet.result); 
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
  if (isNaN(req.body.chip_amount)) {
    res.json({
      error: 'error: chip_amount isNaN'
    });
    return;
  }
  if (!chips_permited.includes(parseInt(req.body.chip_amount))) {
    res.json({
      error: 'error: amount per chip not permited'
    });
    return;
  }
  let user_bet = req.body.user_bet;
  let chip_amount = parseInt(req.body.chip_amount);
  //check bet integrity
  let integrity_fail = false;
  let message = "";
  let bet_amount = 0;
  user_bet.forEach(b => {
    if (b.number == -1 || b.number == -2) {
      if (b.count < 3 || b.count > 9) {
        integrity_fail = true;
      }
    }else{
      if (b.count < 1 || b.count > 5) {
        integrity_fail = true;
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
  current_wallet_balance = await bananojs.rawToBan(current_wallet_balance); 
  if (bet_amount > current_wallet_balance) {
    res.json({
      error: 'No balance in wallet'
    });
    return;
  }
  //now all is clear get winings
  let red_numbers = [32,19,21,25,34,27,36,30,23,5,16,1,14,9,18,7,12,3];
  let win_amount = 0; 
  user_bet.forEach(b => {    
    if (b.number == -1 || b.number == -2) {
      if (red_numbers.includes(result)) {
        if (b.number == -1) {
          win_amount = win_amount + ((b.count * parseInt(chip_amount))) * 2;
          message = message + `Win ${((b.count * parseInt(chip_amount)))} BAN on RED.`
        }
      }
      else
      {
        if (b.number == -2) {
          win_amount = win_amount + ((b.count * parseInt(chip_amount))) * 2;
          message = message + `Win ${((b.count * parseInt(chip_amount)))} BAN on Black.`
        }
      }
    }else{
      if (b.number == result) {
        win_amount = win_amount + (((b.count * parseInt(chip_amount))*36));
        message = message + `Win ${((b.count * parseInt(chip_amount))*36)} BAN on ${result}.`
      }
    }    
  });  
  if (win_amount >= bet_amount ) {
    //transfer from cashier  
    let amount = win_amount - bet_amount; 

    amount = await bananojs.banToRaw(amount); 
    try {
    let block = await bananojs.send(cashier_wallet,cashier_address,user.address,amount,bet.hash_server);  
    let ok = await betService.updateBet(bet.idx,win_amount,bet_amount,block.block,"completed");
    if(!ok)
    {
      res.json({
        error: 'Error in transfer funds'
      });
      return;
    }
    } catch (error) {
      res.json({
        error: 'Error in moving funds'
      });
      return;
    }
  }
  else
  { 
    //transfer to cashier 
    let amount = bet_amount - win_amount;
    amount = await bananojs.banToRaw(amount);
    try {
      let block = await bananojs.send(user.wallet,user.address,cashier_address,amount,bet.hash_server); 
      
      let ok = await betService.updateBet(bet.idx,win_amount,bet_amount,block.block,"completed");
      if(!ok)
    {
      res.json({
        error: 'Error in moving funds'
      });
      return;
    }
    } catch (error) {
      res.json({
        error: 'Error in moving funds'
      });
      return;
    }
    
  }
  res.json({
    win_amount: win_amount,
    server_hash: bet.hash_server,
    message: message,
    result:result
  });
  return;
});  

router.get('/history',middlewares.checkToken, async (req, res) => {
  let user = await userService.getUserByEmail(req.decoded.ban_address);
  let bets = await betService.getBetsByUser(user.idx);
  res.json({
    bets: bets
  });
}); 

router.get('/wallet',middlewares.checkToken, async (req, res) => { 
  let wallet = await userService.getUserByEmail(req.decoded.ban_address); 
  res.json({
    wallet: wallet.address
  });
}); 

router.get('/wallet_w',middlewares.checkToken, async (req, res) => {  
  res.json({
    wallet: req.decoded.ban_address
  });
}); 

router.post('/withdraw',middlewares.checkToken, async (req, res) => { 
  let wallet = await userService.getUserByEmail(req.decoded.ban_address); 
  let amount = req.body.amount;
  if (!amount) {
    res.json({
      error: "not found amount"
    });
  }
  let balance = await bananojs.getAccountBalance(wallet.address)
  balance = await bananojs.rawToBan(balance);

  if (balance >= amount) {
    let random = betService.getRandomHash();
    let hash = betService.getSHA256(random);
  
    let a = await bananojs.banToRaw(amount);
    let block = await bananojs.send(wallet.wallet,wallet.address,wallet.email,a,hash); 
    
    res.json({
      wallet: wallet.address
    });
  }else{
    res.json({
      error: "insuficient funds"
    });
  }

 
}); 

module.exports = router;
