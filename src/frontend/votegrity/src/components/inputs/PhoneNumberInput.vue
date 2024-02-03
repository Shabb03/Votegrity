<template>
    <v-text-field
        v-model="phoneNumber"
        :label="label || 'Phone Number'"
        :rules="phoneNumberRules"
        @input="updatePhoneNumber"
        required
    ></v-text-field>
</template>
  
<script>
export default {
    props: {
        label: {
            type: String,
            default: 'Phone Number',
        },
    },
    data: () => ({
        phoneNumber: '',
        phoneNumberRules: [
            v => !!v || 'Phone Number is required',
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