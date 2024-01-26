<template>
    <v-text-field
      v-model="value"
      label="Birth Date"
      type="date"
      :rules="rules"
    ></v-text-field>
</template>

<script setup>
import { ref } from 'vue';

const value = ref();
const rules = [
  value => {
    if (value !== null && value !== undefined) return true;
    return 'This field is required';
  },
];
</script>