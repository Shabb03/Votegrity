<template>
    <div>
      <PageTitle/>
      <InputForm>
        <!--<component  :is="buttonInput"></component>
        <component  :is="emailInput"></component>-->
      </InputForm>
    </div>
</template>
  
<script>
import PageTitle from '../components/PageTitle.vue';
import InputForm from '../components/InputForm.vue';
//import EmailInput from '../components/EmailInput.vue';
//import ProfileButton from '../components/ProfileButton.vue';

  export default {
    components: {
      PageTitle,
      InputForm,
      //EmailInput,
      //ProfileButton,
    },
    /*data() {
      return {
        buttonInput: ProfileButton,
        //emailInput: EmailInput,
      };
    },*/
  }
</script>
  
<style scoped>
</style>  