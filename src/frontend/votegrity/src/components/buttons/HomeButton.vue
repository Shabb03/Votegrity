<template>
    <div class="homebutton">
        <v-btn variant="tonal" size="x-large" rounded="lg" elevation="8" @click="goToHome">Return&nbsp;&nbsp;&nbsp;Home</v-btn>
    </div>
</template>

<script>
export default {
    name: 'HomeButton',
    methods: {
        goToHome() {
            this.$router.push('/');
        },
    },
};
</script>

<style scoped>
.homebutton {
    margin-top: 4em !important;
    text-align: center;
}
.v-btn {
    text-align: center;
    font-size: 1.5em;
    font-weight: bold;
    background-color: #00e5ff;
    border: 3px solid #000;
}
</style>