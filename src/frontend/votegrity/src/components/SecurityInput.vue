<template>
    <v-select
        v-model="securitySelect"
        :label="'Security Question ' + securityNumber"
        :items="securityItems"
        :rules="securityRules"
        @update:modelValue="updateSecurityQuestion"
        required
    ></v-select>
    <v-text-field
      v-model="securityAnswer"
      :label="'Security Answer ' + securityNumber"
      :rules="securityRules"
      @input="updateSecurityAnswer"
      required
    ></v-text-field>
  </template>
  
  <script>
  export default {
    props: {
      securityNumber: {
        type: String,
        required: true,
      },
    },
    data: () => ({
      securitySelect: null,
      securityItems: [],
      securityAnswer: '',
      securityRules: [
        v => !!v || 'Input is required',
      ],
    }),
    /*created() {
      this.fetchQuestions();
    },*/
    methods: {
      async fetchQuestions() {
        try {
          const response = await axios.get('http://localhost:3000/api/admin/election');
          this.securityItems = response.data.questions;
          console.log(response.data);
      } 
      catch (error) {
        alert('Error retrieving security questions:', error);
      }
      },
      updateSecurityQuestion() {
        this.$emit('update:securitySelect', this.securitySelect);
      },
      updateSecurityAnswer() {
        this.$emit('update:securityAnswer', this.securityAnswer);
      },
    },
  };
  </script>