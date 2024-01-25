<template>
    <div>
      <NavigationBar>
        <component :is="profileButton"></component>
        <component  :is="logoutButton"></component>
      </NavigationBar>
      <PageTitle/>
      <PageSubTitle :pageSubTitle="pageSubTitle" />
    </div>
</template>
  
<script>
import NavigationBar from '../components/NavigationBar.vue';
import PageTitle from '../components/PageTitle.vue';
import PageSubTitle from '../components/PageSubTitle.vue';
import ProfileButton from '../components/ProfileButton.vue';
import LogoutButton from '../components/LogoutButton.vue';

  export default {
    components: {
      NavigationBar,
      PageTitle,
      PageSubTitle,
      ProfileButton,
      LogoutButton
    },
    data() {
      return {
        profileButton: ProfileButton,
        logoutButton: LogoutButton,
        pageSubTitle: 'Each vote makes a difference',
      };
    },
  }
  </script>
  
  <style scoped>
  </style>  