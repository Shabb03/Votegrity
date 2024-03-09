<template>
    <div class="deletebutton">
        <v-btn class="pageButton" variant="tonal" size="large" rounded="lg" elevation="8" @click="goToDelete">Delete&nbsp;&nbsp;&nbsp;Account</v-btn>
    </div>
</template>

<script>
export default {
    name: 'DeleteButton',
    methods: {
        goToDelete() {
            this.$router.push('/deleteaccount');
        },
    },
};
</script>

<style scoped>
@import '../../styles/pagebuttons.css';

.deletebutton {
    margin-top: 5em !important;
    margin-right: 3em !important;
    text-align: right;
}
</style>