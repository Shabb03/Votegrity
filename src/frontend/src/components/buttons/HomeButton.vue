<template>
    <div class="homebutton">
        <v-btn class="pageButton primary" variant="tonal" size="x-large" rounded="lg" elevation="8" @click="goToHome">Return&nbsp;&nbsp;&nbsp;Home</v-btn>
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
@import '../../styles/pagebuttons.css';

.homebutton {
    margin-top: 4em !important;
    text-align: center;
}
</style>