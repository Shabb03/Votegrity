<template>
    <div class="form-container">
    <v-form ref="form">
      <CodeInput @update:code="codeValue"/>
  
      <div class="d-flex flex-row">
          <v-btn color="success" class="mt-4" @click="validate">
            Submit
          </v-btn>
          <v-btn color="error" class="mt-4 ml-10" @click="reset">
            Reset
          </v-btn>
        </div>
    </v-form>
    <button class="form-link" @click="getAuthCode">Send Code Again</button>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import CodeInput from '../inputs/CodeInput.vue';
  
  export default {
    components: {
      CodeInput,
    },
    data: () => ({
        code: '',
    }),
    /*created() {
      this.getResetCode();
    },*/
    methods: {
        async validate() {
          const { valid } = await this.$refs.form.validate()
          if (valid) {
            const postData = {
                authToken: this.code,
            };
            try {
              const token = localStorage.getItem("votegrityToken");
              const response = await axios.post('http://localhost:3000/api/admin/reset', postData, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
              //const userData = response.data;
              console.log(response.data);
              if (response.data.error) {
                alert('Invalid Code');
              }
              else {
                //this.$router.push('/vote');
              }  
            } 
            catch (error) {
              alert('Error submitting authentication code:', error);
            }
          }
        },
        async getResetCode() {
          try {
              const token = localStorage.getItem("votegrityToken");
              const response = await axios.get('http://localhost:3000/api/admin/resettoken', {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
              if (response.data.reset === true) {
                this.$router.push('/admin/createelection');
              }
              console.log(response.data);
          } 
          catch (error) {
            alert('Error retrieving code:', error);
          }
        },
        reset() {
          this.$refs.form.reset()
        },
        codeValue(params) {
          this.code = params;
        },
      },
  };
  </script>
  
  <style scoped>
    .form-container {
      margin-top: 5em !important;
      width: 50%;
      margin: auto;
      padding: 20px;
  
      @media (max-width: 600px) {
        width: 100%;
      }
    }
  
    .form-link {
      color: blue; 
      margin-top: 2em;
      display: block;
    }
  </style>