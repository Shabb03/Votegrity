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

.v-btn:hover {
    cursor: 'pointer';
    color: #2616bb;
    background-color: white;
    box-shadow: 0 12px 16px 0 rgba(0,0,0,0.24), 0 17px 50px 0 rgba(0,0,0,0.19);
}
</style>