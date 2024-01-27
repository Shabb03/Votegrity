<template>
    <v-text-field
      v-model="code"
      label="Enter Code"
      :rules="codeRules"
      @input="updateCode"
    ></v-text-field>
  </template>
  
  <script>
  export default {
    data: () => ({
      code: '',
      codeRules: [
        v => !!v || 'code is required',
        v => /^\d+$/.test(v) || 'Only numbers are allowed',
      ],
    }),
    methods: {
      updateCode() {
        this.$emit('update:code', this.code);
      },
    },
  };
  </script>