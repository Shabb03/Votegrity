<template>
    <v-btn class="navButton primary" variant="tonal" @click="goToRoute">Profile</v-btn>
</template>

<script>
export default {
    name: 'ProfileButton',
    methods: {
        goToRoute() {
            this.$router.push('/profile');
        },
    },
};
</script>

<style scoped>
@import '../../styles/navbar.css';
</style>