<template>
    <div class="form-container">
    <v-form ref="form">
      <PasswordInput @update:password="password1Value"/>
      <PasswordInput @update:password="password2Value"/>
  
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
  import PasswordInput from './PasswordInput.vue';
  
  export default {
    components: {
      PasswordInput,
    },
    data: () => ({
        password1: '',
        password2: '',
    }),
    methods: {
        async validate() {
          const { valid } = await this.$refs.form.validate()
          if (valid) {
            if (this.password1 !== this.password2) {
              alert('Passwords do not match');
              return;
            }
            const postData = {
              password: this.password,
            };
            try {
              const response = await axios.post('http://localhost:3000/api/user/changepassword', postData);
              if (response.data.error) {
                alert(response.data.error);
              }
              else {
                localStorage.setItem("votegrityToken","");
                console.log(response.data);
                //this.$router.push('/login');
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
          console.log(this.password);
        },
        password1Value(params) {
          this.password1 = params;
        },
        password2Value(params) {
          this.password2 = params;
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