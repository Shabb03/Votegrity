<template>
    <SuccessCard ref="successCardRef" :message="successMessage" :routeName="successRoute"/>
    <div class="form-container">
        <ConfirmationCard ref="confirmationCardRef" @continueValidation="handleContinue" />
        <v-form ref="form">
            <TextInput :label="titleLabel" :required="true" @update:text="titleValue"/>
            <DescriptionInput @update:description="descriptionValue"/>
            <v-row>
                <v-col>
                    <DateInput :label="startDateLabel" @update:date="startDateValue"/>
                </v-col>
                <v-col>
                    <DateInput :label="endDateLabel" @update:date="endDateValue"/>
                </v-col>
                <v-col>
                    <DateInput :label="resultDateLabel" @update:date="resultDateValue"/>
                </v-col>
            </v-row>
            <ProcessInput @update:process="processValue"/>
            <NumberInput :label="numberLabel" :required="true" @update:number="numberValue"/>
            <NumberInput :label="ageLabel" @update:number="ageValue"/>
            <EmailAuthenticationInput @update:emailDomain="emailDomainValue"/>
            <CitizenshipInput :displayCitizenshipRules="false" @update:citizenship="citizenshipValue"/>

            <div class="d-flex flex-row">
                <v-btn class="mt-4 primary" @click="triggerConfirmationCard">
                    Create Election
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
</template>

<script>
import axios from 'axios';
import getToken from '../../functions/GetToken.vue';
import ConfirmationCard from '../ConfirmationCard.vue';
import SuccessCard from "../SuccessCard.vue";
import TextInput from '../inputs/TextInput.vue';
import DescriptionInput from '../inputs/DescriptionInput.vue';
import DateInput from '../inputs/DateInput.vue';
import ProcessInput from '../inputs/ProcessInput.vue';
import NumberInput from '../inputs/NumberInput.vue';
import EmailAuthenticationInput from '../inputs/EmailAuthenticationInput.vue';
import CitizenshipInput from '../inputs/CitizenshipInput.vue';

export default {
    components: {
        ConfirmationCard,
        SuccessCard,
        TextInput,
        DescriptionInput,
        DateInput,
        ProcessInput,
        NumberInput,
        EmailAuthenticationInput,
        CitizenshipInput,
    },
    data: () => ({
        successMessage: 'You have successfully created the election',
        successRoute: '/admin/addcandidate',
        titleLabel: "Election Title",
        startDateLabel: "Election Start Date: ",
        endDateLabel: "Election End Date: ",
        resultDateLabel: "Election Results Date: ",
        numberLabel: "Number of Total Candidates",
        ageLabel: "Minimum Age Requirement (Optional)",
        title: '',
        description: '',
        startDate: null,
        endDate: null,
        resultDate: null,
        type: null,
        number: 0,
        age: 0,
        emailDomain: null,
        citizenship: null,
    }),
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
        async triggerSuccessCard() {
            this.$refs.successCardRef.openDialog();
        },
        async validate() {
            const { valid } = await this.$refs.form.validate()
            if (valid) {
                const postData = {
                    title: this.title,
                    description: this.description,
                    startDate: this.startDate,
                    endDate: this.endDate,
                    resultDate: this.resultDate,
                    candidateNumber: this.number,
                    ageRestriction: this.age,
                    authEmail: this.emailDomain,
                    authCitizenship: this.citizenship,
                    type: this.type,
                };
                try {
                    const token = await getToken();
                    const response = await axios.post('http://localhost:3000/api/admin/addelection', postData, {
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
                        alert('Error creating election:', error);
                    }
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
            console.log(this.title);
            console.log(this.startDate);
            console.log(this.endDate);
            console.log(this.resultDate);
        },
        titleValue(params) {
            this.title = params;
        },
        descriptionValue(params) {
            this.description = params;
        },
        numberValue(params) {
            this.number = params;
        },
        startDateValue(params) {
            this.startDate = params;
        },
        endDateValue(params) {
            this.endDate = params;
        },
        resultDateValue(params) {
            this.resultDate = params;
        },
        processValue(params) {
            this.type = params;
        },
        ageValue(params) {
            this.age = params;
        },
        emailDomainValue(params) {
            this.emailDomain = params;
        },
        citizenshipValue(params) {
            this.citizenship = params;
        },
    },
};
</script>

<style scoped>
@import '../../styles/form.css';
</style>