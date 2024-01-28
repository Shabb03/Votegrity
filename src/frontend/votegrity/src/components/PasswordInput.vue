<template>
    <v-text-field
      v-model="password"
      label="Password"
      type="password"
      :rules="passwordRules"
      @input="updatePassword"
      required
    ></v-text-field>
    
  </template>
  
<script>
export default {
  data: () => ({
    password: '',
    passwordRules: [
      v => !!v || 'password is required',
      /*v => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,}$/.test(v)
          || `Password must have at least the following:
              one lowercase letter
              one uppercase letter
              one number
              one special character
              minimum 10 characters long`,*/
      v => (/[a-z]/.test(v)) || 'Must contain lowercase letter',
      v => (/[A-Z]/.test(v)) || 'Must contain uppercase letter',
      v => (/\d/.test(v)) || 'Must contain number',
      v => (/[@$!%*?&]/.test(v)) || 'Must contain special character',
      v => (v && v.length >= 10) || 'Minimum 10 characters long',
    ],
  }),
  methods: {
    updatePassword() {
      this.$emit('update:password', this.password);
    },
  },
};
</script>