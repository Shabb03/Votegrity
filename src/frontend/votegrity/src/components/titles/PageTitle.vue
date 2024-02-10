<template>
    <div>
        <h1>{{ pageTitle }}</h1>
    </div>
</template>
  
<script>
export default {
    computed: {
        pageTitle() {
            return this.$route.name
        },
    },
};
</script>
  
<style scoped>
h1 {
    margin-top: 0.5em;
    font-size: 4.5em;
    text-align: center;
}
</style>