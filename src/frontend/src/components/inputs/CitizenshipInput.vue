<template>
    <!--<v-text-field
        v-model="citizenship"
        label="Citizenship"
        :rules="citizenshipRules"
        @input="updateCitizenship"
        required
    ></v-text-field>-->

    <v-autocomplete
        v-model="citizenship"
        label="Citizenship"
        :items="countries"
        :rules="citizenshipRules"
        @update:modelValue="updateCitizenship"
        required
    ></v-autocomplete>

</template>
  
<script>
import citizenshipData from '../../assets/citizenship.json';

export default {
    data: () => ({
        citizenship: '',
        citizenshipRules: [
            v => !!v || 'citizenship is required',
        ],
        countries: citizenshipData,
    }),
    methods: {
        updateCitizenship() {
            console.log("HERE!");
            this.$emit('update:citizenship', this.citizenship);
        },
    },
};
</script>