<template>
    <NavigationBar>
        <component :is="voteButton"></component>
        <component :is="logoutButton"></component>
    </NavigationBar>
    <PageTitle/>
    <ProfileForm/>
</template>
  
<script>
import { markRaw } from "vue";
import NavigationBar from '../components/navbar/NavigationBar.vue';
import VoteButton from '../components/navbar/VoteButton.vue';
import LogoutButton from '../components/navbar/LogoutButton.vue';
import PageTitle from '../components/titles/PageTitle.vue';
import ProfileForm from '../components/forms/ProfileForm.vue';

export default {
    components: {
        NavigationBar,
        VoteButton,
        LogoutButton,
        PageTitle,
        ProfileForm,
    },
    data() {
        return {
            voteButton: markRaw(VoteButton),
            logoutButton: markRaw(LogoutButton),
        };
    },
}
</script>
  
<style scoped>
</style>  