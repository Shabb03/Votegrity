<template>
  <v-text-field
    v-model="specialNumber"
    label="Special Number"
    :rules="specialNumberRules"
    @input="updateSpecialNumber"
  ></v-text-field>
</template>

<script>
export default {
  data: () => ({
    specialNumber: '',
    specialNumberRules: [
      v => !!v || 'specialNumber is required',
    ],
  }),
  methods: {
    updateSpecialNumber() {
      this.$emit('update:specialNumber', this.specialNumber);
    },
  },
};
</script>