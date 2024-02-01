<template>
    <div class="form-container">
    <v-form ref="form">
      <h3>Number of Candidates: {{addedCandidates}}/{{ candidateCount }}</h3>
      <NameInput @update:name="nameValue"/>
      <ImageInput @update:image="imageValue"/>
      <DateInput @update:dateOfBirth="dateOfBirthValue"/>
      <BiographyInput @update:bio="bioValue"/>
      <VoiceInput @update:voice="voiceValue"/>
      <PartyInput @update:party="partyValue"/>
  
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
import NameInput from './NameInput.vue';
import ImageInput from './ImageInput.vue';
import DateInput from './DateInput.vue';
import BiographyInput from './BiographyInput.vue';
import VoiceInput from './VoiceInput.vue';
import PartyInput from './PartyInput.vue';
  
export default {
    components: {
      NameInput,
      ImageInput,
      DateInput,
      BiographyInput,
      VoiceInput,
      PartyInput,
    },
    data: () => ({
      addedCandidates: 0,
      candidateCount: 0,
      name: '',
      dateOfBirth: null,
      bio: '',
      voice: null,
      party: null,
      image: null,
    }),
    created() {
      this.getCandidateCount();
    },
    methods: {
        async validate() {
          const { valid } = await this.$refs.form.validate()
          if (valid) {
            const formData = new FormData();
            formData.append('name', this.name);
            formData.append('image', this.image);
            formData.append('dateOfBirth', this.dateOfBirth);
            formData.append('biography', this.bio);
            formData.append('voice', this.voice);
            formData.append('party', this.party);
            /*
            dateOfBirth,
            */
            try {
              const token = localStorage.getItem("votegrityToken");
              const response = await axios.post('http://localhost:3000/api/admin/addcandidate', formData, {
                headers: {
                Authorization: `Bearer ${token}`,
              },
              });
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
        async getCandidateCount() {
          try {
            const authToken = localStorage.getItem("votegrityToken");
            const response = await axios.get('http://localhost:3000/api/admin/candidatecount', {
              headers: {
                Authorization: `Bearer ${authToken}`,
              },
            });
            const data = response.data;
            this.addedCandidates = data.addedCandidates;
            this.candidateCount = data.candidateCount;
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
          console.log(this.name);
          console.log(this.image);
          console.log(this.voice);
        },
        nameValue(params) {
          this.name = params;
        },
        dateOfBirthValue(params) {
            this.dateOfBirth = params;
        },
        bioValue(params) {
            this.bio = params;
        },
        voiceValue(params) {
            this.voice = params;
        },
        partyValue(params) {
            this.party = params;
        },
        imageValue(params) {
            this.image = params;
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