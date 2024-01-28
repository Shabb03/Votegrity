<template>
  <div class="form-container">
  <v-form ref="form">
    <v-text-field disabled
        v-model="name"
        label="Name: "
    ></v-text-field>
    <v-text-field disabled
        v-model="date"
        label="Date of Birth: "
    ></v-text-field>
    <v-text-field disabled
        v-model="specialNumber"
        label="Special Number: "
    ></v-text-field>
    <v-text-field disabled
        v-model="citizenship"
        label="Citizenship: "
    ></v-text-field>
    <EmailInput @update:email="emailValue"/>
    <PhoneNumberInput @update:phoneNumber="phoneNumberValue"/>

    <div class="d-flex flex-row">
        <v-btn color="success" class="mt-4" @click="validate">
          Submit
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
import EmailInput from './EmailInput.vue';
import PhoneNumberInput from './PhoneNumberInput.vue';

export default {
  components: {
    EmailInput,
    PhoneNumberInput,
  },
  data: () => ({
      name: '',
      email: '',
      citizenship: '',
      specialNumber: '',
      phoneNumber: '',
      date: null,
  }),
  created() {
    this.fetchUserData();
  },
  methods: {
      async validate() {
        const { valid } = await this.$refs.form.validate()
        if (valid) {
          const postData = {
            email: this.email,
            phoneNumber: this.phoneNumber,
          };
          try {
            const authToken = this.getAuthToken();
            const response = await axios.post('http://localhost:3000/api/user/useremail', postData, {
              headers: {
                Authorization: `Bearer ${authToken}`,
              },
            });
            //const userData = response.data;
            console.log(response.data);
            window.location.reload();
          } 
          catch (error) {
            alert('Error changing details:', error);
          }
        }
      },
      async fetchUserData() {
        try {
            const authToken = localStorage.getItem("votegrityToken");
            const response = await axios.get('http://localhost:3000/api/user/userinfo', {
              headers: {
                Authorization: `Bearer ${authToken}`,
              },
            });
            const userData = response.data;
            this.name = userData.name;
            this.date = userData.date;
            this.specialNumber = userData.specialNumber;
            this.citizenship = userData.citizenship;
            this.email = userData.email;
            this.phoneNumber = userData.phoneNumber;
            console.log(response.data);
        } 
        catch (error) {
          alert('Error retrieving details:', error);
        }
      },
      reset() {
        this.$refs.form.reset()
      },
      test() {
        console.log(this.email);
        console.log(this.phoneNumber);
      },
      emailValue(params) {
        this.email = params;
      },
      phoneNumberValue(params) {
        this.phoneNumber = params;
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