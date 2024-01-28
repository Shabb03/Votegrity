<template>
    <div>
      <NavigationBar>
        <component :is="profileButton"></component>
        <component :is="logoutButton"></component>
      </NavigationBar>
      <PageTitle/>
      <PageSubTitle :pageSubTitle="pageSubTitle" />
    </div>
</template>
  
<script>
import NavigationBar from '../components/NavigationBar.vue';
import ProfileButton from '../components/ProfileButton.vue';
import LogoutButton from '../components/LogoutButton.vue';
import PageTitle from '../components/PageTitle.vue';
import PageSubTitle from '../components/PageSubTitle.vue';

  export default {
    components: {
      NavigationBar,
      ProfileButton,
      LogoutButton,
      PageTitle,
      PageSubTitle,
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