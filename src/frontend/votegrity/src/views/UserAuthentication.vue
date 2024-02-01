<template>
    <NavigationBar>
        <component :is="logoutButton"></component>
    </NavigationBar>
    <PageTitle/>
    <AuthenticationForm/>
</template>
  
<script>
import { markRaw } from "vue";
import NavigationBar from '../components/NavigationBar.vue';
import LogoutButton from '../components/LogoutButton.vue';
import PageTitle from '../components/PageTitle.vue';
import AuthenticationForm from '../components/AuthenticationForm.vue';

export default {
    components: {
        NavigationBar,
        LogoutButton,
        PageTitle,
        AuthenticationForm,
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