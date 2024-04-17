const AWS = require('aws-sdk');

const AES = require('crypto-js');

const {
    KMS,
    KeySpec
} = require('@aws-sdk/client-kms');

const {
    Upload
} = require('@aws-sdk/lib-storage');

const {
    S3
} = require('@aws-sdk/client-s3');

require('dotenv').config();
const paillier = require('paillier-bigint');
const kmsKeyId = process.env.AWS_KMS_KEY_ID;

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

const s3 = new S3({
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    },

    region: process.env.AWS_REGION
});
const kms = new KMS({
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    },

    region: process.env.AWS_REGION
});

// Function to store encrypted admin keys on S3
async function storeEncryptedAdminBlindKeysOnS3(bucketName, encryptedAdminKey, adminName) {
    try {
        const params = {
            Bucket: bucketName,
            Key: `encrypted-${adminName}-blind.txt`,
            Body: encryptedAdminKey,
            ContentEncoding: 'utf-8',
            ContentType: 'text/plain' // Set content type accordingly
        };
        const data = await new Upload({
            client: s3,
            params
        }).done();
        console.log('File uploaded successfully:', data.Location);
        return data.Key;
    } catch (error) {
        console.error('Error uploading file to S3:', error);
    }
}

// Function to store encrypted admin keys on S3
async function storeEncryptedAdminPaillierKeysOnS3(bucketName, encryptedAdminKey, adminName) {
    try {
        const params = {
            Bucket: bucketName,
            Key: `encrypted-${adminName}-paillier.txt`,
            Body: encryptedAdminKey,
            ContentEncoding: 'utf-8',
            ContentType: 'text/plain' // Set content type accordingly
        };
        const data = await new Upload({
            client: s3,
            params
        }).done();
        console.log('File uploaded successfully:', data.Location);
        return data.Key;
    } catch (error) {
        console.error('Error uploading file to S3:', error);
    }
}

// Function to download the encrypted admin keys from S3
async function downloadEncryptedAdminKeysFromS3(bucketName, objectKey) {
    try {
        const params = {
            Bucket: bucketName,
            Key: objectKey
        };
        const data = await s3.getObject(params);
        const streamToString = await data.Body?.transformToString("utf-8");
        return streamToString;
    } catch (error) {
        console.error('Error downloading encrypted admin keys from S3:', error);
        return null;
    }
}

// Function to encrypt admin key using AWS KMS
async function encryptAdminKey(adminKey) {
    try {
        // Parameters for KMS data key generation
        const params = {
            KeyId: kmsKeyId,
        };

        // generate data keys for the admin key using AWS KMS
        const data = await kms.generateDataKey(params);
        console.log('Generated data key:', data.Plaintext.toString('utf-8')); // The plaintext data key
        console.log('Encrypted data key:', data.CiphertextBlob.toString('utf-8')); // The encrypted data key

        //console.log(AES.AES.encrypt(adminKey, data.CiphertextBlob.toString('base64')))

    } catch (error) {
        console.error('Error encrypting admin key:', error);
        return null;
    }
}

// Function to decrypt admin key using AWS KMS
async function decryptAdminKey(encryptedAdminKey) {
    try {
        // Parameters for KMS decryption operation
        const params = {
            CiphertextBlob: Buffer.from(encryptedAdminKey, 'utf-8')
        };

        // Decrypt the admin key using AWS KMS
        const data = await kms.decrypt(params);
        const decryptedAdminKey = data.Plaintext.toString('utf-8');

        return decryptedAdminKey;
    } catch (error) {
        console.error('Error decrypting admin key:', error);
        return null;
    }
}

async function main()
{
    const {publicKey, privateKey } = await paillier.generateRandomKeys(2048);
    const privateKeyJsonString = JSON.stringify(privateKey, (_, v) => typeof v === 'bigint' ? v.toString() : v);
    console.log(privateKeyJsonString.length);
    await storeEncryptedAdminPaillierKeysOnS3("votegritybucket", privateKeyJsonString, "thomas");
    //const publicKeyObject = privateKeyJsonObject.publicKey;
    //console.log(publicKeyObject);
    //const privateKeyReturned = new paillier.PrivateKey(BigInt(privateKeyJsonObject.lambda), BigInt(privateKeyJsonObject.mu), publicKey, BigInt(privateKeyJsonObject._p), BigInt(privateKeyJsonObject._q));
    //const publicKeyTest = new paillier.PublicKey(BigInt(privateKeyJsonObject.publicKey.n), BigInt(privateKeyJsonObject.publicKey.g));
    //console.log(publicKey);
    //console.log(publicKeyTest);
}

main();

module.exports = {storeEncryptedAdminBlindKeysOnS3, storeEncryptedAdminPaillierKeysOnS3, downloadEncryptedAdminKeysFromS3, encryptAdminKey, decryptAdminKey}
