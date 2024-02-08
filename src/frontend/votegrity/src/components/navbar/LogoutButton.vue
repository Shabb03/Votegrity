<template>
    <v-btn variant="tonal" @click="logout">Logout</v-btn>
</template>

<script>
export default {
    name: 'LogoutButton',
    methods: {
        logout() {
            localStorage.setItem("votegrityToken", null);
            this.$router.push('/login');
        },
    },
};
</script>

<style scoped>
.v-btn {
    color: white;
    font-size: 1.2em;
    font-weight: bold;
    margin-right: 1.5em;
    background-color: #2616bb;
    border: 3px solid #000;
}
</style>