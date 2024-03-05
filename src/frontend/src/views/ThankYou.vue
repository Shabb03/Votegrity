<template>
    <LoggedIn/>
    <NavigationBar>
        <component :is="profileButton"></component>
        <component :is="logoutButton"></component>
    </NavigationBar>
    <PageTitle/>
    <PageSubTitle :pageSubTitle="pageSubTitle" />
</template>
  
<script>
import LoggedIn from "../components/status/LoggedIn.vue";
import { markRaw } from "vue";
import NavigationBar from '../components/navbar/NavigationBar.vue';
import ProfileButton from '../components/navbar/ProfileButton.vue';
import LogoutButton from '../components/navbar/LogoutButton.vue';
import PageTitle from '../components/titles/PageTitle.vue';
import PageSubTitle from '../components/titles/PageSubTitle.vue';

export default {
    components: {
        LoggedIn,
        NavigationBar,
        ProfileButton,
        LogoutButton,
        PageTitle,
        PageSubTitle,
    },
    data() {
        return {
            profileButton: markRaw(ProfileButton),
            logoutButton: markRaw(LogoutButton),
            pageSubTitle: 'Each vote makes a difference',
        };
    },
}
</script>
  
<style scoped>
</style>  