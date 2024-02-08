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
            const { admin, election } = response.data;
            if (!admin) {
                this.$router.push('/');
            }
            if (election === true) {
                this.$router.push('/admin/dashboard');
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