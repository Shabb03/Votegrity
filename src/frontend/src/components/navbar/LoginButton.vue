<template>
    <v-btn class="navButton primary" variant="tonal" @click="login">login</v-btn>
</template>

<script>
export default {
    name: 'LoginButton',
    methods: {
        async login() {
            this.$router.push('/login');
        },
    },
};
</script>

<style scoped>
@import '../../styles/navbar.css';
</style>