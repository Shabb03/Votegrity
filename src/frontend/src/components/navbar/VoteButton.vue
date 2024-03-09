<template>
    <v-btn class="navButton primary" variant="tonal" @click="goToVote">Vote</v-btn>
</template>

<script>
export default {
    name: 'VoteButton',
    methods: {
        goToVote() {
            this.$router.push('/vote');
        },
    },
};
</script>

<style scoped>
@import '../../styles/navbar.css';
</style>