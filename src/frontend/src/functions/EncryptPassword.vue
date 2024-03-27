<template>
    <div></div>
</template>

<script>
import crypto from './crypto'
import axios from 'axios';

//get the user's public key
async function getPublicKey(email) {
    const postData = {email: email};
    const response = await axios.post('http://localhost:3000/api/user/publickey', postData);
    const publicKey = response.data.publicKey;
    return publicKey;
}

//encrypt the user's password using the public key
export default async function encryptPassword(email, password) {
    const publicKey = await getPublicKey(email);
    const encryptedData = crypto.publicEncrypt(
        publicKey,
        Buffer.from(password)
    );
    return encryptedData;
}
</script>