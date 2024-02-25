<template>
    <NotLoggedIn/>
    <NavigationBar>
        <component :is="voteButton"></component>
    </NavigationBar>
    <PageTitle/>
    <PasswordForm/>
</template>
  
<script>
import NotLoggedIn from '../components/status/NotLoggedIn.vue';
import { markRaw } from "vue";
import NavigationBar from '../components/navbar/NavigationBar.vue';
import VoteButton from '../components/navbar/VoteButton.vue';
import PageTitle from '../components/titles/PageTitle.vue';
import PasswordForm from '../components/forms/PasswordForm.vue';

export default {
    components: {
        NotLoggedIn,
        NavigationBar,
        VoteButton,
        PageTitle,
        PasswordForm,
    },
    data() {
        return {
            voteButton: markRaw(VoteButton),
        };
    },
}
</script>
  
<style scoped>
</style>  