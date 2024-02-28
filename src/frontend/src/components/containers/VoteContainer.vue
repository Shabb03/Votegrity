<template>
    <SuccessCard ref="successCardRef" :message="successMessage" :routeName="successRoute"/>
    <div v-if="electionData && electionData.length > 0" class="card-container">
        <v-sheet width="300" class="mx-auto mb-12">
            <ElectionChoice :electionData="electionData" @update:election="electionValue"/>
        </v-sheet>

        <div v-if="selectedElection">
            <v-container v-for="(group, index) in candidateData" :key="index">
                <v-row>
                    <div v-for="(candidate, cardIndex) in group" :key="cardIndex">
                        <VoteCard
                            @callSuccessCard="triggerSuccessCard"
                            :key="index"
                            :electionId="selectedElection"
                            :candidateId="candidate.id"
                            :name="candidate.name"
                            :dateOfBirth="parseDate(candidate.dateOfBirth)"
                            :voice="candidate.voice"
                            :party="candidate.party"
                            :biography="candidate.biography"
                        />
                    </div>
                </v-row>
            </v-container>
        </div>
    </div>
    <div v-else>
        <PageSubTitle :pageSubTitle="pageSubTitle" />
    </div>
</template>
  
<script>
import axios from 'axios';
import getToken from '../../functions/GetToken.vue';
import SuccessCard from "../SuccessCard.vue";
import ElectionChoice from '../inputs/ElectionChoice.vue';
import VoteCard from '../cards/VoteCard.vue';
import PageSubTitle from '../titles/PageSubTitle.vue';

export default {
    components: {
        SuccessCard,
        ElectionChoice,
        VoteCard,
        PageSubTitle,
    },
    data: () => ({
        successMessage: 'You have successfully voted',
        successRoute: '/thankyou',
        electionData: [],
        candidateData: [],
        selectedElection: null,
        pageSubTitle: 'No Active Elections currently',
    }),
    created() {
        this.fetchCandidates();
    },
    methods: {
        async updateElectionDetails() {
            if (this.selectedElection) {
                const selectedElectionIndex = this.electionData.findIndex(election => election.id === this.selectedElection);
                if (selectedElectionIndex !== -1) {
                    const candidateArray = this.electionData[selectedElectionIndex].candidates;
                    const groupSize = 3;
                    for (let i = 0; i < candidateArray.length; i += groupSize) {
                        if (i % 3 === 0) {
                            const group = candidateArray.slice(i, i + groupSize);
                            this.candidateData.push(group);
                        }
                    }
                } 
                else {
                    alert('Selected election not found in electionData');
                }
            }
        },
        async triggerSuccessCard(name) {
            this.successMessage = 'You have successfully voted for ' + name;
            this.$refs.successCardRef.openDialog();
        },
        parseDate(dateString) {
            const [year, month, day] = dateString.split('-');
            return new Date(year, month - 1, day);
        },
        async fetchCandidates() {
            try {
                const authToken = await getToken();
                const response = await axios.get('http://localhost:3000/api/election/candidates', {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                });
                const dataArray = response.data.candidates;
                this.electionData = response.data.candidates;
                if (dataArray.length === 0) {
                    window.alert('Error: No Candidates added to election')
                }
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
        async electionValue(params) {
            this.selectedElection = params;
            await this.updateElectionDetails();
        },
    }
}
</script>
  
<style scoped>
.card-container {
    margin-top: 3em !important;
}
</style>  