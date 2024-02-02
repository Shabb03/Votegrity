<template>
    <v-img
        class="bg-white"
        width="10"
        :aspect-ratio="2"
        :src="imageSrc || 'https://cdn.vuetifyjs.com/images/cards/docks.jpg'"
    ></v-img>
</template>

<script>
export default {
    props: {
        imageSrc: String,
    },
}
</script>

<style scoped>
</style>