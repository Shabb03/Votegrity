<template>
    <v-text-field
      v-model="citizenship"
      label="Citizenship"
      :rules="citizenshipRules"
      @input="updateCitizenship"
    ></v-text-field>
</template>
  
<script>
export default {
  data: () => ({
    citizenship: '',
    citizenshipRules: [
      v => !!v || 'citizenship is required',
    ],
  }),
  methods: {
    updateCitizenship() {
      this.$emit('update:citizenship', this.citizenship);
    },
  },
};
</script>