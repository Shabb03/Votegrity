<template>
    <IsAdmin/>
    <NavigationBar>
        <component :is="logoutButton"></component>
    </NavigationBar>
    <PageTitle/>
    <DashboardContainer/>
</template>
  
<script>
import IsAdmin from "../components/status/IsAdmin.vue";
import { markRaw } from "vue";
import NavigationBar from '../components/navbar/NavigationBar.vue';
import LogoutButton from '../components/navbar/LogoutButton.vue';
import PageTitle from '../components/titles/PageTitle.vue';
import DashboardContainer from '../components/containers/DashboardContainer.vue';

export default {
    components: {
        IsAdmin,
        NavigationBar,
        LogoutButton,
        PageTitle,
        DashboardContainer,
    },
    data() {
        return {
            logoutButton: markRaw(LogoutButton),
        };
    },
}
</script>
  
<style scoped>
</style>  