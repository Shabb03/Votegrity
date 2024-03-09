<template>
    <SuccessCard ref="successCardRef" :message="successMessage" :routeName="successRoute"/>
    <div v-if="electionData && electionData.length > 0" class="form-container">
        <ConfirmationCard ref="confirmationCardRef" @continueValidation="handleContinue" />
        <v-form ref="form">
            <ElectionChoice :electionData="electionData" @update:election="electionValue"/>
            <v-text-field class="disabled"
                disabled
                v-model="resultDate"
                label="Result Date"
            ></v-text-field>
            <TextInput :label="titleLabel" :required="true" @update:text="keyValue"/>

            <div class="d-flex flex-row">
                <v-btn class="mt-4 primary" @click="triggerConfirmationCard">
                    Publish Results
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
import SuccessCard from "../SuccessCard.vue";
import ElectionChoice from '../inputs/ElectionChoice.vue';
import TextInput from '../inputs/TextInput.vue';
import PageSubTitle from '../titles/PageSubTitle.vue';

export default {
    components: {
        ConfirmationCard,
        SuccessCard,
        ElectionChoice,
        TextInput,
        PageSubTitle,
    },
    data: () => ({
        successMessage: 'You have successfully published election results',
        successRoute: '/admin/dashboard',
        titleLabel: "Private Key",
        key: '',
        resultDate: null,
        electionData: [],
        selectedElection: null,
        pageSubTitle: 'No Active Elections currently',
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
        async readableDate(resultDate) {
            const date = new Date(resultDate);
            const day = date.getDate().toString().padStart(2, '0');
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const year = date.getFullYear();
            const formattedDate = `${day}/${month}/${year}`;
            return formattedDate;
        },
        async updateResultDate() {
            if (this.selectedElection) {
                const selectedElectionIndex = this.electionData.findIndex(election => election.id === this.selectedElection);
                if (selectedElectionIndex !== -1) {
                    const resultDate = this.electionData[selectedElectionIndex].resultDate;
                    this.resultDate = await this.readableDate(resultDate);
                } 
                else {
                    alert('Selected election not found in electionData');
                }
            }
        },
        async triggerSuccessCard() {
            this.$refs.successCardRef.openDialog();
        },
        async validate() {
            const { valid } = await this.$refs.form.validate()
            if (valid) {
                const postData = {
                    electionId: this.selectedElection,
                    privateKey: this.key,
                };
                try {
                    const token = await getToken();
                    const response = await axios.post('http://localhost:3000/api/admin/publishresults', postData, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    const electionData = response.data;
                    if (electionData.error) {
                        alert(electionData.error);
                    }
                    else {
                        await this.triggerSuccessCard();
                    }
                } 
                catch (error) {
                    if (process.env.NODE_ENV === 'test') {
                        console.log(error);
                    } 
                    else {
                        alert('Error publishing results:', error);
                    }
                }
            }
        },
        async getElections() {
            try {
                const authToken = await getToken();
                const response = await axios.get('http://localhost:3000/api/admin/activeelections', {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                });
                this.electionData = response.data.activeElections;
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
            console.log(this.email);
            console.log(this.password);
        },
        keyValue(params) {
            this.key = params;
        },
        async electionValue(params) {
            this.selectedElection = params;
            await this.updateResultDate();
        },
    },
};
</script>

<style scoped>
@import '../../styles/form.css';
</style>