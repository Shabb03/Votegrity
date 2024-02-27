<template>
    <IsAdmin/>
    <NavigationBar>
        <component :is="dashBoardButton"></component>
        <component :is="logoutButton"></component>
    </NavigationBar>
    <PageTitle/>
    <!--<ResetForm/>-->
    <CodeInput :title="title" :button="button" :getApiUrl="getApiUrl" :postApiUrl="postApiUrl" :routeUrl="routeUrl" :successCardMessage="successMessage"/>
</template>
  
<script>
import IsAdmin from "../components/status/IsAdmin.vue";
import { markRaw } from "vue";
import NavigationBar from '../components/navbar/NavigationBar.vue';
import DashboardButton from "../components/navbar/DashboardButton.vue";
import LogoutButton from '../components/navbar/LogoutButton.vue';
import PageTitle from '../components/titles/PageTitle.vue';
//import ResetForm from '../components/forms/ResetForm.vue';
import CodeInput from "../components/inputs/CodeInput.vue";

export default {
    components: {
        IsAdmin,
        NavigationBar,
        DashboardButton,
        LogoutButton,
        PageTitle,
        //ResetForm,
        CodeInput,
    },
    data() {
        return {
            dashBoardButton: markRaw(DashboardButton),
            logoutButton: markRaw(LogoutButton),
            title: 'Confirmation Code',
            button: 'Reset',
            getApiUrl: '/admin/resettoken',
            postApiUrl: '/admin/reset',
            routeUrl: '/createelection',
            successMessage: 'You have successfully reset the election',
        };
    },
}
</script>
  
<style scoped>
</style>  