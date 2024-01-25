<template>
  <div>
    <h1>{{ pageSubTitle }}</h1>
  </div>
</template>
  
<script>
  export default {
    props: {
      pageSubTitle: {
        type: String,
        required: true,
      },
    },
  };
</script>
  
<style scoped>
h1 {
    margin-top: 2em;
    font-size: 2.5em;
    text-align: center;
}
</style>