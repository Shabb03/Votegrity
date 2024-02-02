<template>
    <v-text-field
      v-model="age"
      :label="label"
      @input="updateAge"
      type="number"
    ></v-text-field>
  </template>
  
  <script>
  export default {
    props: {
      label: {
        type: String,
        required: true,
      },
    },
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