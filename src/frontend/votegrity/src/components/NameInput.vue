<template>
  <v-text-field
    v-model="value"
    label="Full Name"
    :rules="rules"
  ></v-text-field>
</template>

<script setup>
import { ref } from 'vue';

const value = ref('');
const rules = [
  value => {
    if (value?.length > 3) return true;
    return 'Full Name must be more than 3 characters';
  },
];
</script>