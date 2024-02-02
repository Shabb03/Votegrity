<template>
    <NavigationBar>
        <component :is="logoutButton"></component>
    </NavigationBar>
    <PageTitle/>
    <CandidateForm/>
</template>
    
<script>
import { markRaw } from "vue";
import NavigationBar from '../components/navbar/NavigationBar.vue';
import LogoutButton from '../components/navbar/LogoutButton.vue';
import PageTitle from '../components/titles/PageTitle.vue';
import CandidateForm from '../components/forms/CandidateForm.vue';
  
export default {
    components: {
        NavigationBar,
        LogoutButton,
        PageTitle,
        CandidateForm,
    },
    data() {
        return {
            logoutButton: markRaw(LogoutButton),
        };
    },
}
</script>
    
<style scoped>
</style>  