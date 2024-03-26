<template>
    <div></div>
</template>

<script>
import crypto from './crypto'
import axios from 'axios';

/*
async function getPublicKey(email) {
    const postData = {email: email};
    const response = await axios.post('http://localhost:3000/api/user/publickey', postData);
    const publicKey = response.data.publicKey;
    return publicKey;
}
*/

async function getPublicKey(electionId) {
    const postData = {electionId: electionId};
    const response = await axios.post('http://localhost:3000/api/admin/publickey', postData);
    console.log(response.data);
    const publicKey = response.data.publicKey;
    console.log(publicKey);
    return publicKey;
}

export default async function encryptKey(electionId, publishKey) {
    const publicKey = await getPublicKey(electionId);
    const encryptedData = crypto.publicEncrypt(
        publicKey,
        Buffer.from(publishKey)
    );
    return encryptedData;
}
</script>