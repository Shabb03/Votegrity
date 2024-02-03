<template>
    <v-text-field
        v-model="number"
        :label="label || 'Number'"
        :rules="numberRules"
        @input="updateNumber"
        type="number"
        required
    ></v-text-field>
</template>

<script>
export default {
    props: {
        label: {
            type: String,
            default: 'Number',
        },
        required: {
            type: Boolean,
            default: false,
        },
    },
    data: () => ({
        number: '',
    }),
    computed: {
        numberRules() {
            const validationRules = [];
            if (this.required) {
                validationRules.push((v) => !!v || 'Number is required');
                validationRules.push((v) => (v > 0) || 'Number must be greater than 0');
            }
            return validationRules;
        },
    },
    methods: {
        updateNumber() {
            this.$emit('update:number', this.number);
        },
    },
};
</script>