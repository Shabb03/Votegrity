<template>
    <PageTitle/>
    <PageSubTitle :pageSubTitle="pageSubTitle" />
    <HomeButton/>
</template>
  
<script>
import PageTitle from '../components/titles/PageTitle.vue';
import PageSubTitle from '../components/titles/PageSubTitle.vue';
import HomeButton from '../components/buttons/HomeButton.vue';

export default {
    components: {
        PageTitle,
        PageSubTitle,
        HomeButton,
    },
    data() {
        return {
            pageSubTitle: 'Uh oh, Looks like the page you are trying to access does not exist',
        };
    },
}
</script>
  
<style scoped>
</style>  