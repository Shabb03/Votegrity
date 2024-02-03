<template>
  <header>
    <v-app-bar :elevation="9">
      <div class="spacer"></div>
      <slot></slot>
    </v-app-bar>
  </header>
</template>
  
<script>

  export default {
    name: 'NavigationBar',
  };
</script>
  
<style scoped>
  header {
    width:100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: fixed;
    top:0; left: 0;
    z-index: 1000;
  }
  .v-app-bar {
    background-color: #f7f8f8;
  }

  .spacer {
    flex: 1;
  }
  </style>
  