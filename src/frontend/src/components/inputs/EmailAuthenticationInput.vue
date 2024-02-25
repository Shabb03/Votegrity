<template>
    <v-text-field
        v-model="emailDomain"
        label="Email Domain e.g: @gmail.com"
        @input="updateEmailDomain"
    ></v-text-field>
</template>
  
<script>
export default {
    data: () => ({
        emailDomain: null,
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