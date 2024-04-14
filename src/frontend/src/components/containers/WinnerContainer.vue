<template>
    <div v-if="winnerData && winnerData.length > 0">
        <v-sheet width="300" class="mx-auto">
            <ElectionChoice :electionData="winnerData" @update:election="electionValue"/>
        </v-sheet>
        <div class="winner-container d-flex justify-space-around align-center" v-for="(candidate, index) in candidateData" :key="index">
            <v-container>
                <v-row>
                    <WinnerBox
                        :name="candidate.name"
                        :voice="candidate.voice"
                        :party="candidate.party"
                        :biography="candidate.biography"
                    />
                    <ImageBox
                        :image="candidate.image"
                    />
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
import PageSubTitle from '../titles/PageSubTitle.vue';
import ElectionChoice from '../inputs/ElectionChoice.vue';
import ImageBox from '../cards/ImageBox.vue';
import WinnerBox from '../cards/WinnerBox.vue';

export default {
    components: {
        PageSubTitle,
        ElectionChoice,
        ImageBox,
        WinnerBox,
    },
    data: () => ({
        pageSubTitle: "No winners for elections",
        winnerData: [],
        candidateData: []
    }),
    created() {
        this.fetchWinner();
    },
    methods: {
        //update the election winner details based on the chosen election to view
        async updateElectionDetails() {
            if (this.selectedElection) {
                const selectedElectionIndex = this.winnerData.findIndex(election => election.id === this.selectedElection);
                if (selectedElectionIndex !== -1) {
                    this.candidateData = this.winnerData[selectedElectionIndex].candidates;
                }
                else {
                    alert('Selected election not found in electionData');
                }
            }
        },
        //used to convert images into a displayable format
        arrayBufferToBase64(buffer) {
            let binary = '';
            const bytes = new Uint8Array(buffer);
            for (let i = 0; i < bytes.byteLength; i++) {
                binary += String.fromCharCode(bytes[i]);
            }
            return btoa(binary);
        },
        //get the image of the winner
        async fetchWinner() {
            try {
                const authToken = await getToken();
                const response = await axios.get('http://localhost:3000/api/election/results', {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                });
                if (response.data.error) {
                    alert(response.data.error);
                }
                else {
                    this.winnerData = response.data.electionResults;
                    for (const index in this.winnerData) {
                        const candidateArray = this.winnerData[index].candidates;
                        for (const index2 in candidateArray) {
                            const candidate = candidateArray[index2];
                            const imageResponse = await axios.get('http://localhost:3000/api/election/image/'+candidate.id, {
                                headers: {
                                    Authorization: `Bearer ${authToken}`,
                                },
                                responseType: 'arraybuffer',
                            });
                            const binaryData = new Uint8Array(imageResponse.data);
                            const dataUrl = this.arrayBufferToBase64(binaryData);
                            candidate.image = `data:image/jpeg;base64,${dataUrl}`;
                        }
                    }
                }
            }
            catch (error) {
                if (process.env.NODE_ENV === 'test') {
                    console.log(error);
                } 
                else {
                    alert('Error: No winner for election');
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
.winner-container {
    margin-top: 3em !important;
}
</style>  