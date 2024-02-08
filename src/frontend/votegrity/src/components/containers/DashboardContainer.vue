<template>
    <div class="card-container">
        <v-container>
            <v-row>
                <DashboardCard :imageSrc="require('@/assets/election.png')" :informationTitle="title" :informationText="description"/>
                <DashboardCard :imageSrc="require('@/assets/date.png')" :informationTitle="daysLeft"/>
                <DashboardCard :imageSrc="require('@/assets/votes.png')" :informationTitle="voteCount"/>
                <DashboardCard :imageSrc="require('@/assets/candidate.png')" :informationTitle="candidateNumber"/>
            </v-row>
        </v-container>
    </div>
    <ResetButton/>
</template>

<script>
import axios from 'axios';
import DashboardCard from '../cards/DashboardCard.vue';
import ResetButton from '../buttons/ResetButton.vue';

export default {
    components: {
        DashboardCard,
        ResetButton,
    },
    data: () => ({
        title: '',
        description: '',
        daysLeft: null,
        candidateNumber: null,
        voteCount: null,
    }),
    created() {
        this.fetchInformation();
    },
    methods: {
        async fetchInformation() {
            try {
                const authToken = localStorage.getItem("votegrityToken");
                const response = await axios.get('http://localhost:3000/api/admin/election', {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                });
                const electionData = response.data;
                this.title = electionData.title;
                this.candidateNumber = electionData.candidateNumber + "/" + electionData.candidateNumber + " Candidates";
                this.voteCount = electionData.voteCount + " Votes";
                this.description = electionData.description + "\nResult Date: " + electionData.resultDate + "\nAge Restriction: " + electionData.ageRestriction;
                this.daysLeft = this.getDaysDifference(electionData.startDate, electionData.endDate);
                console.log(response.data);
            } 
            catch (error) {
                await alert('Error retrieving details:', error);
                window.history.back();
            }
        },
        getDaysDifference(startDate, endDate) {
            const oneDay = 24 * 60 * 60 * 1000;
            const start = new Date(startDate);
            const end = new Date(endDate);
            const daysDifference = Math.round(Math.abs((start - end) / oneDay));
            return daysDifference;
        },
  }
}
</script>
  
<style scoped>
.card-container {
    margin-top: 3em !important;
}
</style>  