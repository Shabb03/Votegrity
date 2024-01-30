<template>
    <div class="form-container">
    <v-form ref="form">
      <CodeInput @update:code="codeValue"/>
      <SecurityAnswerInput @update:securityAnswer1="sa1Value" @update:securityAnswer2="sa2Value"/>
      <PasswordInput :label="passwordLabel1" @update:password="password1Value"/>
      <PasswordInput :label="passwordLabel2" @update:password="password2Value"/>
  
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
    <button class="form-link" @click="getAuthCode">Send Code Again</button>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import CodeInput from './CodeInput.vue';
  import SecurityAnswerInput from './SecurityAnswerInput.vue';
  import PasswordInput from './PasswordInput.vue';
  
  export default {
    components: {
      CodeInput,
      SecurityAnswerInput,
      PasswordInput,
    },
    data: () => ({
        passwordLabel1: "Enter New Password",
        passwordLabel2: "Confirm New Password",
        code: '',
        sa1: '',
        sa2: '',
        password1: '',
        password2: '',
    }),
    methods: {
        async validate() {
          if (this.password1 !== this.password2) {
              alert('Passwords do not match');
              return;
          }
          const { valid } = await this.$refs.form.validate()
          if (valid) {
            const postData = {
              resetToken: this.code,
              securityAnswer1: this.sa1,
              securityAnswer2: this.sa2,
              password: this.password,
            };
            try {
              const token = localStorage.getItem("votegrityToken");
              const response = await axios.post('http://localhost:3000/api/user/changepassword', postData, {
                headers: {
                Authorization: `Bearer ${token}`,
              },
              });
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
        async getAuthCode() {
          try {
              const token = localStorage.getItem("votegrityToken");
              const response = await axios.get('http://localhost:3000/api/user/authenticationcode', {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
              console.log(response.data);
          } 
          catch (error) {
            alert('Error retrieving code:', error);
          }
        },
        reset() {
          this.$refs.form.reset()
        },
        test() {
          console.log(this.password);
        },
        codeValue(params) {
          this.code = params;
        },
        sa1Value(params) {
          this.sa1 = params;
        },
        sa2Value(params) {
          this.sa2 = params;
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