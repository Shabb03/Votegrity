<template>
  <div class="form-container">
  <v-form ref="form">
    <NameInput @update:name="nameValue"/>
    <EmailInput @update:email="emailValue"/>
    <PasswordInput @update:password="passwordValue"/>
    <CitizenshipInput @update:citizenship="citizenshipValue"/>
    <SpecialNumberInput @update:specialNumber="specialNumberValue"/>
    <PhoneNumberInput @update:phoneNumber="phoneNumberValue"/>
    <DateInput @update:date="dateValue"/>

    <div class="d-flex flex-row">
        <v-btn color="success" class="mt-4" @click="validate">
          Sign Up!
        </v-btn>
        <v-btn color="error" class="mt-4 ml-10" @click="reset">
          Reset
        </v-btn>
        <v-btn class="mt-4 ml-10" @click="test">
          Test
        </v-btn>
      </div>
  </v-form>
  <router-link class="form-link" to="/login">Login</router-link>
  </div>
</template>

<script>
import axios from 'axios';
import NameInput from './NameInput.vue';
import EmailInput from './EmailInput.vue';
import PasswordInput from './PasswordInput.vue';
import CitizenshipInput from './CitizenshipInput.vue';
import SpecialNumberInput from './SpecialNumberInput.vue';
import PhoneNumberInput from './PhoneNumberInput.vue';
import DateInput from './DateInput.vue';

export default {
  components: {
    NameInput,
    EmailInput,
    PasswordInput,
    CitizenshipInput,
    SpecialNumberInput,
    PhoneNumberInput,
    DateInput,
  },
  data: () => ({
      name: '',
      email: '',
      password: '',
      citizenship: '',
      specialNumber: '',
      phoneNumber: '',
      date: null,
  }),
  methods: {
      async validate() {
        const { valid } = await this.$refs.form.validate()
        if (valid) {
          const postData = {
            name: this.name,
            email: this.email,
            password: this.password,
            dateOfBirth: this.date,
            specialNumber: this.specialNumber,
            citizenship: this.citizenship,
            phoneNumber: this.phoneNumber,
            securityQuestion1: 'SQ1',
            securityAnswer1: 'SA1',
            securityQuestion2: 'SQ2',
            securityAnswer2: 'SA2',
          };
          try {
            const response = await axios.post('http://localhost:3000/api/user/register', postData);
            console.log(response.data);
            //this.$router.push('/login');
          } 
          catch (error) {
            alert('Error during registration:', error);
          }
        }
      },
      reset() {
        this.$refs.form.reset()
      },
      test() {
        console.log(this.name);
        console.log(this.email);
        console.log(this.password);
        console.log(this.citizenship);
        console.log(this.specialNumber);
        console.log(this.phoneNumber);
        console.log(this.date);
      },
      nameValue(params) {
        this.name = params;
      },
      emailValue(params) {
        this.email = params;
      },
      passwordValue(params) {
        this.password = params;
      },
      citizenshipValue(params) {
        this.citizenship = params;
      },
      specialNumberValue(params) {
        this.specialNumber = params;
      },
      phoneNumberValue(params) {
        this.phoneNumber = params;
      },
      dateValue(params) {
        this.date = params;
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