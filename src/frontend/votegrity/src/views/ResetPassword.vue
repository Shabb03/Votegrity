<template>
    <div>
      <PageTitle/>
      <PasswordAuthForm/>
    </div>
</template>
  
<script>
import PageTitle from '../components/PageTitle.vue';
import PasswordAuthForm from '../components/PasswordAuthForm.vue';

export default {
    components: {
      PageTitle,
      PasswordAuthForm,
    },
}
</script>
  
<style scoped>
</style>  