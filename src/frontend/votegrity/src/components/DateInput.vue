<template>
    <v-text-field
      v-model="date"
      label="Birth Date"
      type="date"
      :rules="dateRules"
      @input="updateDate"
      required
    ></v-text-field>
</template>

<script>
export default {
  data: () => ({
    date: '',
    dateRules: [
      v => !!v || 'Date is required',
    ],
  }),
  methods: {
    updateDate() {
      this.$emit('update:date', this.date);
    },
  },
};
</script>