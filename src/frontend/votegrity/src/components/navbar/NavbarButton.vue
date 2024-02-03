<template>
    <v-btn variant="tonal" @click="goToRoute">{{ buttonText }}</v-btn>
</template>

<script>
export default {
  name: 'NavbarButton',
  props: {
    buttonText: String,
    routeName: String,
  },
  methods: {
    goToRoute() {
      this.$router.push(this.routeName);
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