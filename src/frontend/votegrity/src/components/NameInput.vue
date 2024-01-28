<template>
  <v-text-field
    v-model="name"
    label="Full Name"
    :rules="nameRules"
    @input="updateName"
    required
  ></v-text-field>
</template>

<script>
export default {
  data: () => ({
    name: '',
    nameRules: [
      v => !!v || 'Name is required',
      v => /^[a-zA-Z]+$/.test(v) || 'Only letters are allowed',
    ],
  }),
  methods: {
    updateName() {
      this.$emit('update:name', this.name);
    },
  },
};
</script>