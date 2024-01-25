<template>
    <v-btn variant="tonal" @click="goToProfile">Profile</v-btn>
</template>

<script>
export default {
  name: 'ProfileButton',
  methods: {
    goToProfile() {
      this.$router.push('/profile');
    },
  },
};
</script>

<style scoped>
.v-btn {
  font-size: 1.2em;
  font-weight: bold;
  margin-right: 1.5em;
  background-color: #fff;
  border: 3px solid #000;
}
</style>