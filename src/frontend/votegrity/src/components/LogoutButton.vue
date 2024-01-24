<template>
    <button class="navButton" @click="logout">Logout</button>
</template>

<script>
export default {
  name: 'LogoutButton',
  methods: {
    logout() {
      localStorage.setItem("votegrityToken","");
      //this.$router.push({ name: 'login' });
    },
  },
};
</script>

<style scoped>
    .navButton {
      font-size: 1.5rem;
      margin: 1rem, 2rem;
      font-weight: bold;
    }
</style>