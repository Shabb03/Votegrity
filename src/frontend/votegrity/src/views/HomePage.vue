<template>
    <PageTitle/>
    <PageLoader/>
</template>
  
<script>
import axios from 'axios';
//const axios = require('axios');
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
                const token = localStorage.getItem("votegrityToken");
                const response = await axios.get('http://localhost:3000/api/status/', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log(response.data);
                const status = response.data;
              
                if (status.admin) {
                    if (status.election) {
                        this.$router.push('/admin/dashboard');
                    }
                    else {
                        this.$router.push('/admin/createelection');
                    }
                }
                if (status.loggedIn) {
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

                console.log(response.data);
            } 
            catch (error) {
                //window.alert('Server Error: ', error);
                //console.log(error);
                if (process.env.NODE_ENV === 'test') {
                    console.log(error);
                } else {
                    alert('Server Error: ', error);
                }
            }
        },
    },
}
</script>
  
<style scoped>
</style>  