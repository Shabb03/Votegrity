<template>
    <NotLoggedIn/>
    <PageTitle/>
    <LoginForm/>
</template>
  
<script>
import NotLoggedIn from '../components/status/NotLoggedIn.vue';
import PageTitle from '../components/titles/PageTitle.vue';
import LoginForm from '../components/forms/LoginForm.vue';

export default {
    components: {
        NotLoggedIn,
        PageTitle,
        LoginForm,
    },
}
</script>
  
<style scoped>
</style>  