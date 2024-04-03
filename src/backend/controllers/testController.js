const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })
const keyFunctions = require('../middleware/keyFunctions');
const db = require('../models/index.js');
const paillier = require('paillier-bigint');
const crypto = require('crypto');
const { Wallet } = require('ethers');

exports.gettest = async (req, res) => {
    try {
        const paillierKeys = await paillier.generateRandomKeys(2048);
        console.log(paillierKeys.privateKey);
        /*
        const admin = await db.Admin.findOne({ where: { email: 'rishabdev.sidhu2@mail.dcu.ie' } });
        console.log("ADMIN", admin);

        const { privateKey, publicKey } = await crypto.generateKeyPairSync('rsa', {
            modulusLength: 2048,
            publicKeyEncoding: {
                type: 'spki',
                format: 'pem'
            },
            privateKeyEncoding: {
                type: 'pkcs8',
                format: 'pem',
            }
        });
        const blindPublicKey = publicKey;
        const blindPrivateKey = privateKey;
        console.log("BLIND KEYS", blindPublicKey, blindPrivateKey);

        const paillierKeys = await paillier.generateRandomKeys(2048);
        console.log("PAILLIER KEYS\n\n", paillierKeys.publicKey, "\n\n", paillierKeys.privateKey);

        /*
        const admin = await db.Admin.create({
            email: email,
            password: hashedPassword,
            blindPublicKey: blindPublicKey,
            blindPrivateKey: blindPrivateKey,
            paillierPublicKey: paillierKeys.publicKey,
            paillierPrivateKey: paillierKeys.privateKey,
        });
        */

        /*
        console.log(admin.id, paillierKeys.privateKey);
        const testString = admin.id.toString();
        console.log("testSTRING\n\n\n", testString);
        const encryptedAdminKey = await keyFunctions.encryptAdminKey("1", paillierKeys.privateKey);
        console.log("ENCRYPTED ADMIN KEY", encryptedAdminKey);
        */
        //const privateKeyPath = await keyFunctions.storeEncryptedAdminKeysOnS3('votegritybucket2', encryptedAdminKey, admin.email);
        //console.log("PRIVATE KEY PATH", privateKeyPath);

        /*
        await admin.Update({ blindPublicKey: blindPublicKey });
        await admin.Update({ blindPrivateKey: blindPrivateKey });
        await admin.Update({ paillierPublicKey: paillierKeys.publicKey });
        await admin.Update({ paillierPrivateKey: paillierKeys.privateKey });
        await admin.Update({ privateKeyPath: privateKeyPath });
        * /

        */

        console.log("ADMIN UPDATE", admin);

        return res.json({
            signaturePrivateKey: blindPrivateKey,
            encryptionPrivateKey: paillierKeys.privateKey,
            admin: admin,
        });
    } 
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.posttest = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await db.Voter.findOne({ where: { email: email } });
        const admin = await db.Admin.findByPk(1);

        const paillierKeys = await paillier.generateRandomKeys(2048);
        const adminPublicKey = paillierKeys.publicKey;
        console.log("adminPublicKey", adminPublicKey)

        const vote = await db.Vote.findByPk(2);

        const encryptedVote = await vote.encryptVote(adminPublicKey);
        console.log("encryptedVote", encryptedVote);

        res.json({vote: encryptedVote});

        //const { paillierPublicKey, paillierPrivateKey } = await paillier.generateRandomKeys(2048);
        
        /*
        const ethereumWallet = generateUserEthereumWallet();
  
        user.walletPrivateKey = ethereumWallet.privateKey;
        user.walletAddress = ethereumWallet.address;
        await user.save();

        res.json({ 
            user: user.email, 
            publicKey: paillierPublicKey,
            privateKey: paillierPrivateKey,
            walletPrivateKey: ethereumWallet.privateKey,
            walletAddress: ethereumWallet.address,
            message: 'User created successfully',
        });
        */
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }

    function generateUserEthereumWallet()
    {
        /*
        const privateKey = ethereumWallet.generate().getPrivateKey();
        const wallet = ethereumWallet.fromPrivateKey(privateKey);
        const address = '0x${wallet.getAddress().toString("hex")}';

        return {
            privateKey: privateKey.toString('hex'),
            address: address
        };
        */
        const wallet = Wallet.createRandom();
        console.log(wallet.privateKey);
        console.log(wallet.address);
        return {
            privateKey: wallet.privateKey,
            address: wallet.address
        };
    }
}