<template>
    <div>
      <PageTitle/>
      <AdminLoginForm/>
    </div>
</template>
  
<script>
import PageTitle from '../components/PageTitle.vue';
import AdminLoginForm from '../components/AdminLoginForm.vue';

  export default {
    components: {
      PageTitle,
      AdminLoginForm,
    },
  }
</script>
  
<style scoped>
</style>  