<template>
    <div>
      <PageTitle/>
      <ProfileForm/>
    </div>
</template>
  
<script>
import PageTitle from '../components/PageTitle.vue';
import ProfileForm from '../components/ProfileForm.vue';

export default {
    components: {
      PageTitle,
      ProfileForm,
    },
}
</script>
  
<style scoped>
</style>  