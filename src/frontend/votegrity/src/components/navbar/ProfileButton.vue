<template>
    <v-btn variant="tonal" @click="goToRoute">Profile</v-btn>
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
.v-btn {
    font-size: 1.2em;
    font-weight: bold;
    margin-right: 1.5em;
    background-color: #00e5ff;
    border: 3px solid #000;
}
</style>