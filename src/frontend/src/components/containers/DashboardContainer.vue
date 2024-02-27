<template>
    <div v-if="electionData && electionData.length > 0" class="card-container">
        <v-sheet width="300" class="mx-auto mb-12">
        <v-autocomplete
            v-model="selectedElection"
            label="Select Election"
            :items="electionData"
            item-text="title" 
            item-value="id"
            :rules="[]"
        ></v-autocomplete>
        </v-sheet>
        <!--<ResetButton/>-->

        <!--<v-container v-for="(election, index) in electionData" :key="index">
            <v-row>
                <DashboardCard :imageSrc="require('@/assets/election.png')" :informationTitle="election.title" :informationText="election.description"/>
                <DashboardCard :imageSrc="require('@/assets/date.png')" :informationTitle="election.resultDate"/>
                <DashboardCard :imageSrc="require('@/assets/votes.png')" :informationTitle="election.voteCount + ' Total Votes'"/>
                <DashboardCard :imageSrc="require('@/assets/candidate.png')" :informationTitle="'Candidates: ' + election.candidateNumber"/>
            </v-row>
        </v-container>-->
        <v-container>
            <v-row>
                <DashboardCard :imageSrc="require('@/assets/election.png')" :informationTitle="title" :informationText="description"/>
                <DashboardCard :imageSrc="require('@/assets/date.png')" :informationTitle="daysLeft + ' Days Left'"/>
                <DashboardCard :imageSrc="require('@/assets/votes.png')" :informationTitle="voteCount + ' Total Votes'"/>
                <DashboardCard :imageSrc="require('@/assets/candidate.png')" :informationTitle="'Candidates: ' + candidateNumber"/>
            </v-row>
        </v-container>
    <ResetButton/>
    </div>
    <div v-else>
        <PageSubTitle :pageSubTitle="pageSubTitle" />
    </div>
</template>

<script>
import axios from 'axios';
import getToken from '../../functions/GetToken.vue';
import DashboardCard from '../cards/DashboardCard.vue';
import ResetButton from '../buttons/ResetButton.vue';
import PageSubTitle from '..//titles/PageSubTitle.vue';

export default {
    components: {
        DashboardCard,
        ResetButton,
        PageSubTitle,
    },
    data: () => ({
        title: '',
        description: '',
        daysLeft: '',
        candidateNumber: '',
        voteCount: '',
        electionData: [],
        selectedElection: null,
        pageSubTitle: 'No Active Elections currently',
    }),
    created() {
        this.fetchInformation();
    },
    watch: {
        selectedElection: {
            handler: 'updateElectionDetails',
            immediate: true,
        },
    },
    methods: {
        async updateElectionDetails() {
            if (this.selectedElection) {
                const selectedElectionIndex = this.electionData.findIndex(election => election.id === this.selectedElection);
                if (selectedElectionIndex !== -1) {
                    this.title = this.electionData[selectedElectionIndex].title;
                    this.description = this.electionData[selectedElectionIndex].description;
                    this.daysLeft = this.electionData[selectedElectionIndex].resultDate;
                    this.candidateNumber = this.electionData[selectedElectionIndex].candidateNumber;
                    this.voteCount = this.electionData[selectedElectionIndex].voteCount;
                } 
                else {
                    alert('Selected election not found in electionData');
                }
            }
        },
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
            const daysDifference = Math.round((end - start) / oneDay);
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
                if (response.data.error) {
                    await alert(response.data.error);
                    //window.history.back();
                }
                else {
                    this.electionData = response.data.activeElections;
                    for (const index in this.electionData) {
                        const item = this.electionData[index];
                        console.log(item);
                        
                        const resultDate = this.formatResultDate(item.resultDate);
                        item.description = item.description + "<br><br>Result Date: " + resultDate;
                        const today = new Date();
                        const daysDifference = this.getDaysDifference(today, item.endDate);
                        item.resultDate = daysDifference.toString();
                    }
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
    margin-top: 1em !important;
}
</style>  