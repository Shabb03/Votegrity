<template>
    <v-text-field
        v-model="securityAnswer1"
        :label="label1"
        :rules="securityRules"
        @input="updateSecurityAnswer1"
        required
    ></v-text-field>
    <v-text-field
        v-model="securityAnswer2"
        :label="label2"
        :rules="securityRules"
        @input="updateSecurityAnswer2"
        required
    ></v-text-field>
</template>
  
<script>
export default {
    props: {
        label1: {
            type: String,
            default: 'Security Question 1',
        },
        label2: {
            type: String,
            default: 'Security Question 2',
        },
    },
    data: () => ({
        securityAnswer1: '',
        securityAnswer2: '',
        securityRules: [
          v => !!v || 'Input is required',
        ],
    }),
    methods: {
        updateSecurityAnswer1() {
            this.$emit('update:securityAnswer1', this.securityAnswer1);
        },
        updateSecurityAnswer2() {
            this.$emit('update:securityAnswer2', this.securityAnswer2);
        },
    },
};
</script>