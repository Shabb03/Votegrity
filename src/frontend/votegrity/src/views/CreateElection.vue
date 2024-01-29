<template>
    <div>
      <NavigationBar>
        <component :is="logoutButton"></component>
      </NavigationBar>
      <PageTitle/>
      <ElectionForm/>
    </div>
  </template>
    
  <script>
  import { markRaw } from "vue";
  import NavigationBar from '../components/NavigationBar.vue';
  import LogoutButton from '../components/LogoutButton.vue';
  import PageTitle from '../components/PageTitle.vue';
  import ElectionForm from '../components/ElectionForm.vue';
  
  export default {
      components: {
        NavigationBar,
        LogoutButton,
        PageTitle,
        ElectionForm,
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