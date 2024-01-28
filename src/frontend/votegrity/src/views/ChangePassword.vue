<template>
    <div>
      <NavigationBar>
        <component :is="voteButton"></component>
        <component :is="logoutButton"></component>
      </NavigationBar>
      <PageTitle/>
      <PasswordForm/>
    </div>
</template>
  
<script>
import { markRaw } from "vue";
import NavigationBar from '../components/NavigationBar.vue';
import VoteButton from '../components/VoteButton.vue';
import LogoutButton from '../components/LogoutButton.vue';
import PageTitle from '../components/PageTitle.vue';
import PasswordForm from '../components/PasswordForm.vue';

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