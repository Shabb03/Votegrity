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
        voteButton: VoteButton,
        logoutButton: LogoutButton,
      };
    },
}
</script>
  
<style scoped>
</style>  