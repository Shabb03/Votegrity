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
      securityItems: ['What is the name of your pet', 'What is your mother\'s maiden name', 'What is your favourite sport', 'What is your favourite animal', 'Who is your favourite person', 'Which city were you born in'],
      securityAnswer: '',
      securityRules: [
        v => !!v || 'Input is required',
      ],
    }),
    methods: {
      updateSecurityQuestion() {
        this.$emit('update:securitySelect', this.securitySelect);
      },
      updateSecurityAnswer() {
        this.$emit('update:securityAnswer', this.securityAnswer);
      },
    },
  };
  </script>