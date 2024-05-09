<template>
    <NotLoggedIn/>
    <NavigationBar>
        <component :is="registerButton"></component>
    </NavigationBar>
    <PageTitle/>
    <LoginForm/>
</template>
  
<script>
import NotLoggedIn from '../components/status/NotLoggedIn.vue';
import { markRaw } from "vue";
import NavigationBar from '../components/navbar/NavigationBar.vue';
import RegisterButton from '../components/navbar/RegisterButton.vue';
import PageTitle from '../components/titles/PageTitle.vue';
import LoginForm from '../components/forms/LoginForm.vue';

export default {
    components: {
        NotLoggedIn,
        NavigationBar,
        RegisterButton,
        PageTitle,
        LoginForm,
    },
    data() {
        return {
            registerButton: markRaw(RegisterButton),
        };
    },
}
</script>
  
<style scoped>
</style>  