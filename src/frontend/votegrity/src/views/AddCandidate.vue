<template>
    <NavigationBar>
        <component :is="logoutButton"></component>
    </NavigationBar>
    <PageTitle/>
    <CandidateForm/>
</template>
    
<script>
import { markRaw } from "vue";
import NavigationBar from '../components/NavigationBar.vue';
import LogoutButton from '../components/LogoutButton.vue';
import PageTitle from '../components/PageTitle.vue';
import CandidateForm from '../components/CandidateForm.vue';
  
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