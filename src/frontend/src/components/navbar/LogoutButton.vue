<template>
    <v-btn class="navButton secondary" variant="tonal" @click="logout">Logout</v-btn>
</template>

<script>
import setToken from '../../functions/SetToken.vue';

export default {
    name: 'LogoutButton',
    methods: {
        async logout() {
            await setToken(null);
            this.$router.push('/login');
        },
    },
};
</script>

<style scoped>
@import '../../styles/navbar.css';
</style>