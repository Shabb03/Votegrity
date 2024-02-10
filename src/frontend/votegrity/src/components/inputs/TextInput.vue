<template>
    <v-text-field
        v-model="text"
        :label="label || 'Text'"
        :rules="textRules"
        @input="updateText"
    ></v-text-field>
</template>

<script>
export default {
    props: {
        label: {
            type: String,
            default: 'Text',
        },
        required: {
            type: Boolean,
            default: false,
        },
    },
    data: () => ({
        text: '',
    }),
    computed: {
        textRules() {
            const validationRules = [];
            if (this.required) {
                validationRules.push((v) => !!v || this.label + ' is required');
            }
            return validationRules;
        },
    },
    methods: {
        updateText() {
            this.$emit('update:text', this.text);
        },
    },
};
</script>