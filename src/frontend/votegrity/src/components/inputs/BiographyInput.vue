<template>
  <v-text-field
    v-model="bio"
    label="Biography"
    :rules="bioRules"
    @input="updateBio"
    required
  ></v-text-field>
</template>

<script>
export default {
  data: () => ({
    bio: '',
    bioRules: [
      v => !!v || 'Biography is required',
    ],
  }),
  methods: {
    updateBio() {
      this.$emit('update:bio', this.bio);
    },
  },
};
</script>