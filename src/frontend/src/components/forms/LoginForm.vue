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
                <v-btn class="mt-4 ml-10" @click="test">
                    Test
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
//import encryptPassword from '../../functions/EncryptPassword.vue';
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
        disableButton() {
            this.buttonClass = 'mt-4 disabled';
            this.isButtonDisabled = true;
            // Start a timer to enable the button after the specified time
            setTimeout(() => {
                this.enableButton();
            }, this.timeRemaining * 1000 * 60);
        },
        enableButton() {
            this.errorMessage = '',
            this.buttonClass = 'mt-4 primary';
            this.isButtonDisabled = false;
        },
        async validate() {
            if (this.isButtonDisabled) {
                return;
            }
            const { valid } = await this.$refs.form.validate()
            if (valid) {
                //const encryptedPassword = await encryptPassword(this.password);
                const postData = {
                    email: this.email,
                    //password: encryptedPassword,
                    password: this.password,
                };
                try {
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
        reset() {
            this.$refs.form.reset()
        },
        test() {
            console.log(this.email);
            console.log(this.password);
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

.errorMessage {
    color: red;
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

.form-link {
    color: blue; 
    margin-top: 2em;
    display: block;
}

.disabled {
    opacity: 0.6;
    cursor: not-allowed;
}
</style>