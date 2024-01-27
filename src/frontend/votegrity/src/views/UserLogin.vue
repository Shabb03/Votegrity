<template>
    <div>
      <PageTitle/>
      <LoginForm/>
    </div>
</template>
  
<script>
import PageTitle from '../components/PageTitle.vue';
import LoginForm from '../components/LoginForm.vue';

  export default {
    components: {
      PageTitle,
      LoginForm,
    },
  }
</script>
  
<style scoped>
</style>  