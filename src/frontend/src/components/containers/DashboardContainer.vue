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
import getToken from '../../functions/GetToken.vue';
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
        daysLeft: '',
        candidateNumber: '',
        voteCount: '',
    }),
    created() {
        this.fetchInformation();
    },
    methods: {
        formatResultDate(dateInput) {
        const date = new Date(dateInput);
            return date.toLocaleDateString('en-GB', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });
        },
        getDaysDifference(startDate, endDate) {
            const oneDay = 24 * 60 * 60 * 1000;
            const start = new Date(startDate);
            const end = new Date(endDate);
            const daysDifference = Math.round(Math.abs((start - end) / oneDay));
            return daysDifference;
        },
        async fetchInformation() {
            try {
                const authToken = await getToken();
                const response = await axios.get('http://localhost:3000/api/admin/election', {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                });
                const electionData = response.data;
                if (electionData.error) {
                    await alert(electionData.error);
                    //window.history.back();
                }
                else {
                    this.title = electionData.title;
                    this.candidateNumber = electionData.candidateNumber + "/" + electionData.candidateNumber + " Candidates";
                    this.voteCount = electionData.voteCount + " Total Votes";
                    const resultDate = this.formatResultDate(electionData.resultDate);
                    this.description = electionData.description + "<br><br>Result Date: " + resultDate + "<br><br>Age Restriction: " + electionData.ageRestriction;
                    const daysDifference = this.getDaysDifference(electionData.startDate, electionData.endDate);
                    this.daysLeft = daysDifference.toString() + " Days Left";
                    //console.log(response.data);
                }
            } 
            catch (error) {
                if (process.env.NODE_ENV === 'test') {
                    console.log(error);
                } 
                else {
                    alert('Error retrieving details:', error);
                }
                //window.history.back();
            }
        },
    }
}
</script>
  
<style scoped>
.card-container {
    margin-top: 3em !important;
}
</style>  