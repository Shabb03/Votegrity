<template>
  <div class="form-container">
  <v-form ref="form">
    <TitleInput @update:title="titleValue"/>
    <DescriptionInput @update:description="descriptionValue"/>
    <ElectionDateInput :label="startDateLabel" @update:="startDateValue"/>
    <ElectionDateInput :label="endDateLabel" @update:="endDateValue"/>
    <ElectionDateInput :label="resultDateLabel" @update:="resultDateValue"/>
    <NumberInput @update:number="numberValue"/>
    <AgeInput :label="ageLabel" @update:age="ageValue"/>
    <EmailAuthenticationInput @update:emailDomain="emailDomainValue"/>
    <!--Add CitizenAuthenticationInput-->

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
import TitleInput from './TitleInput.vue';
import DescriptionInput from './DescriptionInput.vue';
import ElectionDateInput from './ElectionDateInput.vue';
import NumberInput from './NumberInput.vue';
import AgeInput from './AgeInput.vue';
import EmailAuthenticationInput from './EmailAuthenticationInput.vue';

export default {
  components: {
    TitleInput,
    DescriptionInput,
    ElectionDateInput,
    NumberInput,
    AgeInput,
    EmailAuthenticationInput,
  },
  data: () => ({
    startDateLabel: "Election Start Date: ",
    endDateLabel: "Election End Date: ",
    resultDateLabel: "Election Results Date: ",
    ageLabel: "Minimum Age Requirement (Optional)",
    title: '',
    description: '',
    startDate: null,
    endDate: null,
    resultDate: null,
    number: 0,
    age: 0,
    emailDomain: null,
  }),
  methods: {
      async validate() {
        const { valid } = await this.$refs.form.validate()
        if (valid) {
          const postData = {
            title: this.title,
            description: this.description,
            candidateNumber: this.number,
            //update this
          };
          try {
            const response = await axios.post('http://localhost:3000/api/admin/addelection', postData);
            if (response.data.error) {
              alert(response.data.error);
            }
            else {
              console.log(response.data);
              //this.$router.push('/addcandidate');
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
        console.log(this.title);
      },
      titleValue(params) {
        this.title = params;
      },
      descriptionValue(params) {
        this.description = params;
      },
      numberValue(params) {
        this.number = params;
      },
      startDateValue(params) {
        this.startDate = params;
      },
      endDateValue(params) {
        this.endDate = params;
      },
      resultDateValue(params) {
        this.resultDate = params;
      },
      ageValue(params) {
        this.age = params;
      },
      emailDomainValue(params) {
        this.emailDomain = params;
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
</style>