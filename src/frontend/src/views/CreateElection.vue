<template>
    <NoElection/>
    <NavigationBar>
        <component :is="logoutButton"></component>
    </NavigationBar>
    <PageTitle/>
    <ElectionForm/>
</template>
    
<script>
import NoElection from "../components/status/NoElection.vue";
import { markRaw } from "vue";
import NavigationBar from '../components/navbar/NavigationBar.vue';
import LogoutButton from '../components/navbar/LogoutButton.vue';
import PageTitle from '../components/titles/PageTitle.vue';
import ElectionForm from '../components/forms/ElectionForm.vue';
  
export default {
    components: {
        NoElection,
        NavigationBar,
        LogoutButton,
        PageTitle,
        ElectionForm,
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