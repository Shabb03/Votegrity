<template>
    <div>
      <PageTitle/>
      <AuthenticationForm/>
    </div>
</template>
  
<script>
import PageTitle from '../components/PageTitle.vue';
import AuthenticationForm from '../components/AuthenticationForm.vue';

export default {
    components: {
      PageTitle,
      AuthenticationForm,
    },
}
</script>
  
<style scoped>
</style>  