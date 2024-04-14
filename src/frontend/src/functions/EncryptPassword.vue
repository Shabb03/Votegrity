<template>
    <div></div>
</template>

<script>
import CryptoJS from 'crypto-js';
const secretKey = 'yeJ9bz3LGO';

//encrypt the user's password using symmetric encryption
export default async function encryptPassword(password) {
    const encryptedPassword = CryptoJS.AES.encrypt(password, secretKey).toString();
    return encryptedPassword;
}
</script>