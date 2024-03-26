<template>
    <SuccessCard ref="successCardRef" :message="successMessage" :routeName="successRoute"/>
    <div class="code-container">
    <v-card
        class="py-8 px-6 text-center mx-auto mb-4"
        elevation="12"
        max-width="400"
        width="100%"
    >
        <h3 class="text-h6 mb-4">{{ title }}</h3>
        <div class="text-body-2">Please check your email and enter the code below.</div>
    
        <v-sheet color="surface">
            <v-otp-input :rules="codeRules" v-model="code" type="password" variant="solo"></v-otp-input>
        </v-sheet>

        <v-btn
            class="my-4 primary"
            height="40"
            variant="tonal"
            width="100%"
            @click="postAuthCode"
        >{{ button }}
        </v-btn>

        <div>{{ code }}</div>

        <div class="text-caption">
            Didn't receive the code? <a href="#" @click="getAuthCode">Resend</a>
        </div>
        </v-card>
    </div>
</template>
  
<script>
import axios from 'axios';
import getToken from '../../functions/GetToken.vue';
import setToken from '../../functions/SetToken.vue';
import SuccessCard from "../SuccessCard.vue";

export default {
    components: {
        SuccessCard,
    },
    props: {
        title: {
            type: String,
            required: true,
        },
        button: {
            type: String,
            required: true,
        },
        getApiUrl: {
            type: String,
            required: true,
        },
        postApiUrl: {
            type: String,
            required: true,
        },
        routeUrl: {
            type: String,
            required: true,
        },
        successCardMessage: {
            type: String,
            required: true,
        },
        resetToken: {
            type: Boolean,
            default: false,
        }
    },
    data: () => ({
        successMessage: 'Successful!',
        successRoute: '/',
        code: '',
        codeRules: [
            v => !!v || 'code is required',
        ],
    }),
    created() {
        this.successMessage = this.successCardMessage;
        this.successRoute = this.routeUrl;
        this.getAuthCode();
    },
    methods: {
        async triggerSuccessCard() {
            this.$refs.successCardRef.openDialog();
        },
        async getAuthCode() {
            try {
                const url = 'http://localhost:3000/api' + this.getApiUrl;
                const token = await getToken();
                const response = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.data.error) {
                    alert("error: ", response.data.error);
                }
                else {
                    if (response.data.authenticated) {
                        this.$router.push('/vote');
                    }
                    if (response.data.reset) {
                        this.$router.push('/admin/createelection');
                    }
                }
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
        async postAuthCode() {
            try {
                const postData = {
                    token: this.code,
                };
                const url = 'http://localhost:3000/api' + this.postApiUrl;
                const token = await getToken();
                const response = await axios.post(url, postData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.data.invalid) {
                    alert('Invalid Code');
                }
                else if (response.data.error) {
                    alert('Error: ', response.data.error);
                }
                else {
                    this.successRoute = this.routeUrl;
                    if (this.resetToken) {
                        await setToken(null);
                    }
                    await this.triggerSuccessCard();
                }  
            } 
            catch (error) {
                if (process.env.NODE_ENV === 'test') {
                    console.log(error);
                } 
                else {
                    alert('Error submitting authentication code:', error);
                }
            }
        },
    },
};
</script>

<style scoped>
@import '../../styles/colours.css';

.code-container {
    margin-top: 5em !important;
}

.v-btn {
    background-color: var(--primary-color);
}

.v-btn:hover, 
.v-btn:focus {
    cursor: 'pointer';
    font-weight: bolder;
    box-shadow: 0 12px 16px 0 rgba(0,0,0,0.24), 0 17px 50px 0 var(--secondary-color);
    transform: translateY(-0.25em);
}
.v-btn:active {
    cursor: wait;
}
</style>