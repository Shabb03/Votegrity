<template>
    <v-text-field
        v-model="securityAnswer1"
        :label="sq1"
        :rules="securityRules"
        @input="updateSecurityAnswer1"
        required
    ></v-text-field>
    <v-text-field
        v-model="securityAnswer2"
        :label="sq2"
        :rules="securityRules"
        @input="updateSecurityAnswer2"
        required
    ></v-text-field>
</template>
  
<script>
import axios from 'axios';

export default {
    data: () => ({
        sq1: 'Security Question 1',
        sq2: 'Security Question 2',
        securityAnswer1: '',
        securityAnswer2: '',
        securityRules: [
          v => !!v || 'Input is required',
        ],
    }),
    /*created() {
      this.fetchUserData();
    },*/
    methods: {
        async fetchUserData() {
            try {
                const authToken = localStorage.getItem("votegrityToken");
                const response = await axios.get('http://localhost:3000/api/user/userinfo', {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                });
                const userData = response.data;
                this.sq1 = userData.securityQuestion1;
                this.sq2 = userData.securityQuestion2;
                console.log(response.data);
            } 
            catch (error) {
                await alert('Error retrieving details:', error);
                window.history.back();
            }
        },
        updateSecurityAnswer1() {
            this.$emit('update:securityAnswer1', this.securityAnswer1);
        },
        updateSecurityAnswer2() {
            this.$emit('update:securityAnswer2', this.securityAnswer2);
        },
    },
};
</script>