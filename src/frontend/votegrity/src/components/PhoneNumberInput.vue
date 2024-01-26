<template>
    <v-text-field
      v-model="value"
      label="Phone Number"
      :rules="rules"
    ></v-text-field>
</template>
  
<script setup>
  import { ref } from 'vue';
  
  const value = ref('');
  const rules = [
    value => {
      if (value?.length > 0) return true;
      return 'This field is required';
    },
  ];
</script>