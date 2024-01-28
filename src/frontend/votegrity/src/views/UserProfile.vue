<template>
    <div>
      <NavigationBar>
        <component :is="voteButton"></component>
        <component :is="logoutButton"></component>
      </NavigationBar>
      <PageTitle/>
      <ProfileForm/>
    </div>
</template>
  
<script>
import NavigationBar from '../components/NavigationBar.vue';
import VoteButton from '../components/VoteButton.vue';
import LogoutButton from '../components/LogoutButton.vue';
import PageTitle from '../components/PageTitle.vue';
import ProfileForm from '../components/ProfileForm.vue';

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
        voteButton: VoteButton,
        logoutButton: LogoutButton,
      };
    },
}
</script>
  
<style scoped>
</style>  