const {User} = require('../sequelize/sequelize');
const bananojs = require('bananojs')('http://localhost:7072');

createUser = async (ban_address,password,balance) =>{
    let { wallet, seed } = await bananojs.createWallet();
    let account = await bananojs.createAccount(wallet); 
    return new Promise((resolve, reject) => {
        User.create({ban_address: ban_address, password:password, enabled:'1',
            address:account, pk:seed, wallet: wallet, balance:balance})
        .then((data) => {             
            resolve(data);
        }).catch(error => { 
            reject(error);
        }); 
    });
}

getUserById = async (idx) =>{
    return new Promise((resolve, reject) => {
        User.findAll({raw: true, where: {            
            idx : idx,
            enabled : '1'          
          }})
        .then((data) => { 
            resolve(data);
        }).catch(error => { 
            reject(error);
        }); 
    });
}

getUserByEmail = async (email) =>{
    return new Promise((resolve, reject) => {
        User.findAll({raw: true, where: {            
            email : email,
            enabled : '1'          
          }})
        .then((data) => { 
            resolve(data);
        }).catch(error => { 
            reject(error);
        }); 
    });
}

module.exports = {
    createUser : createUser,
    getUserById: getUserById,
    getUserByEmail: getUserByEmail
}