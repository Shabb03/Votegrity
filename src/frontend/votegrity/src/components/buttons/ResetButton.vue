<template>
    <div class="resetbutton">
        <v-btn variant="tonal" size="large" rounded="lg" elevation="8" @click="goToReset">Reset&nbsp;&nbsp;&nbsp;Election</v-btn>
    </div>
</template>

<script>
export default {
    name: 'HomeButton',
    methods: {
        goToReset() {
            this.$router.push('/admin/reset');
        },
    },
};
</script>

<style scoped>
.resetbutton {
    margin-top: 5em !important;
    margin-right: 3em !important;
    text-align: right;
}
.v-btn {
    text-align: center;
    font-size: 1.2em;
    font-weight: bold;
    background-color: #fff;
    border: 3px solid #000;
}
</style>