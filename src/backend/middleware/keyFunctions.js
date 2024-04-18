const AWS = require('aws-sdk');
const bucketName = "votegritybucket";

const {
    Upload
} = require('@aws-sdk/lib-storage');

const {
    S3
} = require('@aws-sdk/client-s3');

require('dotenv').config();
const paillier = require('paillier-bigint');

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

// Function to store encrypted admin keys on S3
async function storeEncryptedAdminBlindKeysOnS3(blindPrivateKey, adminName) {
    try {
        const params = {
            Bucket: bucketName,
            Key: `encrypted-${adminName}-blind.txt`,
            Body: blindPrivateKey,
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
async function storeEncryptedAdminPaillierKeysOnS3(bucketName, paillierPrivateKey, adminName) {
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

// Function to download the encrypted admin keys from S3
async function downloadAdminKeysFromS3(bucketName, objectKey) {
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

async function main()
{
    const {publicKey, privateKey } = await paillier.generateRandomKeys(2048);
    const privateKeyJsonString = JSON.stringify(privateKey, (_, v) => typeof v === 'bigint' ? v.toString() : v);
    console.log(privateKeyJsonString);
    await storeEncryptedAdminPaillierKeysOnS3("votegritybucket", privateKey, "thomas");


    //const publicKeyObject = privateKeyJsonObject.publicKey;
    //console.log(publicKeyObject);
    //const privateKeyReturned = new paillier.PrivateKey(BigInt(privateKeyJsonObject.lambda), BigInt(privateKeyJsonObject.mu), publicKey, BigInt(privateKeyJsonObject._p), BigInt(privateKeyJsonObject._q));
    //const publicKeyTest = new paillier.PublicKey(BigInt(privateKeyJsonObject.publicKey.n), BigInt(privateKeyJsonObject.publicKey.g));
    //console.log(publicKey);
    //console.log(publicKeyTest);
}

main();

module.exports = {storeEncryptedAdminBlindKeysOnS3, storeEncryptedAdminPaillierKeysOnS3, downloadAdminKeysFromS3}
