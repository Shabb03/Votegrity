<template>
    <div class="publishbutton">
        <v-btn class="pageButton" variant="tonal" size="large" rounded="lg" elevation="8" @click="goToPublish">Publish&nbsp;&nbsp;&nbsp;Election</v-btn>
    </div>
</template>

<script>
export default {
    name: 'PublishButton',
    methods: {
        goToPublish() {
            this.$router.push('/admin/publishresults');
        },
    },
};
</script>

<style scoped>
@import '../../styles/pagebuttons.css';

.publishbutton {
    margin-right: 3em !important;
    margin-bottom: 3em !important;
    text-align: right;
}
</style>