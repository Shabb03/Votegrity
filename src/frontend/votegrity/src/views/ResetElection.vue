<template>
    <NavigationBar>
      <component :is="logoutButton"></component>
    </NavigationBar>
    <PageTitle/>
    <ResetForm/>
</template>
  
<script>
import { markRaw } from "vue";
import NavigationBar from '../components/NavigationBar.vue';
import LogoutButton from '../components/LogoutButton.vue';
import PageTitle from '../components/PageTitle.vue';
import ResetForm from '../components/ResetForm.vue';

export default {
    components: {
      NavigationBar,
      LogoutButton,
      PageTitle,
      ResetForm,
    },
    data() {
      return {
        logoutButton: markRaw(LogoutButton),
      };
    },
}
</script>
  
<style scoped>
</style>  