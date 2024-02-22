<template>
    <SuccessCard ref="successCardRef" :message="successMessage" :routeName="successRoute"/>
    <div class="form-container">
        <v-form ref="form">
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
                    <PasswordInput :label="passwordLabel1" @update:password="password1Value"/>
                </v-col>
                <v-col>
                    <PasswordInput :label="passwordLabel2" @update:password="password2Value"/>
                </v-col>
            </v-row>
  
            <div class="d-flex flex-row">
                <v-btn class="mt-4 primary" @click="validate">
                    Submit
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
import SuccessCard from "../SuccessCard.vue";
import encryptPassword from '../../functions/EncryptPassword.vue';
import EmailInput from '../inputs/EmailInput.vue';
import SecurityAnswerInput from '../inputs/SecurityAnswerInput.vue';
import PasswordInput from '../inputs/PasswordInput.vue';
  
export default {
    components: {
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
    mounted() {
        window.addEventListener('keyup', this.handleKeyUp.bind(this));
    },
    methods: {
        async triggerSuccessCard() {
            this.$refs.successCardRef.openDialog();
        },
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
                console.log(postData);
                try {
                    const response = await axios.post('http://localhost:3000/api/user/changepassword', postData);
                    const passwordData = response.data;
                    //console.log(passwordData);
                    if (passwordData.error) {
                       alert(passwordData.error);
                    }
                    else {
                        await this.triggerSuccessCard();
                        //this.$router.push('/login');
                    }
                } 
                catch (error) {
                    console.log(error);
                    alert('Error changing password:', error);
                }
            }
        },
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
                console.log(response.data);
            } 
            catch (error) {
                alert('Error retrieving code:', error);
            }
        },
        handleKeyUp(event) {
            if (event.keyCode === 13) { 
                this.validate();
            }
        },
        reset() {
            this.$refs.form.reset()
        },
        test() {
            console.log(this.password);
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