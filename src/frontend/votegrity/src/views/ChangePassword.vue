<template>
    <div>
      <PageTitle/>
      <PasswordForm/>
    </div>
</template>
  
<script>
import PageTitle from '../components/PageTitle.vue';
import PasswordForm from '../components/PasswordForm.vue';

export default {
    components: {
      PageTitle,
      PasswordForm,
    },
}
</script>
  
<style scoped>
</style>  