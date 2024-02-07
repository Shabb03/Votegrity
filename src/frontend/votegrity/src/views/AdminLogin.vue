<template>
    <NotLoggedIn/>
    <PageTitle/>
    <AdminLoginForm/>
</template>
  
<script>
import NotLoggedIn from '../components/status/NotLoggedIn.vue';
import PageTitle from '../components/titles/PageTitle.vue';
import AdminLoginForm from '../components/forms/AdminLoginForm.vue';

export default {
    components: {
        NotLoggedIn,
        PageTitle,
        AdminLoginForm,
    },
}
</script>
  
<style scoped>
</style>  