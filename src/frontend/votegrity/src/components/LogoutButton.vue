<template>
    <v-btn variant="tonal" @click="logout">Logout</v-btn>
</template>

<script>
export default {
  name: 'LogoutButton',
  methods: {
    logout() {
      localStorage.setItem("votegrityToken","");
    },
  },
};
</script>

<style scoped>
.v-btn {
  font-size: 1.2em;
  font-weight: bold;
}
</style>