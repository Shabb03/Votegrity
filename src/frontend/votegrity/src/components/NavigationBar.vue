<template>
    <nav class="navbar">
      <router-link to="/" class="nav-link">Home</router-link>
      <router-link to="/register" class="nav-link">About</router-link>
    </nav>
  </template>
  
  <script>
  export default {
    name: 'NavigationBar',
  };
  </script>
  
  <style scoped>
  /* Add your styling for the navigation bar here */
  .navbar {
    background-color: #333;
    padding: 10px;
  }
  
  .nav-link {
    color: white;
    margin-right: 10px;
    text-decoration: none;
  }
  
  .nav-link:hover {
    text-decoration: underline;
  }
  </style>
  