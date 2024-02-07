<template>
    <div>
    </div>
</template>
  
<script>
import axios from 'axios';
  
export default {
    data() {
        return {
            loading: true,
        };
    },
    async created() {
        try {
            const token = localStorage.getItem("votegrityToken");
            const response = await axios.get('http://localhost:3000/api/status/', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const { loggedIn, authenticated } = response.data;
            if (loggedIn && authenticated === false) {
                this.$router.push('/');
            }
            this.loading = false;
        } 
        catch (error) {
            console.error('Error fetching status:', error);
            this.loading = false;
        }
    },
};
</script>
  
<style scoped>
</style>
  