<template>
    <NavigationBar>
        <component :is="profileButton"></component>
        <component :is="logoutButton"></component>
    </NavigationBar>
    <PageTitle/>
    <WinnerContainer/>
</template>
  
<script>
import { markRaw } from "vue";
import NavigationBar from '../components/NavigationBar.vue';
import ProfileButton from '../components/ProfileButton.vue';
import LogoutButton from '../components/LogoutButton.vue';
import PageTitle from '../components/PageTitle.vue';
import WinnerContainer from '../components/WinnerContainer.vue';

export default {
    components: {
        NavigationBar,
        ProfileButton,
        LogoutButton,
        PageTitle,
        WinnerContainer,
    },
    data() {
        return {
            profileButton: markRaw(ProfileButton),
            logoutButton: markRaw(LogoutButton),
        };
    },
}
</script>
  
<style scoped>
</style>  