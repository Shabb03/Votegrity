<template>
  <!--<v-text-field
    v-model="image"
    label="Candidate Photo"
    :rules="imageRules"
    @input="updateImage"
    type="file"
    required
  ></v-text-field>-->
  <v-file-input
    ref="fileInput"
    label="Candidate Photo"
    :rules="imageRules"
    @change="updateImage"
    required
  ></v-file-input>
</template>

<script>
export default {
  data: () => ({
    image: null,
    imageRules: [
      v => !!v || 'Image is required',
    ],
  }),
  methods: {
    updateImage() {
      const fileInput = this.$refs.fileInput.$el.querySelector('input[type=file]');
      const image = fileInput.files[0];
      this.$emit('update:image', image);
    },
  },
};
</script>