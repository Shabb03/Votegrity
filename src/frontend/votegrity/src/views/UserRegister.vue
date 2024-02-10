<template>
    <NotLoggedIn/>
    <PageTitle/>
    <RegisterForm/>
</template>
  
<script>
import NotLoggedIn from '../components/status/NotLoggedIn.vue';
import PageTitle from '../components/titles/PageTitle.vue';
import RegisterForm from '../components/forms/RegisterForm.vue';

export default {
    components: {
        NotLoggedIn,
        PageTitle,
        RegisterForm,
    },
}
</script>
  
<style scoped>
</style>  