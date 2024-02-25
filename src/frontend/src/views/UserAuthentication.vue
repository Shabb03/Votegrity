<template>
    <NotAuthenticated/>
    <NavigationBar>
        <component :is="logoutButton"></component>
    </NavigationBar>
    <PageTitle/>
    <CodeInput :title="title" :button="button" :getApiUrl="getApiUrl" :postApiUrl="postApiUrl" :routeUrl="routeUrl" :successCardMessage="successMessage"/>
</template>
  
<script>
import NotAuthenticated from "../components/status/NotAuthenticated.vue";
import { markRaw } from "vue";
import NavigationBar from '../components/navbar/NavigationBar.vue';
import LogoutButton from '../components/navbar/LogoutButton.vue';
import PageTitle from '../components/titles/PageTitle.vue';
import CodeInput from "../components/inputs/CodeInput.vue";

export default {
    components: {
        NotAuthenticated,
        NavigationBar,
        LogoutButton,
        PageTitle,
        CodeInput,
    },
    data() {
        return {
            logoutButton: markRaw(LogoutButton),
            title: 'Verify Your Account',
            button: 'Verify',
            getApiUrl: '/user/registertoken',
            postApiUrl: '/user/authenticateaccount',
            routeUrl: '/vote',
            successMessage: 'You have successfully authenticated your account',
        };
    },
}
</script>
  
<style scoped>
</style>  