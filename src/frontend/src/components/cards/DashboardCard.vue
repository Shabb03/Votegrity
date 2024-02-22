<template>
    <v-col>
        <v-card max-width="250" elevation="16" class="card-box">
            <v-img
                width="250"
                :src="imageSrc || 'https://cdn.vuetifyjs.com/images/cards/docks.jpg'"
                cover
            >
            </v-img>
            <div>
                <v-card-title class="card-text">{{informationTitle}}</v-card-title>
                <v-card-text class="card-text" v-html="informationText"></v-card-text>
            </div>
        </v-card>
    </v-col>
</template>

<script>
export default {
    props: {
        imageSrc: String,
        informationTitle: String,
        informationText: String,
    },
}
</script>

<style scoped>
.card-box {
    margin: 0 auto;
    padding: 30px;
}
.card-text {
    display: flex;
    justify-content: center;
}
</style>