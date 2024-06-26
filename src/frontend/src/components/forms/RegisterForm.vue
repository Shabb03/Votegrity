<template>
    <SuccessCard ref="successCardRef" :message="successMessage" :routeName="successRoute"/>
    <div class="form-container">
        <v-form ref="form" @keyup.enter="validate">
            <TextInput :label="nameLabel" :required="true" @update:text="nameValue"/>
            <EmailInput @update:email="emailValue"/>
            <PasswordInput :displayPasswordRules="true" @update:password="passwordValue"/>
            <CitizenshipInput @update:citizenship="citizenshipValue"/>
            <TextInput :label="specialNumberLabel" :required="true" @update:text="specialNumberValue"/>
            <PhoneNumberInput @update:phoneNumber="phoneNumberValue"/>
            <DateInput :label="birthDateLabel" @update:date="dateValue"/>
            <v-row>
                <v-col>
                    <SecurityInput securityNumber="1" @update:securitySelect="sq1Value" @update:securityAnswer="sa1Value"/>
                </v-col>
                <v-col>
                    <SecurityInput securityNumber="2" @update:securitySelect="sq2Value" @update:securityAnswer="sa2Value"/>
                </v-col>
            </v-row>

            <div class="d-flex flex-row">
                <v-btn class="mt-4 primary" @click="validate">
                    Sign Up!
                </v-btn>
                <v-btn class="mt-4 ml-10 secondary" @click="reset">
                    Reset
                </v-btn>
            </div>
        </v-form>
        <router-link class="form-link" to="/login">Login</router-link>
    </div>
</template>

<script>
import axios from 'axios';
import SuccessCard from "../SuccessCard.vue";
import encryptPassword from '../../functions/EncryptPassword.vue';
import TextInput from '../inputs/TextInput.vue';
import EmailInput from '../inputs/EmailInput.vue';
import PasswordInput from '../inputs/PasswordInput.vue';
import CitizenshipInput from '../inputs/CitizenshipInput.vue';
import PhoneNumberInput from '../inputs/PhoneNumberInput.vue';
import DateInput from '../inputs/DateInput.vue';
import SecurityInput from '../inputs/SecurityInput.vue';

export default {
    components: {
        SuccessCard,
        TextInput,
        EmailInput,
        PasswordInput,
        CitizenshipInput,
        PhoneNumberInput,
        DateInput,
        SecurityInput,
    },
    data: () => ({
        successMessage: 'You have successfully registered your account',
        successRoute: '/login',
        nameLabel: 'Full Name',
        specialNumberLabel: 'Special Number',
        birthDateLabel: 'Birth Date: ',
        name: '',
        email: '',
        password: '',
        citizenship: null,
        specialNumber: '',
        phoneNumber: '',
        date: null,
        sq1: '',
        sa1: '',
        sq2: '',
        sa2: '',
    }),
    methods: {
        //open the success card dialog box
        async triggerSuccessCard() {
            this.$refs.successCardRef.openDialog();
        },
        //register the new user with the provided details
        async validate() {
            const { valid } = await this.$refs.form.validate()
            if (valid) {
                const encryptedPassword = await encryptPassword(this.password);
                const postData = {
                    name: this.name,
                    email: this.email,
                    password: encryptedPassword,
                    dateOfBirth: this.date,
                    specialNumber: this.specialNumber,
                    citizenship: this.citizenship,
                    phoneNumber: this.phoneNumber,
                    securityQuestion1: this.sq1,
                    securityAnswer1: this.sa1,
                    securityQuestion2: this.sq2,
                    securityAnswer2: this.sa2,
                };
                try {
                    const response = await axios.post('http://localhost:3000/api/user/register', postData);
                    if (response.data.error) {
                        alert(response.data.error);
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
                        alert('Error during registration:', error);
                    }
                }
            }
        },
        //reset all inputs to empty
        reset() {
            this.$refs.form.reset()
        },
        nameValue(params) {
            this.name = params;
        },
        emailValue(params) {
            this.email = params;
        },
        passwordValue(params) {
            this.password = params;
        },
        citizenshipValue(params) {
            this.citizenship = params;
        },
        specialNumberValue(params) {
            this.specialNumber = params;
        },
        phoneNumberValue(params) {
            this.phoneNumber = params;
        },
        dateValue(params) {
            this.date = params;
        },
        sq1Value(params) {
            this.sq1 = params;
        },
        sa1Value(params) {
            this.sa1 = params;
        },
        sq2Value(params) {
            this.sq2 = params;
        },
        sa2Value(params) {
            this.sa2 = params;
        },
    },
};
</script>

<style scoped>
@import '../../styles/form.css';
</style>