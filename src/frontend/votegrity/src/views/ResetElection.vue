<template>
    <NavigationBar>
        <component :is="logoutButton"></component>
    </NavigationBar>
    <PageTitle/>
    <!--<ResetForm/>-->
    <CodeInput :title="title" :button="button" :getApiUrl="getApiUrl" :postApiUrl="postApiUrl" :routeUrl="routeUrl"/>
</template>
  
<script>
import { markRaw } from "vue";
import NavigationBar from '../components/navbar/NavigationBar.vue';
import LogoutButton from '../components/navbar/LogoutButton.vue';
import PageTitle from '../components/titles/PageTitle.vue';
//import ResetForm from '../components/forms/ResetForm.vue';
import CodeInput from "../components/inputs/CodeInput.vue";

export default {
    components: {
        NavigationBar,
        LogoutButton,
        PageTitle,
        //ResetForm,
        CodeInput,
    },
    data() {
        return {
            logoutButton: markRaw(LogoutButton),
            title: 'Confirmation Code',
            button: 'Reset',
            getApiUrl: '/admin/resettoken',
            postApiUrl: '/admin/reset',
            routeUrl: '/createelection',
        };
    },
}
</script>
  
<style scoped>
</style>  