const AWS = require('aws-sdk');

const {
    Upload
} = require('@aws-sdk/lib-storage');

const {
    S3
} = require('@aws-sdk/client-s3');

require('dotenv').config({ path: '../.env' });

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

const paillier = require('paillier-bigint');
const bucketName = "votegritybucket";
const blind = require('blind-signatures');
const NodeRSA = require('node-rsa');

// Function to store encrypted admin keys on S3
async function storeEncryptedAdminBlindKeysOnS3(blindKeys, adminName) {
    try {
        const exportedKey = blindKeys.exportKey();

        const params = {
            Bucket: bucketName,
            Key: `encrypted-${adminName}-blind.txt`,
            Body: exportedKey,
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
async function storeEncryptedAdminPaillierKeysOnS3(paillierPrivateKey, adminName) {
    try {
        const privateKeyJsonString = JSON.stringify(paillierPrivateKey, (_, v) => typeof v === 'bigint' ? v.toString() : v);

        const params = {
            Bucket: bucketName,
            Key: `encrypted-${adminName}-paillier.txt`,
            Body: privateKeyJsonString,
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

async function downloadPaillierKeysFromS3(objectKey) {
    try {
        const params = {
            Bucket: bucketName,
            Key: objectKey
        };
        const data = await s3.getObject(params);
        const streamToString = await data.Body?.transformToString("utf-8");
        
        const streamAsJson = JSON.parse(streamToString);
        const publicKey = new paillier.PublicKey(BigInt(streamAsJson.publicKey.n), BigInt(streamAsJson.publicKey.g));
        const privateKey = new paillier.PrivateKey(BigInt(streamAsJson.lambda), BigInt(streamAsJson.mu), publicKey, BigInt(streamAsJson._p), BigInt(streamAsJson._q));
        return privateKey;
    } catch (error) {
        console.error('Error downloading paillier key from S3:', error);
        return null;
    }
}

async function downloadBlindKeysFromS3(objectKey)
{
    try {
        const params = {
            Bucket: bucketName,
            Key: objectKey
        };
        const data = await s3.getObject(params);
        const streamToString = await data.Body?.transformToString("utf-8");
        console.log(streamToString);

        const blindKeys = new NodeRSA(streamToString);
        return blindKeys;
    } catch (error) {
        console.error('Error downloading blind key from S3:', error);
        return null;
    }    
}

module.exports = {storeEncryptedAdminBlindKeysOnS3, storeEncryptedAdminPaillierKeysOnS3, downloadPaillierKeysFromS3, downloadBlindKeysFromS3}
