<template>
    <div class="form-container">
        <v-form ref="form">
            <TextInput :label="titleLabel" :required="true" @update:title="titleValue"/>
            <DescriptionInput @update:description="descriptionValue"/>
            <DateInput :label="startDateLabel" @update:="startDateValue"/>
            <DateInput :label="endDateLabel" @update:="endDateValue"/>
            <DateInput :label="resultDateLabel" @update:="resultDateValue"/>
            <NumberInput :label="numberLabel" :required="true" @update:number="numberValue"/>
            <NumberInput :label="ageLabel" @update:age="ageValue"/>
            <EmailAuthenticationInput @update:emailDomain="emailDomainValue"/>
            <!--Add CitizenAuthenticationInput-->

            <div class="d-flex flex-row">
                <v-btn class="mt-4 primary" @click="validate">
                    Login
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
import TextInput from '../inputs/TextInput.vue';
import DescriptionInput from '../inputs/DescriptionInput.vue';
import DateInput from '../inputs/DateInput.vue';
import NumberInput from '../inputs/NumberInput.vue';
import EmailAuthenticationInput from '../inputs/EmailAuthenticationInput.vue';

export default {
    components: {
        TextInput,
        DescriptionInput,
        DateInput,
        NumberInput,
        EmailAuthenticationInput,
    },
    data: () => ({
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
    }),
    methods: {
        async validate() {
            const { valid } = await this.$refs.form.validate()
            if (valid) {
                const postData = {
                    title: this.title,
                    description: this.description,
                    candidateNumber: this.number,
                    //update this
                };
                try {
                    const token = localStorage.getItem("votegrityToken");
                    const response = await axios.post('http://localhost:3000/api/admin/addelection', postData, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    if (response.data.error) {
                        alert(response.data.error);
                    }
                    else {
                        console.log(response.data);
                        //this.$router.push('/addcandidate');
                    }
                } 
                catch (error) {
                    alert('Error creating election:', error);
                }
            }
        },
        reset() {
            this.$refs.form.reset()
        },
        test() {
            console.log(this.title);
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
    },
};
</script>

<style scoped>
.form-container {
    margin-top: 5em !important;
    width: 50%;
    margin: auto;
    padding: 20px;

    @media (max-width: 600px) {
        width: 100%;
    }
}

.primary {
    background-color: #00e5ff;
}

.secondary {
    background-color: #2616bb;
    color: white;
}
</style>