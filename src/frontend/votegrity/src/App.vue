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
.v-main {
    /*background: linear-gradient(115deg, #00e5ff 10%, #9f01ea 90%);*/
    background: linear-gradient(115deg, #00e5ff 10%, #2616bb 90%);
}
</style>
