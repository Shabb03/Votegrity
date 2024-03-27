<template>
    <div>
    </div>
</template>
  
<script>
import axios from 'axios';
import getToken from '../../functions/GetToken.vue';
  
export default {
    data() {
        return {
            loading: true,
        };
    },
    //check if the user is not authenticated otherwise redirect
    async created() {
        try {
            const token = await getToken();
            const response = await axios.get('http://localhost:3000/api/status/', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const { loggedIn, authenticated } = response.data;
            if (!loggedIn) {
                this.$router.push('/');
            }
            if (authenticated) {
                this.$router.push('/vote');
            }
            this.loading = false;
        } 
        catch (error) {
            if (process.env.NODE_ENV === 'test') {
                console.log(error);
            } 
            else {
                //alert('Error fetching status: ', error);
            }
            this.loading = false;
        }
    },
};
</script>
  
<style scoped>
</style>
  