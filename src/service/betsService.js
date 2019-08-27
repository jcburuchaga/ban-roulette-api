const {Bets} = require('../sequelize/sequelize');
const bananojs = require('bananojs')('http://localhost:7072');
const crypto = require('crypto');
const random = require('random-hash');

createBet = async (user_id,hash_client,hash_server,result,amount,bet,tx_hash,state) =>{ 
    return new Promise((resolve, reject) => {
        Bets.create({user_id: user_id, hash_client:hash_client, hash_server:hash_server,
            result:result, amount:amount, bet: bet, tx_hash:tx_hash, state:state, created : new Date()})
        .then((data) => {            
            resolve(data);
        }).catch(error => { 
            reject(error);
        }); 
    });
}

updateBet = async (bet_id,amount,bet,tx_hash,state) =>{ 
    return new Promise((resolve, reject) => {
        Bets.update({amount:amount, bet: bet, tx_hash:tx_hash , state:state},{where: {            
            idx : bet_id
          }})
        .then((data) => {            
            resolve(data);
        }).catch(error => { 
            reject(error);
        }); 
    });
}

getBetById = async (idx) =>{
    return new Promise((resolve, reject) => {
        Bets.findOne({raw: true, where: {            
            idx : idx        
          }})
        .then((data) => { 
            resolve(data);
        }).catch(error => { 
            reject(error);
        }); 
    });
}

getBetsByUser = async (user_id) =>{
    return new Promise((resolve, reject) => {
        Bets.findAll({raw: true, where: {            
            user_id : user_id,
            state : 'completed',
            created : new Date()
          }})
        .then((data) => { 
            let bets_filtered = [];
            data.forEach(d => {
                let x =
                { 
                    result : d.result,
                    hash_server : d.hash_server,
                    hash_client : d.hash_client, 
                    created : d.created,
                    amount : d.amount,
                    bet : d.bet
                };
                bets_filtered.push(x);
            }); 
            resolve(bets_filtered); 
        }).catch(error => { 
            reject(error);
        }); 
    });
}
getBetByClientHash = async (hash) =>{
    return new Promise((resolve, reject) => {
        Bets.findOne({raw: true, where: {            
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
    getSHA256 : getSHA256,
    getRandomHash: getRandomHash,
    getBetsByUser: getBetsByUser,
    updateBet : updateBet

}