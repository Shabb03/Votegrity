<template>
    <v-text-field
      v-model="age"
      label="Minimum Age Requirement"
      @input="updateAge"
      type="number"
    ></v-text-field>
  </template>
  
  <script>
  export default {
    data: () => ({
      age: '',
      /*ageRules: [
        v => !!v || 'Age is required',
      ],*/
    }),
    methods: {
      updateAge() {
        this.$emit('update:age', this.age);
      },
    },
  };
  </script>