<template>
    <div>
      <NavigationBar>
        <component :is="logoutButton"></component>
      </NavigationBar>
      <PageTitle/>
      <AuthenticationForm/>
    </div>
</template>
  
<script>
import NavigationBar from '../components/NavigationBar.vue';
import LogoutButton from '../components/LogoutButton.vue';
import PageTitle from '../components/PageTitle.vue';
import AuthenticationForm from '../components/AuthenticationForm.vue';

export default {
    components: {
      NavigationBar,
      LogoutButton,
      PageTitle,
      AuthenticationForm,
    },
    data() {
      return {
        logoutButton: LogoutButton,
      };
    },
}
</script>
  
<style scoped>
</style>  