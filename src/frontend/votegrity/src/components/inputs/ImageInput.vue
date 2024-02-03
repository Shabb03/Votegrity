<template>
    <v-file-input
        ref="fileInput"
        :label="label || 'Image'"
        :rules="imageRules"
        @change="updateImage"
        required
    ></v-file-input>
</template>

<script>
export default {
    props: {
        label: {
            type: String,
            default: 'Image',
        },
    },
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