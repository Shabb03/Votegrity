<template>
    <div class="hello">
      <h1>{{ msg }}</h1>
      <h1>TEST</h1>
    </div>
  </template>
  
  <script>
  export default {
    name: 'TEST',
    props: {
      msg: String
    }
  }
  </script>
  
  <style scoped>
  h1 {
    margin: 40px 0 0;
  }
  </style>  