<template>
    <div class="form-container">
    <v-form ref="form">
      <EmailInput @update:email="emailValue"/>
      <PasswordInput @update:password="passwordValue"/>
  
      <div class="d-flex flex-row">
          <v-btn color="success" class="mt-4" @click="validate">
            Login
          </v-btn>
          <v-btn color="error" class="mt-4 ml-10" @click="reset">
            Reset
          </v-btn>
          <v-btn class="mt-4 ml-10" @click="test">
            Test
          </v-btn>
        </div>
    </v-form>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import EmailInput from '../inputs/EmailInput.vue';
  import PasswordInput from '../inputs/PasswordInput.vue';
  
  export default {
    components: {
      EmailInput,
      PasswordInput,
    },
    data: () => ({
        email: '',
        password: '',
    }),
    methods: {
        async validate() {
          const { valid } = await this.$refs.form.validate()
          if (valid) {
            const postData = {
              email: this.email,
              password: this.password,
            };
            try {
              const response = await axios.post('http://localhost:3000/api/admin/login', postData);
              if (response.data.error) {
                alert(response.data.error);
              }
              else {
                const token = response.data.token;
                localStorage.setItem("votegrityToken",token);
                console.log(response.data);
                //this.$router.push('/admin/dashboard');
              }
            } 
            catch (error) {
              alert('Error during login:', error);
            }
          }
        },
        reset() {
          this.$refs.form.reset()
        },
        test() {
          console.log(this.email);
          console.log(this.password);
        },
        emailValue(params) {
          this.email = params;
        },
        passwordValue(params) {
          this.password = params;
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