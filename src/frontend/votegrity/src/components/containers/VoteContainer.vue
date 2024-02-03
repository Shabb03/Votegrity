<template>
    <div class="card-container">
        <v-container v-for="(group, index) in candidateData" :key="index">
            <v-row>
                <div v-for="(candidate, cardIndex) in group" :key="cardIndex">
                    <VoteCard
                        :key="index"
                        :candidateId="candidate.id"
                        :imageSrc="candidate.image"
                        :name="candidate.name"
                        :dateOfBirth="candidate.dateOfBirth"
                        :voice="candidate.voice"
                        :party="candidate.party"
                        :biography="candidate.biography"
                        @vote-click="handleVoteClick"
                    />
                </div>
            </v-row>
        </v-container>
    </div>
</template>
  
<script>
import axios from 'axios';
import VoteCard from '../cards/VoteCard.vue';

export default {
    components: {
        VoteCard,
    },
    data: () => ({
        candidateData: [],
    }),
    created() {
        this.fetchCandidates();
    },
    methods: {
        async fetchCandidates() {
            try {
                const authToken = localStorage.getItem("votegrityToken");
                const response = await axios.get('http://localhost:3000/api/election/candidates', {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                });
                const dataArray = response.data;
                const groupSize = 3
                for (let i = 0; i < dataArray.length; i += groupSize) {
                    if (i % 3 === 0) {
                        const group = dataArray.slice(i, i + groupSize);
                        this.candidateData.push(group);
                    }
                }
                console.log(response.data);
            } 
            catch (error) {
                await alert('Error retrieving details:', error);
                window.history.back();
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