<template>
    <v-btn class="navButton primary" variant="tonal" @click="register">register</v-btn>
</template>

<script>
export default {
    name: 'RegisterButton',
    methods: {
        async register() {
            this.$router.push('/register');
        },
    },
};
</script>

<style scoped>
@import '../../styles/navbar.css';
</style>