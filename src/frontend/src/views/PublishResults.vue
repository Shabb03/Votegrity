<template>
    <IsAdmin/>
    <NavigationBar>
        <component :is="dashBoardButton"></component>
        <component :is="logoutButton"></component>
    </NavigationBar>
    <PageTitle/>
    <PublishForm/>
</template>
  
<script>
import IsAdmin from "../components/status/IsAdmin.vue";
import { markRaw } from "vue";
import NavigationBar from '../components/navbar/NavigationBar.vue';
import DashboardButton from "../components/navbar/DashboardButton.vue";
import LogoutButton from '../components/navbar/LogoutButton.vue';
import PageTitle from '../components/titles/PageTitle.vue';
import PublishForm from '../components/forms/PublishForm.vue';

export default {
    components: {
        IsAdmin,
        NavigationBar,
        DashboardButton,
        LogoutButton,
        PageTitle,
        PublishForm,
    },
    data() {
        return {
            dashBoardButton: markRaw(DashboardButton),
            logoutButton: markRaw(LogoutButton),
        };
    },
}
</script>
  
<style scoped>
</style>  