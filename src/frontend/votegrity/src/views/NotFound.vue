<template>
    <PageTitle/>
    <PageSubTitle :pageSubTitle="pageSubTitle" />
    <HomeButton/>
</template>
  
<script>
import PageTitle from '../components/PageTitle.vue';
import PageSubTitle from '../components/PageSubTitle.vue';
import HomeButton from '../components/HomeButton.vue';

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