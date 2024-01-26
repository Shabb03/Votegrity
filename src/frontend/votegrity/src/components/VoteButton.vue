<template>
    <v-btn variant="tonal" @click="goToVote">Vote</v-btn>
</template>

<script>
export default {
  name: 'VoteButton',
  methods: {
    goToVote() {
      this.$router.push('/vote');
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