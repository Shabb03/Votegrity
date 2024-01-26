<template>
    <v-text-field
      v-model="value"
      label="Password"
      type="password"
      :rules="rules"
    ></v-text-field>
    
  </template>
  
<script setup>
  import { ref } from 'vue';
  
  const value = ref('');
  const rules = [
    value => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,}$/;
      if (regex.test(value)) return true;
      return `Password must have at least the following:
              one lowercase letter
              one uppercase letter
              one number
              one special character
              minimum 10 characters long`;
    },
  ];
</script>