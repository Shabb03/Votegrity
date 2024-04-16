const AWS = require('aws-sdk'); AWS
require('dotenv').config();

// Initialize AWS SDK with environment variables
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

const s3 = new AWS.S3();
const kms = new AWS.KMS();

// Function to store encrypted admin keys on S3
async function storeEncryptedAdminKeysOnS3(bucketName, encryptedAdminKey, adminName) {
    try {
        const params = {
            Bucket: bucketName,
            Key: `encrypted-${adminName}-key.txt`,
            Body: encryptedAdminKey,
            ContentType: 'text/plain' // Set content type accordingly
        };
        const data = await s3.upload(params).promise();
        return data.Key;
        console.log('File uploaded successfully:', data.Location);
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
        const data = await s3.getObject(params).promise();
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
        const adminKeyBuffer = Buffer.from(adminKey, 'utf8');
        const params = {
            KeyId: adminKeyId,
            Plaintext: adminKeyBuffer
        };

        // Encrypt the admin key using AWS KMS
        const data = await kms.encrypt(params).promise();
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
        const data = await kms.decrypt(params).promise();
        const decryptedAdminKey = data.Plaintext.toString('utf8');

        return decryptedAdminKey;
    } catch (error) {
        console.error('Error decrypting admin key:', error);
        return null;
    }
}

module.exports = { storeEncryptedAdminKeysOnS3, downloadEncryptedAdminKeysFromS3, encryptAdminKey, decryptAdminKey }
