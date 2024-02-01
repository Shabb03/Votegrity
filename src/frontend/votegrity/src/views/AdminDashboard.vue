<template>
    <NavigationBar>
        <component :is="logoutButton"></component>
    </NavigationBar>
    <PageTitle/>
    <DashboardContainer/>
</template>
  
<script>
import { markRaw } from "vue";
import NavigationBar from '../components/NavigationBar.vue';
import LogoutButton from '../components/LogoutButton.vue';
import PageTitle from '../components/PageTitle.vue';
import DashboardContainer from '../components/DashboardContainer.vue';

export default {
    components: {
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