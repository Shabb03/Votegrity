const { Voter } = require('../sequelize');
const { generateKeyPairSync, privateDecrypt } = require('crypto');

const secretKey = 'sharedSecretKey';

exports.gettest = async (req, res) => {
    try {
        const user = await Voter.findByPk(1);

        if (!user.privateKey || !user.publicKey) {
            const { privateKey, publicKey } = generateKeyPairSync('rsa', {
                modulusLength: 2048, // the length of your key in bits
                publicKeyEncoding: {
                    type: 'spki',
                    format: 'pem',
                },
                    privateKeyEncoding: {
                    type: 'pkcs8',
                    format: 'pem',
                },
            });

            console.log("publickey", publicKey);
            console.log("privatekey", privateKey);

            user.privateKey = privateKey;
            user.publicKey = publicKey;
            await user.save();
        }
        return res.json({privateKey: user.privateKey, publicKey: user.publicKey});
    } 
    catch (error) {
        console.log(error);
        res.status(500).send({error: 'An error has occured', message: error});
    }
}

exports.posttest = async (req, res) => {
    try {
        const user = await Voter.findByPk(1);
        const privateKey = user.privateKey;

        const { encryptedPassword } = req.body;
        const encryptedData = Buffer.from(encryptedPassword)
        console.log("encryptedData", encryptedData);
        const decryptedData = privateDecrypt(
            privateKey,
            encryptedData
        );
        console.log("DECRYPTED DATA", decryptedData.toString('utf-8'));
        return res.json({message: decryptedData.toString('utf-8')})
    } 
    catch (error) {
        console.log(error);
        res.status(500).send({error: 'An error has occured', message: error});
    }
}