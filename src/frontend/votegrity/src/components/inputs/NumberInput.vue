<template>
    <v-text-field
      v-model="number"
      label="Number of Total Candidates"
      :rules="numberRules"
      @input="updateNumber"
      type="number"
      required
    ></v-text-field>
  </template>
  
  <script>
  export default {
    data: () => ({
      number: '',
      numberRules: [
        v => !!v || 'Number is required',
      ],
    }),
    methods: {
      updateNumber() {
        this.$emit('update:number', this.number);
      },
    },
  };
  </script>