<template>
    <div class="form-container">
        <ConfirmationCard ref="confirmationCardRef" @continueValidation="handleContinue" />
        <v-form ref="form">
            <v-text-field class="disabled"
                disabled
                v-model="name"
                label="Name: "
            ></v-text-field>
            <v-text-field class="disabled"
                disabled
                v-model="date"
                label="Date of Birth: "
            ></v-text-field>
            <v-text-field class="disabled"
                disabled
                v-model="specialNumber"
                label="Special Number: "
            ></v-text-field>
            <v-text-field class="disabled"
                disabled
                v-model="citizenship"
                label="Citizenship: "
            ></v-text-field>
            <v-row>
                <v-col>
                    <v-text-field class="disabled"
                        disabled
                        v-model="currentEmail"
                        label="Current Email: "
                    ></v-text-field>
                    <v-text-field class="disabled"
                        disabled
                        v-model="currentPhoneNumber"
                        label="Current Phone Number: "
                    ></v-text-field>
                </v-col>
                <v-col>
                    <EmailInput :required=false @update:email="emailValue"/>
                    <PhoneNumberInput :required=false @update:phoneNumber="phoneNumberValue"/>
                </v-col>
            </v-row>

            <div class="d-flex flex-row">
                <v-btn class="mt-4 primary" @click="triggerConfirmationCard">
                  Submit
                </v-btn>
                <v-btn class="mt-4 ml-10" @click="test">
                  Test
                </v-btn>
            </div>
        </v-form>
    </div>
    <DeleteButton/>
</template>

<script>
import axios from 'axios';
import getToken from '../../functions/GetToken.vue';
import setToken from '../../functions/SetToken.vue';
import ConfirmationCard from '../ConfirmationCard.vue';
import EmailInput from '../inputs/EmailInput.vue';
import PhoneNumberInput from '../inputs/PhoneNumberInput.vue';
import DeleteButton from '../buttons/DeleteButton.vue';

export default {
    components: {
        ConfirmationCard,
        EmailInput,
        PhoneNumberInput,
        DeleteButton,
    },
    data: () => ({
        name: '',
        currentEmail: '',
        email: null,
        citizenship: '',
        specialNumber: '',
        currentPhoneNumber: '',
        phoneNumber: null,
        date: null,
    }),
    created() {
        this.fetchUserData();
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
        async validate() {
            const { valid } = await this.$refs.form.validate()
            if (valid) {
                const postData = {
                    newEmail: this.email,
                    newNumber: this.phoneNumber,
                };
                try {
                    const token = await getToken();
                    const response = await axios.post('http://localhost:3000/api/user/userdetails', postData, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    const profileData = response.data;
                    if (profileData.error) {
                        alert("error: ", profileData.error);
                    }
                    else if (profileData.token) {
                        setToken(profileData.token);
                    }
                    window.location.reload();
                } 
                catch (error) {
                    if (process.env.NODE_ENV === 'test') {
                        console.log(error);
                    } 
                    else {
                        alert('Error changing details:', error);
                    }
                }
            }
        },
        async fetchUserData() {
            try {
                const token = await getToken();
                const response = await axios.get('http://localhost:3000/api/user/userinfo', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const userData = response.data;
                this.name = userData.name;
                this.date = userData.dateOfBirth;
                this.specialNumber = userData.specialNumber;
                this.citizenship = userData.citizenship;
                this.currentEmail = userData.email;
                this.currentPhoneNumber = userData.phoneNumber;
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
            console.log(this.phoneNumber);
        },
        emailValue(params) {
            this.email = params;
        },
        phoneNumberValue(params) {
            this.phoneNumber = params;
        },
    },
};
</script>

<style scoped>
@import '../../styles/form.css';
</style>