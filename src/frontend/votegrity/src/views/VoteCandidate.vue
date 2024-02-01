<template>
    <NavigationBar>
        <component :is="profileButton"></component>
        <component :is="logoutButton"></component>
    </NavigationBar>
    <PageTitle/>
    <VoteContainer/>
</template>
  
<script>
import { markRaw } from "vue";
import NavigationBar from '../components/NavigationBar.vue';
import ProfileButton from '../components/ProfileButton.vue';
import LogoutButton from '../components/LogoutButton.vue';
import PageTitle from '../components/PageTitle.vue';
import VoteContainer from '../components/VoteContainer.vue';

export default {
    components: {
        NavigationBar,
        ProfileButton,
        LogoutButton,
        PageTitle,
        VoteContainer,
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