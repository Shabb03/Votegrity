<template>
    <NavigationBar>
        <component :is="voteButton"></component>
        <component :is="logoutButton"></component>
    </NavigationBar>
    <PageTitle/>
    <PasswordForm/>
</template>
  
<script>
import { markRaw } from "vue";
import NavigationBar from '../components/navbar/NavigationBar.vue';
import VoteButton from '../components/navbar/VoteButton.vue';
import LogoutButton from '../components/navbar/LogoutButton.vue';
import PageTitle from '../components/titles/PageTitle.vue';
import PasswordForm from '../components/forms/PasswordForm.vue';

export default {
    components: {
        NavigationBar,
        VoteButton,
        LogoutButton,
        PageTitle,
        PasswordForm,
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