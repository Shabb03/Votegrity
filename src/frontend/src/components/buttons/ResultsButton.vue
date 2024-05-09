<template>
    <div class="resultsbutton">
        <v-btn class="pageButton" variant="tonal" size="large" rounded="lg" elevation="8" @click="goToResults">View&nbsp;&nbsp;Results</v-btn>
    </div>
</template>

<script>
export default {
    name: 'ResultsButton',
    methods: {
        goToResults() {
            this.$router.push('/results');
        },
    },
};
</script>

<style scoped>
@import '../../styles/pagebuttons.css';

.resultsbutton {
    margin-right: 3em !important;
    margin-bottom: 3em !important;
    text-align: right;
}
</style>