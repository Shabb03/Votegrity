<template>
    <v-text-field
        v-model="email"
        :label="label || 'Email'"
        type="email"
        :rules="emailRules"
        @input="updateEmail"
    ></v-text-field>
</template>
  
<script>
export default {
    props: {
        label: {
            type: String,
            default: 'Email',
        },
        required: {
            type: Boolean,
            default: true,
        },
    },
    data: () => ({
        email: '',
    }),
    computed: {
        emailRules() {
            const validationRules = [];
            if (this.required) {
                validationRules.push((v) => !!v || this.label + ' is required');
                validationRules.push((v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Not a valid email'));
            }
            return validationRules;
        },
    },
    methods: {
        updateEmail() {
            this.$emit('update:email', this.email);
        },
    },
};
</script>