<template>
    <v-text-field
      v-model="date"
      :label="label"
      type="date"
      :rules="dateRules"
      @input="updateDate"
      required
    ></v-text-field>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      required: true,
    },
  },
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