<template>
    <SuccessCard ref="successCardRef" :message="successMessage" :routeName="successRoute"/>
    <div class="form-container">
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
            <NumberInput :label="numberLabel" :required="true" @update:number="numberValue"/>
            <NumberInput :label="ageLabel" @update:number="ageValue"/>
            <EmailAuthenticationInput @update:emailDomain="emailDomainValue"/>
            <CitizenshipInput :displayCitizenshipRules="false" @update:citizenship="citizenshipValue"/>

            <div class="d-flex flex-row">
                <v-btn class="mt-4 primary" @click="validate">
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
import SuccessCard from "../SuccessCard.vue";
import TextInput from '../inputs/TextInput.vue';
import DescriptionInput from '../inputs/DescriptionInput.vue';
import DateInput from '../inputs/DateInput.vue';
import NumberInput from '../inputs/NumberInput.vue';
import EmailAuthenticationInput from '../inputs/EmailAuthenticationInput.vue';
import CitizenshipInput from '../inputs/CitizenshipInput.vue';

export default {
    components: {
        SuccessCard,
        TextInput,
        DescriptionInput,
        DateInput,
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
.form-container {
    background-color: white;
    margin-top: 5em !important;
    margin-bottom: 5em !important;
    width: 50%;
    margin: auto;
    padding: 20px;
    border-radius: 25px;
    box-shadow: 0 12px 16px 0 rgba(0,0,0,0.24), 0 17px 50px 0 rgba(0,0,0,0.19);

    @media (max-width: 600px) {
        width: 100%;
    }
}

.primary {
    background-color: #00e5ff;
}

.primary:hover, 
.primary:focus {
    cursor: 'pointer';
    font-weight: bolder;
    box-shadow: 0 12px 16px 0 rgba(0,0,0,0.24), 0 17px 50px 0 #2616bb;
    transform: translateY(-0.25em);
}
.primary:active {
    cursor: wait;
}

.secondary {
    background-color: #2616bb;
    color: white;
}

.secondary:hover, 
.secondary:focus {
    cursor: 'pointer';
    font-weight: bolder;
    box-shadow: 0 12px 16px 0 rgba(0,0,0,0.24), 0 17px 50px 0 #00e5ff;
    transform: translateY(-0.25em);
}
</style>