<template>
    <v-text-field
      v-model="value"
      label="Email"
      :rules="rules"
    ></v-text-field>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const value = ref('');
  const rules = [
    value => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailRegex.test(value)) return true;
      return 'Not a valid email';
    },
  ];
  </script>