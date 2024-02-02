<template>
    <v-text-field
      v-model="email"
      label="Email"
      type="email"
      :rules="emailRules"
      @input="updateEmail"
      required
    ></v-text-field>
</template>
  
<script>
export default {
  data: () => ({
    email: '',
    emailRules: [
      v => !!v || 'Email is required',
      v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Not a valid email',
    ],
  }),
  methods: {
    updateEmail() {
      this.$emit('update:email', this.email);
    },
  },
};
</script>