<template>
    <div></div>
</template>

<script>
import CryptoJS from 'crypto-js';

export default async function encryptPassword(password) {
    try {
        const secretKey = 'yeJ9bz3LGO';
        const encryptedPassword = CryptoJS.AES.encrypt(password, secretKey).toString();
        return encryptedPassword;
    } 
    catch (error) {
        console.log('Error hashing password:', error);
        return password;
    }
}
</script>