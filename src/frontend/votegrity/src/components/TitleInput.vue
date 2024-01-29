<template>
  <v-text-field
    v-model="title"
    label="Election Title"
    :rules="titleRules"
    @input="updateTitle"
    required
  ></v-text-field>
</template>

<script>
export default {
  data: () => ({
    title: '',
    titleRules: [
      v => !!v || 'Title is required',
      v => /^[a-zA-Z]+$/.test(v) || 'Only letters are allowed',
    ],
  }),
  methods: {
    updateTitle() {
      this.$emit('update:title', this.title);
    },
  },
};
</script>