<template>
    <v-text-field
      v-model="emailDomain"
      label="Email Domain"
      @input="updateEmailDomain"
    ></v-text-field>
  </template>
  
  <script>
  export default {
    data: () => ({
      emailDomain: '',
      /*emailDomainRules: [
        v => !!v || 'Email Domain is required',
      ],*/
    }),
    methods: {
      updateEmailDomain() {
        this.$emit('update:emailDomain', this.emailDomain);
      },
    },
  };
  </script>