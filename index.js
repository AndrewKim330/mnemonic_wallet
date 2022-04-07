const express = require('express');
const app = express();
const port = 8080;
const bodyParser = require('body-parser')
const fs = require('fs')


// Using lightwallet module
const lightwallet = require("eth-lightwallet");

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json())

// Endpoint of post method
app.post('/getArbitMnemonic', async(req,res) => {
   let mnemonic;
   try {
       mnemonic = lightwallet.keystore.generateRandomSeed();
       res.json({mnemonic});
   }
   catch(e) {
       console.log(e);
       return e;
   }
});

app.post('/getNewMnemonicWallet', async(req,res) => {
    let mnemonic = req.body.mnemonic;
    let password = req.body.password;
   
   try {
       lightwallet.keystore.createVault(
           {
                password: password,
                seedPhrase: mnemonic,
                hdPathString: "m/0'/0'/0'"
           },
       
            (error, keyStore) => {
                keyStore.keyFromPassword(password, (error, pwDerivedKey) => {
                    keyStore.generateNewAddress(pwDerivedKey, 1);

                    let address = (keyStore.getAddresses()).toString();
                    let keystore = keyStore.serialize();

                    // res.json({keystore: keystore, address: address})
                    
                    fs.writeFile('wallet.json', keystore, (e, data) => {
                        if(e) {
                            res.json({code:400, message:"fail"})
                        }
                        else {
                            res.json({code:200, message:"success"})
                        }
                    })
                })
            }
       )
   }
   catch(e) {
       console.log(e);
       return e;
   }
});

app.listen(port, () => {
    console.log("listening...");
})