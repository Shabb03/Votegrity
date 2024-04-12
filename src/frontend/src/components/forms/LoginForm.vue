<template>
    <div class="form-container">
        <v-form ref="form">
            <EmailInput @update:email="emailValue"/>
            <PasswordInput @update:password="passwordValue"/>
            <div class="errorMessage">{{ errorMessage }}</div>

            <div class="d-flex flex-row">
                <v-btn :class="buttonClass" :disabled="isButtonDisabled" @click="validate">
                    Login
                </v-btn>
                <v-btn class="mt-4 ml-10 secondary" @click="reset">
                    Reset
                </v-btn>
            </div>
        </v-form>
        <v-row>
            <v-col>
                <router-link class="form-link" to="/register">Sign Up</router-link>
            </v-col>
            <v-col>
                <router-link class="form-link" to="/changepassword">Forgot Password?</router-link>
            </v-col>
        </v-row>
    </div>
</template>

<script>
import axios from 'axios';
import setToken from '../../functions/SetToken.vue';
import encryptPassword from '../../functions/EncryptPassword.vue';
import EmailInput from '../inputs/EmailInput.vue';
import PasswordInput from '../inputs/PasswordInput.vue';

export default {
    components: {
        EmailInput,
        PasswordInput,
    },
    data: () => ({
        buttonClass: 'mt-4 primary',
        successRoute: '/vote',
        email: '',
        password: '',
        errorMessage: '',
        isButtonDisabled: false,
        timeRemaining: 0,
    }),
    /*
    mounted() {
        window.addEventListener('keyup', this.handleKeyUp.bind(this));
    },
    */
    methods: {
        //disable the login button
        disableButton() {
            this.buttonClass = 'mt-4 disabled';
            this.isButtonDisabled = true;
            setTimeout(() => {
                this.enableButton();
            }, this.timeRemaining * 1000 * 60);
        },
        //enable the login button
        enableButton() {
            this.errorMessage = '',
            this.buttonClass = 'mt-4 primary';
            this.isButtonDisabled = false;
        },
        //submit the user's credentials and store the authentication token if correct
        async validate() {
            if (this.isButtonDisabled) {
                return;
            }
            const { valid } = await this.$refs.form.validate()
            if (valid) {
                try {
                    const encryptedPassword = await encryptPassword(this.password);
                    const postData = {
                        email: this.email,
                        password: encryptedPassword,
                        //password: this.password,
                    };
                    const response = await axios.post('http://localhost:3000/api/user/login', postData);
                    const loginData = response.data;
                    if (loginData.error) {
                        if (loginData.time) {
                            this.timeRemaining = loginData.time;
                            this.disableButton();
                        }
                        this.errorMessage = loginData.error;
                    }
                    else {
                        const token = loginData.token;
                        await setToken(token);
                        if (loginData.admin) {
                            this.successRoute = '/admin/dashboard';
                        }
                        else if (!loginData.authenticated) {
                            this.successRoute = '/authentication';
                        }
                        this.$router.push(this.successRoute);
                    }
                } 
                catch (error) {
                    if (process.env.NODE_ENV === 'test') {
                        console.log(error);
                    } 
                    else {
                        alert('Error during login:', error);
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
        //reset all inputs to empty
        reset() {
            this.$refs.form.reset()
        },
        emailValue(params) {
            this.email = params;
        },
        passwordValue(params) {
            this.password = params;
        },
    },
};
</script>

<style scoped>
@import '../../styles/form.css';
</style>