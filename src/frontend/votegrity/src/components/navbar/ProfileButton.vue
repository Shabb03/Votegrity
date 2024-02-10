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

.v-btn:hover {
    cursor: 'pointer';
    color: #00e5ff;
    background-color: black;
    box-shadow: 0 12px 16px 0 rgba(0,0,0,0.24), 0 17px 50px 0 rgba(0,0,0,0.19);
}
</style>