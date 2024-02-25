<template>
    <LoggedIn/>
    <NavigationBar>
        <component :is="voteButton"></component>
        <component :is="logoutButton"></component>
    </NavigationBar>
    <PageTitle/>
    <CodeInput :title="title" :button="button" :getApiUrl="getApiUrl" :postApiUrl="postApiUrl" :routeUrl="routeUrl" :successCardMessage="successMessage" :resetToken="true"/>
</template>
  
<script>
import LoggedIn from "../components/status/LoggedIn.vue";
import { markRaw } from "vue";
import NavigationBar from '../components/navbar/NavigationBar.vue';
import VoteButton from "../components/navbar/VoteButton.vue";
import LogoutButton from '../components/navbar/LogoutButton.vue';
import PageTitle from '../components/titles/PageTitle.vue';
import CodeInput from "../components/inputs/CodeInput.vue";

export default {
    components: {
        LoggedIn,
        NavigationBar,
        LogoutButton,
        VoteButton,
        PageTitle,
        CodeInput,
    },
    data() {
        return {
            logoutButton: markRaw(LogoutButton),
            voteButton: markRaw(VoteButton),
            title: 'Delete Account',
            button: 'Delete',
            getApiUrl: '/user/deletecode',
            postApiUrl: '/user/deleteaccount',
            routeUrl: '/login',
            successMessage: 'You have successfully deleted your account',
        };
    },
}
</script>
  
<style scoped>
</style>  