<template>
    <v-autocomplete
        v-model="citizenship"
        label="Citizenship"
        :items="countries"
        :rules="displayCitizenshipRules ? citizenshipRules : []"
        @update:modelValue="updateCitizenship"
    ></v-autocomplete>
</template>
  
<script>
import citizenshipData from '../../assets/citizenship.json';

export default {
    props: {
        displayCitizenshipRules: {
            type: Boolean,
            default: true,
        },
    },
    data: () => ({
        citizenship: null,
        citizenshipRules: [
            v => !!v || 'citizenship is required',
        ],
        countries: citizenshipData,
    }),
    methods: {
        updateCitizenship() {
            this.$emit('update:citizenship', this.citizenship);
        },
    },
};
</script>