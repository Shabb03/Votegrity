<template>
  <v-textarea
    v-model="description"
    label="Description"
    :rules="descriptionRules"
    @input="updateDescription"
    required
  ></v-textarea>
</template>

<script>
export default {
  data: () => ({
    description: '',
    descriptionRules: [
      v => !!v || 'Description is required',
    ],
  }),
  methods: {
    updateDescription() {
      this.$emit('update:description', this.description);
    },
  },
};
</script>