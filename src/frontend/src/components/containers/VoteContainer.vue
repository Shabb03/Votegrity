<template>
    <SuccessCard ref="successCardRef" :message="successMessage" :routeName="successRoute"/>
    <div v-if="electionData && electionData.length > 0" class="card-container">
        <v-sheet width="300" class="mx-auto">
            <ElectionChoice :electionData="electionData" @update:election="electionValue"/>
        </v-sheet>

        <div v-if="selectedElection">
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
                        <div v-if="electionType === 'majority'">
                            <VoteButton
                                @callSuccessCard="triggerSuccessCard"
                                :key="index"
                                :electionId="selectedElection"
                                :electionType="electionType"
                                :candidateId="candidate.id"
                                :name="candidate.name"
                            />
                        </div>
                        <div v-if="electionType === 'ranked'">
                            <RankChoiceInput
                                :key="candidate.id"
                                :rankData="rankList"
                                @update:rank="updateRank(candidate.id, $event)"
                            />
                        </div>
                        <div v-if="electionType === 'point-based'">
                            <VoteScoreInput 
                                :key="candidate.id"
                                :label="`Score for ${candidate.name}`"
                                @update:score="updateScore(candidate.id, $event)"
                            />
                        </div>
                        <div v-if="electionType === 'single-transferable'">
                            <RankChoiceInput
                                :key="candidate.id"
                                :rankData="rankList"
                                @update:rank="updateRank(candidate.id, $event)"
                            />
                        </div>
                    </div>
                </v-row>
                <div v-if="electionType === 'ranked'">
                    <h1 class="voteInfo">1 = Highest</h1>
                </div>
                <div v-if="electionType === 'point-based'">
                    <h1 class="voteInfo">Remaining Score: {{ totalScore }}</h1>
                </div>
                <br>
                <div v-if="electionType === 'ranked' || electionType === 'point-based'" class="votebutton">
                    <v-btn size="x-large" rounded="lg" elevation="8" @click="vote()">Vote</v-btn>
                    <v-sheet v-if="errorMessage !== ''" class="mx-auto" width="350">
                        <h3 class="errorMessage">{{ errorMessage }}</h3>
                    </v-sheet>
                </div>
            </v-container>
        </div>
    </div>
    <div v-else>
        <PageSubTitle :pageSubTitle="pageSubTitle" />
    </div>
    <ResultsButton/>
</template>
  
<script>
import axios from 'axios';
import getToken from '../../functions/GetToken.vue';
import ResultsButton from '../buttons/ResultsButton.vue';
import PageSubTitle from '../titles/PageSubTitle.vue';
import SuccessCard from "../SuccessCard.vue";
import ElectionChoice from '../inputs/ElectionChoice.vue';
import VoteCard from '../cards/VoteCard.vue';
import VoteButton from '../buttons/VoteButton.vue';
import RankChoiceInput from '../inputs/RankChoiceInput.vue';
import VoteScoreInput from '../inputs/VoteScoreInput.vue';

export default {
    components: {
        ResultsButton,
        PageSubTitle,
        SuccessCard,
        ElectionChoice,
        VoteCard,
        VoteButton,
        RankChoiceInput,
        VoteScoreInput
    },
    data: () => ({
        pageSubTitle: 'No Active Elections currently',
        successMessage: 'You have successfully voted',
        successRoute: '/thankyou',
        electionData: [],
        candidateData: [],
        selectedElection: null,
        electionType: '',
        totalScore: 10,
        rankList: null,
        ranks: {},
        scores: {},
        errorMessage: '',
    }),
    created() {
        this.fetchCandidates();
    },
    methods: {
        //update the election details based on the chosen election to view
        async updateElectionDetails() {
            if (this.selectedElection) {
                const selectedElectionIndex = this.electionData.findIndex(election => election.id === this.selectedElection);
                if (selectedElectionIndex !== -1) {
                    this.electionType = this.electionData[selectedElectionIndex].type;

                    //this.electionType = 'majority';
                    //this.electionType = 'ranked';
                    //this.electionType = 'point-based';
                    //this.electionType = 'single-transferable';

                    const candidateArray = this.electionData[selectedElectionIndex].candidates;
                    this.rankList = Array.from({ length: candidateArray.length }, (_, index) => index + 1);
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
        //open the success card dialog box
        async triggerSuccessCard(name=null) {
            this.successMessage = 'You have successfully voted' 
            if (name !== null) {
                this.successMessage = this.successMessage + 'for ' + name;
            }
            this.$refs.successCardRef.openDialog();
        },
        //check if 2 or more candidates have the same rank preference assigned
        async checkRank() {
            const valueSet = new Set();
            for (const key in this.ranks) {
                const value = this.ranks[key];
                if (valueSet.has(value)) {
                    this.errorMessage = "Candidates cannot have the same ranking";
                    return false;
                } 
                else {
                    valueSet.add(value);
                }
            }
            return true;
        },
        //check if all score points provided have been used
        async checkScore(){
            if (this.totalScore < 0) {
                this.errorMessage = "Too many points used";
                return false;
            }
            else if (this.totalScore > 0) {
                this.errorMessage = "All available points should be used";
                return false;   
            }
            return true;
        },
        //cast the vote
        async vote() {
            try {
                this.errorMessage = '';
                const postData = {
                    electionId: this.selectedElection,
                    type: this.electionType,
                };
                if (this.electionType === 'ranked') {
                    if (await this.checkRank()) {
                        postData.ranks = this.ranks;
                    }
                    else {   
                        return;
                    }
                }
                else if (this.electionType === 'point-based') {
                    if (await this.checkScore()) {
                        postData.scores = this.scores;
                    }
                    else {
                        return;
                    }
                }
                else if (this.electionType === 'single-transferable') {
                    if (await this.checkRank()) {
                        postData.ranks = this.ranks;
                    }
                    else {   
                        return;
                    }
                }
                const authToken = await getToken();
                const response = await axios.post('http://localhost:3000/api/election/vote', postData, {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                });
                if (response.data.error) {
                    alert(response.data.error);
                }
                else {
                    this.triggerSuccessCard();
                }
            }
            catch (error) {
                if (process.env.NODE_ENV === 'test') {
                    console.log(error);
                } 
                else {
                    alert('Error submitting vote:', error);
                }
            }
        },
        //parse the date string into a readable format
        parseDate(dateString) {
            const [year, month, day] = dateString.split('-');
            return new Date(year, month - 1, day);
        },
        //fetch all candidates for the chosen election
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
                    alert('Error: Election has no candidates')
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
        updateRank(candidateId, rank) {
            this.ranks[candidateId] = rank;
        },
        updateScore(candidateId, score) {
            this.scores[candidateId] = score;
            let initialScore = 10;
            for (const key in this.scores) {
                initialScore -= this.scores[key];
            }
            this.totalScore = initialScore;
        },
    }
}
</script>
  
<style scoped>
.card-container {
    margin-top: 3em !important;
}

.voteInfo {
    margin-top: 1em;
    text-align: center;
}

.votebutton {
    text-align: center;
}

.v-btn {
    font-size: 1.2em;
    font-weight: bold;
    margin: auto;
    background-color: var(--primary-color);
    border: 3px solid var(--border);
    padding: 0 2em;
}

.v-btn:hover,
.v-btn:focus {
    cursor: 'pointer';
    font-weight: bolder;
    box-shadow: 0 12px 16px 0 rgba(0,0,0,0.24), 0 17px 50px 0 var(--secondary-color);
    transform: translateY(-0.25em);
}
.v-btn:active {
    cursor: wait;
}

.errorMessage {
    background-color: white;
    outline: 5px solid red;
    padding: 10px;
    font-weight: bold;
    color: red;
    margin-top: 1em;
}
</style>  