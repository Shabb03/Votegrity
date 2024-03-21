<template>
    <v-btn class="navButton primary" variant="tonal" @click="goToDashboard">Dashboard</v-btn>
</template>

<script>
export default {
    name: 'DashboardButton',
    methods: {
        goToDashboard() {
            this.$router.push('/admin/dashboard');
        },
    },
};
</script>

<style scoped>
@import '../../styles/navbar.css';
</style>