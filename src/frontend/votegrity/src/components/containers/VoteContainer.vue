<template>
    <SuccessCard ref="successCardRef" :message="successMessage" :routeName="successRoute"/>
    <div class="card-container">
        <div v-if="candidateData.length > 0">
        <v-container v-for="(group, index) in candidateData" :key="index">
            <v-row>
                <div v-for="(candidate, cardIndex) in group" :key="cardIndex">
                    <VoteCard
                        @callSuccessCard="triggerSuccessCard"
                        :key="index"
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
</template>
  
<script>
import axios from 'axios';
import SuccessCard from "../SuccessCard.vue";
import VoteCard from '../cards/VoteCard.vue';

export default {
    components: {
        SuccessCard,
        VoteCard,
    },
    data: () => ({
        successMessage: 'You have successfully registered your account',
        successRoute: '/thankyou',
        candidateData: [],
    }),
    created() {
        this.fetchCandidates();
    },
    methods: {
        async triggerSuccessCard() {
            this.$refs.successCardRef.openDialog();
        },
        parseDate(dateString) {
            const [year, month, day] = dateString.split('-');
            return new Date(year, month - 1, day);
        },
        async fetchCandidates() {
            try {
                const authToken = localStorage.getItem("votegrityToken");
                const response = await axios.get('http://localhost:3000/api/election/candidates', {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                });
                const dataArray = response.data.candidates;
                const groupSize = 3;

                if (dataArray.length === 0) {
                    window.alert('Error: No Candidates added to election')
                }
                
                for (let i = 0; i < dataArray.length; i += groupSize) {
                    if (i % 3 === 0) {
                        const group = dataArray.slice(i, i + groupSize);
                        this.candidateData.push(group);
                    }
                }
                //this.candidateData = dataArray;
            } 
            catch (error) {
                if (process.env.NODE_ENV === 'test') {
                    console.log(error);
                } else {
                    alert('Error retrieving details:', error);
                }
                //window.history.back();
            }
        }
    }
}
</script>
  
<style scoped>
.card-container {
    margin-top: 3em !important;
}
</style>  