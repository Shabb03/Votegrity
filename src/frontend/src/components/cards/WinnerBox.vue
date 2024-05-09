<template>
    <v-col>
        <v-card max-width="350" elevation="16">
            <v-card-title>Name: {{ name }}</v-card-title>
            <v-card-text></v-card-text>
            <v-card-text>Voice: {{ voice }}</v-card-text>
            <v-card-text>Party: {{ party }}</v-card-text>
            <v-card-text>Biography: {{ biography }}</v-card-text>
        </v-card>
    </v-col>
</template>

<script>
export default {
    props: {
        name: String,
        voice: String,
        party: String,
        biography: String,
    },
}
</script>

<style scoped>
</style>