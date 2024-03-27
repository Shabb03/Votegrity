<template>
    <div></div>
</template>

<script>
import crypto from './crypto'
import axios from 'axios';

//get the election's public key
async function getPublicKey(electionId) {
    const postData = {electionId: electionId};
    const response = await axios.post('http://localhost:3000/api/admin/publickey', postData);
    const publicKey = response.data.publicKey;
    return publicKey;
}

//encrypt the publish key using the public key
export default async function encryptKey(electionId, publishKey) {
    const publicKey = await getPublicKey(electionId);
    const encryptedData = crypto.publicEncrypt(
        publicKey,
        Buffer.from(publishKey)
    );
    return encryptedData;
}
</script>