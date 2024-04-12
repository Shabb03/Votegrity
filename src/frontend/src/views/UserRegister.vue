<template>
    <NotLoggedIn/>
    <NavigationBar>
        <component :is="loginButton"></component>
    </NavigationBar>
    <PageTitle/>
    <RegisterForm/>
</template>
  
<script>
import NotLoggedIn from '../components/status/NotLoggedIn.vue';
import { markRaw } from "vue";
import NavigationBar from '../components/navbar/NavigationBar.vue';
import LoginButton from '../components/navbar/LoginButton.vue';
import PageTitle from '../components/titles/PageTitle.vue';
import RegisterForm from '../components/forms/RegisterForm.vue';

export default {
    components: {
        NotLoggedIn,
        NavigationBar,
        LoginButton,
        PageTitle,
        RegisterForm,
    },
    data() {
        return {
            loginButton: markRaw(LoginButton),
        };
    },
}
</script>
  
<style scoped>
</style>  