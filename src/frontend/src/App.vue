<template>
    <v-app>
        <v-main>
            <router-view />
        </v-main>
    </v-app>
</template>

<script>

export default {
    name: 'App',
}
</script>

<style scoped>
@import './styles/colours.css';

.v-main {
    background: linear-gradient(115deg, var(--primary-color) 10%, var(--secondary-color) 90%);
}
</style>
