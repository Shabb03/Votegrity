<template>
    <v-btn class="navButton primary" variant="tonal" @click="goToElectionForm">Add Election</v-btn>
</template>

<script>
export default {
    name: 'AddElectionButton',
    methods: {
        goToElectionForm() {
            this.$router.push('/admin/createelection');
        },
    },
};
</script>

<style scoped>
@import '../../styles/navbar.css';
</style>