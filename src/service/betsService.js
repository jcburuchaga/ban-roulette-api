const {Bets} = require('../sequelize/sequelize');
const bananojs = require('bananojs')('http://localhost:7072');
const crypto = require('crypto');
const random = require('random-hash');

createBet = async (user_id,hash_client,hash_server,result,amount,bet,tx_hash,state) =>{ 
    return new Promise((resolve, reject) => {
        Bets.create({user_id: user_id, hash_client:hash_client, hash_server:hash_server,
            result:result, amount:amount, bet: bet, tx_hash:tx_hash, state:state, created : new Date(s)})
        .then((data) => {            
            resolve(data);
        }).catch(error => { 
            reject(error);
        }); 
    });
}

getBetById = async (idx) =>{
    return new Promise((resolve, reject) => {
        Bets.findAll({raw: true, where: {            
            idx : idx        
          }})
        .then((data) => { 
            resolve(data);
        }).catch(error => { 
            reject(error);
        }); 
    });
}

getBetByClientHash = async (hash) =>{
    return new Promise((resolve, reject) => {
        Bets.findAll({raw: true, where: {            
            hash_client : hash        
          }})
        .then((data) => { 
            resolve(data);
        }).catch(error => { 
            reject(error);
        }); 
    });
}

roll = () =>{
    return Math.floor(Math.random() * 36);
}

getRandomHash = () =>{
    return random.generateHash({ length: 10 });
}

getSHA256 = (word) =>{
    var hash = crypto.createHash('sha256').update(word).digest("hex");
    return hash;
}

module.exports = {
    createBet: createBet,
    getBetById: getBetById,
    getBetByClientHash : getBetByClientHash,
    roll : roll,

}