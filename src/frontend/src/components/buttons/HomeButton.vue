<template>
    <div class="homebutton">
        <v-btn class="primary" variant="tonal" size="x-large" rounded="lg" elevation="8" @click="goToHome">Return&nbsp;&nbsp;&nbsp;Home</v-btn>
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
.primary {
    text-align: center;
    font-size: 1.5em;
    font-weight: bold;
    background-color: #00e5ff;
    border: 3px solid #000;
}

.primary:hover, 
.primary:focus {
    cursor: 'pointer';
    font-weight: bolder;
    box-shadow: 0 12px 16px 0 rgba(0,0,0,0.24), 0 17px 50px 0 #2616bb;
    transform: translateY(-0.25em);
}
</style>