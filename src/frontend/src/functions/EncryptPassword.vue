<template>
    <div></div>
</template>

<script>
import CryptoJS from 'crypto-js';
const secretKey = 'yeJ9bz3LGO';

//encrypt the user's password using the public key
export default async function encryptPassword(password) {
    try {
        const encryptedPassword = CryptoJS.AES.encrypt(password, secretKey).toString();
        return encryptedPassword;
    } 
    catch (error) {
        console.log(error);
        return password;
    }
}
</script>