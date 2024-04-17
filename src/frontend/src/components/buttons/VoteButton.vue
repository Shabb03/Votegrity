<template>
    <v-col>
        <div class="votebutton">
            <v-btn @click="vote(candidateId)">Vote</v-btn>
        </div>
    </v-col>
</template>

<script>
import axios from 'axios';
import getToken from '../../functions/GetToken.vue';

export default {
    props: {
        electionId: Number,
        electionType: String,
        candidateId: Number,
        name: String,
    },
    methods: {
        //open the success card dialog box
        async callSuccess() {
            this.$emit('callSuccessCard', this.name);
        },
        //cast a vote for the chosen candidate
        async vote(candidateId) {
            try {
                const authToken = await getToken();
                const postData = {
                    candidateId: candidateId,
                    electionId: this.electionId,
                    type: this.electionType,
                };
                const response = await axios.post('http://localhost:3000/api/election/vote', postData, {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                });
                if (response.data.error) {
                    alert(response.data.error);
                }
                else {
                    this.callSuccess();
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
    },
}
</script>

<style scoped>
@import '../../styles/colours.css';

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
</style>