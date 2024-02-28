<template>
    <IsAdmin/>
    <NavigationBar>
        <component :is="dashBoardButton"></component>
        <component :is="logoutButton"></component>
    </NavigationBar>
    <PageTitle/>
    <ElectionForm/>
</template>
    
<script>
import IsAdmin from "../components/status/IsAdmin.vue";
import { markRaw } from "vue";
import NavigationBar from '../components/navbar/NavigationBar.vue';
import DashboardButton from "../components/navbar/DashboardButton.vue";
import LogoutButton from '../components/navbar/LogoutButton.vue';
import PageTitle from '../components/titles/PageTitle.vue';
import ElectionForm from '../components/forms/ElectionForm.vue';
  
export default {
    components: {
        IsAdmin,
        NavigationBar,
        DashboardButton,
        LogoutButton,
        PageTitle,
        ElectionForm,
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