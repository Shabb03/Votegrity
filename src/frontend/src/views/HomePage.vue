<template>
    <PageTitle/>
    <PageLoader/>
</template>
  
<script>
import axios from 'axios';
import getToken from '../functions/GetToken.vue';
import PageTitle from '../components/titles/PageTitle.vue';
import PageLoader from '../components/PageLoader.vue';

export default {
    components: {
        PageTitle,
        PageLoader,
    },
    created() {
        this.getStatus();
    },
    methods: {
        async getStatus() {
            try {
                const token = await getToken();
                const response = await axios.get('http://localhost:3000/api/status/', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const status = response.data;
                if (status.admin) {
                    this.$router.push('/admin/dashboard');
                }
                else if (status.loggedIn) {
                    if (status.authenticated) {
                        this.$router.push('/vote');
                    }
                    else {
                        this.$router.push('/authentication');
                    }
                }
                else {
                    this.$router.push('/login');
                }
            } 
            catch (error) {
                if (process.env.NODE_ENV === 'test') {
                    console.log(error);
                } 
                else {
                    this.$router.push('/login');
                }
            }
        },
    },
}
</script>
  
<style scoped>
</style>  