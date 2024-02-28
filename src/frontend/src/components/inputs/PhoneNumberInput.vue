<template>
    <v-text-field
        v-model="phoneNumber"
        :label="label || 'Phone Number'"
        :rules="phoneNumberRules"
        @input="updatePhoneNumber"
    ></v-text-field>
</template>
  
<script>
export default {
    props: {
        label: {
            type: String,
            default: 'Phone Number',
        },
        required: {
            type: Boolean,
            default: true,
        },
    },
    data: () => ({
        phoneNumber: '',
    }),
    computed: {
        phoneNumberRules() {
            const validationRules = [];
            if (this.required) {
                validationRules.push((v) => !!v || this.label + ' is required');
            }
            return validationRules;
        },
    },
    methods: {
        updatePhoneNumber() {
            this.$emit('update:phoneNumber', this.phoneNumber);
        },
    },
};
</script>