<template>
    <v-text-field
      v-model="phoneNumber"
      label="Phone Number"
      :rules="phoneNumberRules"
      @input="updatePhoneNumber"
    ></v-text-field>
</template>
  
<script>
export default {
  data: () => ({
    phoneNumber: '',
    phoneNumberRules: [
      v => !!v || 'phoneNumber is required',
      v => /^\d+$/.test(v) || 'Only numbers are allowed',
    ],
  }),
  methods: {
    updatePhoneNumber() {
      this.$emit('update:phoneNumber', this.phoneNumber);
    },
  },
};
</script>