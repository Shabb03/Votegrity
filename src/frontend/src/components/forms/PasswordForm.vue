<template>
    <SuccessCard ref="successCardRef" :message="successMessage" :routeName="successRoute"/>
    <div class="form-container">
        <ConfirmationCard ref="confirmationCardRef" @continueValidation="handleContinue" />
        <v-form ref="form" @keyup.enter="validate">
            <v-card
                class="py-8 px-6 text-center mx-auto mb-4"
                elevation="12"
                max-width="400"
                width="100%"
            >
                <EmailInput @update:email="emailValue"/>
                <v-btn class="my-4 primary" height="40" variant="tonal" width="70%" @click="getAuthCode">Send Code</v-btn>
            </v-card>
            <v-card
                class="py-8 px-6 text-center mx-auto mb-4"
                elevation="12"
                max-width="400"
                width="100%"
            >
                <div class="text-body-2">Please check your email and enter the code below.</div>
                <v-sheet color="surface">
                    <v-otp-input :rules="codeRules" v-model="code" type="password" variant="solo"></v-otp-input>
                </v-sheet>
                <div class="text-caption">
                    Didn't receive the code? <a href="#" @click="getAuthCode">Resend</a>
                </div>
            </v-card>


            <SecurityAnswerInput :label1 = "securityLabel1" :label2="securityLabel2" @update:securityAnswer1="sa1Value" @update:securityAnswer2="sa2Value"/>
            <v-row>
                <v-col>
                    <PasswordInput :label="passwordLabel1" :displayPasswordRules="true" @update:password="password1Value"/>
                </v-col>
                <v-col>
                    <PasswordInput :label="passwordLabel2" @update:password="password2Value"/>
                </v-col>
            </v-row>
  
            <div class="d-flex flex-row">
                <v-btn class="mt-4 primary" @click="triggerConfirmationCard">
                    Submit
                </v-btn>
                <v-btn class="mt-4 ml-10 secondary" @click="reset">
                    Reset
                </v-btn>
            </div>
        </v-form>
    </div>
</template>
  
<script>
import axios from 'axios';
import ConfirmationCard from '../ConfirmationCard.vue';
import SuccessCard from "../SuccessCard.vue";
import encryptPassword from '../../functions/EncryptPassword.vue';
import EmailInput from '../inputs/EmailInput.vue';
import SecurityAnswerInput from '../inputs/SecurityAnswerInput.vue';
import PasswordInput from '../inputs/PasswordInput.vue';
  
export default {
    components: {
        ConfirmationCard,
        SuccessCard,
        EmailInput,
        SecurityAnswerInput,
        PasswordInput,
    },
    data: () => ({
        successMessage: 'You have successfully changed your password',
        successRoute: '/login',
        securityLabel1: "Security Question 1",
        securityLabel2: "Security Question 2",
        passwordLabel1: "Enter New Password",
        passwordLabel2: "Confirm New Password",
        email: '',
        code: '',
        sa1: '',
        sa2: '',
        password1: '',
        password2: '',
        codeRules: [
            v => !!v || 'code is required',
        ],
    }),
    methods: {
        //open the confirmation card dialog box and continue if user clicks continue
        async triggerConfirmationCard() {
            const { valid } = await this.$refs.form.validate()
            if (valid) {
                this.$refs.confirmationCardRef.openDialog();
            }
        },
        //open the success card dialog box
        async triggerSuccessCard() {
            this.$refs.successCardRef.openDialog();
        },
        //submit the user's new password to change their password along with their provided reset token
        async validate() {
            if (this.password1 !== this.password2) {
                alert('Passwords do not match');
                return;
            }
            const { valid } = await this.$refs.form.validate()
            if (valid) {
                const encryptedPassword = await encryptPassword(this.password1);
                const postData = {
                    email: this.email,
                    resetToken: this.code,
                    securityAnswer1: this.sa1,
                    securityAnswer2: this.sa2,
                    password: encryptedPassword,
                };
                try {
                    const response = await axios.post('http://localhost:3000/api/user/changepassword', postData);
                    const passwordData = response.data;
                    if (passwordData.error) {
                       alert(passwordData.error);
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
                        alert('Error changing password:', error);
                    }
                }
            }
        },
        //send the user a reset token via email to change their passwords
        async getAuthCode() {
            try {
                const postData = {
                    email: this.email,
                };
                const response = await axios.post('http://localhost:3000/api/user/authenticationcode', postData);
                const userData = response.data;
                if (userData.error) {
                    alert(userData.error);
                }
                this.securityLabel1 = userData.securityQuestion1;
                this.securityLabel2 = userData.securityQuestion2;
            } 
            catch (error) {
                if (process.env.NODE_ENV === 'test') {
                    console.log(error);
                } 
                else {
                    alert('Error retrieving code:', error);
                }
            }
        },
        //continue to next step
        async handleContinue() {
            this.validate();
        },
        //reset all inputs to empty
        reset() {
            this.$refs.form.reset()
        },
        emailValue(params) {
            this.email = params;
        },
        codeValue(params) {
            this.code = params;
        },
        sa1Value(params) {
            this.sa1 = params;
        },
        sa2Value(params) {
            this.sa2 = params;
        }, 
        password1Value(params) {
            this.password1 = params;
        },
        password2Value(params) {
            this.password2 = params;
        },
    },
};
</script>
  
<style scoped>
@import '../../styles/form.css';
</style>