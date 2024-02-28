<template>
    <div v-if="electionData && electionData.length > 0" class="form-container">
        <ConfirmationCard ref="confirmationCardRef" @continueValidation="handleContinue" />
        <v-form ref="form">
            <ElectionChoice :electionData="electionData" @update:election="electionValue"/>
            <h3>Number of Candidates: {{ addedCandidates }}/{{ candidateCount }}</h3>
            <TextInput :label="nameLabel" :required="true" @update:text="nameValue" />
            <ImageInput :label="imageLabel" @update:image="imageValue"/>
            <DateInput :label="birthDateLabel" @update:date="dateOfBirthValue"/>
            <TextInput :label="bioLabel" :required="true" @update:text="bioValue"/>
            <TextInput :label="voiceLabel" @update:text="voiceValue"/>
            <TextInput :label="partyLabel" @update:text="partyValue"/>
  
            <div class="d-flex flex-row">
                <v-btn class="mt-4 primary" @click="triggerConfirmationCard">
                    Add Candidate
                </v-btn>
                <v-btn class="mt-4 ml-10 secondary" @click="reset">
                    Reset
                </v-btn>
                <v-btn class="mt-4 ml-10" @click="test">
                    Test
                </v-btn>
            </div>
        </v-form>
    </div>
    <div v-else>
        <PageSubTitle :pageSubTitle="pageSubTitle" />
    </div>
</template>
  
<script>
import axios from 'axios';
import getToken from '../../functions/GetToken.vue';
import ConfirmationCard from '../ConfirmationCard.vue';
import ElectionChoice from '../inputs/ElectionChoice.vue';
import TextInput from '../inputs/TextInput.vue';
import ImageInput from '../inputs/ImageInput.vue';
import DateInput from '../inputs/DateInput.vue';
import PageSubTitle from '../titles/PageSubTitle.vue';
  
export default {
    components: {
        ConfirmationCard,
        ElectionChoice,
        TextInput,
        ImageInput,
        DateInput,
        PageSubTitle,
    },
    data: () => ({
        nameLabel: 'Candidate Full Name',
        birthDateLabel: 'Birth Date: ',
        imageLabel: 'Candidate Photo',
        bioLabel: 'Biography',
        voiceLabel: 'Voice',
        partyLabel: 'Party',
        electionData: [],
        selectedElection: null,
        addedCandidates: 0,
        candidateCount: 0,
        name: '',
        dateOfBirth: null,
        bio: '',
        voice: null,
        party: null,
        image: null,
        pageSubTitle: 'No Candidates required',
    }),
    created() {
        this.getElections();
    },
    /*
    mounted() {
        window.addEventListener('keyup', this.handleKeyUp.bind(this));
    },
    */
    methods: {
        async triggerConfirmationCard() {
            const { valid } = await this.$refs.form.validate()
            if (valid) {
                this.$refs.confirmationCardRef.openDialog();
            }
        },
        async updateCandidateCounts() {
            if (this.selectedElection) {
                const selectedElectionIndex = this.electionData.findIndex(election => election.id === this.selectedElection);
                if (selectedElectionIndex !== -1) {
                    this.addedCandidates = this.electionData[selectedElectionIndex].addedCandidates;
                    this.candidateCount = this.electionData[selectedElectionIndex].candidateNumber;
                } 
                else {
                    alert('Selected election not found in electionData');
                }
            }
        },
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
                formData.append('electionId', this.selectedElection);
                //console.log("formData", formData);
                try {
                    const token = await getToken();
                    const response = await axios.post('http://localhost:3000/api/admin/addcandidate', formData, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    const candidateData = response.data;
                    if (candidateData.error) {
                        alert(candidateData.error);
                    }
                    else {
                        if ((this.addedCandidates + 1) >= this.candidateCount) {
                            this.$router.push('/admin/dashboard');
                        } 
                        else {
                            window.location.reload();
                        }
                    }
                } 
                catch (error) {
                    if (process.env.NODE_ENV === 'test') {
                        console.log(error);
                    } 
                    else {
                        alert('Error adding candidate:', error);
                    }
                }
            }
        },
        async getElections() {
            try {
                const authToken = await getToken();
                const response = await axios.get('http://localhost:3000/api/admin/newelections', {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                });
                const data = response.data.activeElections;
                this.electionData = data;
            } 
            catch (error) {
                if (process.env.NODE_ENV === 'test') {
                    console.log(error);
                } 
                else {
                    alert('Error retrieving details:', error);
                }
            }
        },
        async handleContinue() {
            this.validate();
        },
        /*
        handleKeyUp(event) {
            if (event.keyCode === 13) { 
                this.validate();
            }
        },
        */
        reset() {
            this.$refs.form.reset()
        },
        test() {
            /*
            console.log(this.name);
            console.log(this.image);
            console.log(this.voice);
            */
            console.log(this.selectedElection);
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
        async electionValue(params) {
            this.selectedElection = params;
            await this.updateCandidateCounts();
        },
    },
};
</script>
  
<style scoped>
.form-container {
    background-color: white;
    margin-top: 5em !important;
    margin-bottom: 5em !important;
    width: 50%;
    margin: auto;
    padding: 20px;
    border-radius: 25px;
    box-shadow: 0 12px 16px 0 rgba(0,0,0,0.24), 0 17px 50px 0 rgba(0,0,0,0.19);
  
    @media (max-width: 600px) {
        width: 100%;
    }
}

.primary {
    background-color: #00e5ff;
}

.primary:hover, 
.primary:focus {
    cursor: 'pointer';
    font-weight: bolder;
    box-shadow: 0 12px 16px 0 rgba(0,0,0,0.24), 0 17px 50px 0 #2616bb;
    transform: translateY(-0.25em);
}
.primary:active {
    cursor: wait;
}

.secondary {
    background-color: #2616bb;
    color: white;
}

.secondary:hover, 
.secondary:focus {
    cursor: 'pointer';
    font-weight: bolder;
    box-shadow: 0 12px 16px 0 rgba(0,0,0,0.24), 0 17px 50px 0 #00e5ff;
    transform: translateY(-0.25em);
}
</style>