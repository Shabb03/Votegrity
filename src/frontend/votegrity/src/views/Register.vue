<template>
    <div class="hello">
      <h1>{{ msg }}</h1>
      <h1 style="margin-top: 5rem">TEST</h1>
      <v-btn variant="tonal">
  Button
</v-btn>
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
    font-size: 4rem;
  }
  </style>  