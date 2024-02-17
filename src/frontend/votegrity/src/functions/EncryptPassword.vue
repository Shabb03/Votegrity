<template>
    <div></div>
</template>

<script>
import bcrypt from 'bcryptjs';

export default async function hashPassword(password) {
    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return hashedPassword;
    } catch (error) {
        console.log('Error hashing password:', error);
        return password;
    }
}
</script>