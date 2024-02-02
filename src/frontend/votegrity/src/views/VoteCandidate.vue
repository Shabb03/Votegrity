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
import NavigationBar from '../components/navbar/NavigationBar.vue';
import ProfileButton from '../components/navbar/ProfileButton.vue';
import LogoutButton from '../components/navbar/LogoutButton.vue';
import PageTitle from '../components/titles/PageTitle.vue';
import VoteContainer from '../components/containers/VoteContainer.vue';

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