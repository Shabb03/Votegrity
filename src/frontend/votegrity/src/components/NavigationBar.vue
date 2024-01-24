<template>
  <header>
    <nav class="navbar">
      <LogoutButton />
      <v-app>
      <v-btn variant="tonal">
  Button
</v-btn>
</v-app>
<v-card-text>
            Hello, this is a Vuetify dialog.
          </v-card-text>
    </nav>
  </header>
</template>
  
<script>
import LogoutButton from './LogoutButton.vue';

  export default {
    name: 'NavigationBar',
    components: {
      LogoutButton
  }
  };
</script>
  
<style scoped>
  /* Add your styling for the navigation bar here */
  header {
    width:100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: fixed;
    top:0; left: 0;
    /*z-index: 1000;*/
  }
  .navbar {
    background-color: #fff;
    display: flex;
    padding: 10px;
    width: 100%;
    align-items: right;
    justify-content: flex-end;
    /*box-shadow: 0px 5px 5px rgba(0, 0, 0, 0.1);*/
    box-shadow: 0 7px 4px rgba(0,0,0,.08), 0 10px 10px rgba(0,0,0,.08);
    border-bottom: 5px solid #00e5ff;
  }
  </style>
  