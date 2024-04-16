const AWS = require('aws-sdk');

const {
    KMS
} = require('@aws-sdk/client-kms');

const {
    Upload
} = require('@aws-sdk/lib-storage');

const {
    S3
} = require('@aws-sdk/client-s3');

require('dotenv').config();

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
async function storeEncryptedAdminKeysOnS3(bucketName, encryptedAdminKey, adminName) {
    try {
        const params = {
            Bucket: bucketName,
            Key: 'encrypted-${adminName}-key.txt',
            Body: encryptedAdminKey,
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
        return data.Body;
    } catch (error) {
        console.error('Error downloading encrypted admin keys from S3:', error);
        return null;
    }
}

// Function to encrypt admin key using AWS KMS
async function encryptAdminKey(adminKeyId, adminKey) {
    try {
        // Parameters for KMS encryption operation
        const params = {
            KeyId: adminKeyId,
            Plaintext: Buffer.from(adminKey, 'utf8')
        };

        // Encrypt the admin key using AWS KMS
        const data = await kms.encrypt(params);
        const encryptedAdminKey = data.CiphertextBlob.toString('base64');

        return encryptedAdminKey;
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
            CiphertextBlob: Buffer.from(encryptedAdminKey, 'base64')
        };

        // Decrypt the admin key using AWS KMS
        const data = await kms.decrypt(params);
        const decryptedAdminKey = data.Plaintext.toString('utf8');

        return decryptedAdminKey;
    } catch (error) {
        console.error('Error decrypting admin key:', error);
        return null;
    }
}

module.exports = {storeEncryptedAdminKeysOnS3, downloadEncryptedAdminKeysFromS3, encryptAdminKey, decryptAdminKey}
