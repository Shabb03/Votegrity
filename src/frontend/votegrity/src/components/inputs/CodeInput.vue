<template>
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
            width="70%"
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

export default {
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
        }
    },
    data: () => ({
        code: '',
        codeRules: [
            v => !!v || 'code is required',
        ],
    }),
    created() {
        this.getAuthCode();
    },
    methods: {
        async getAuthCode() {
            try {
                const url = 'http://localhost:3000/api' + this.getApiUrl;
                const token = localStorage.getItem("votegrityToken");
                const response = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.data.authenticated) {
                    this.$router.push('/vote');
                }
                if (response.data.reset) {
                    this.$router.push('/admin/createelection');
                }
                console.log(response.data);
            } 
            catch (error) {
                await alert('Error retrieving code:', error);
                window.history.back();
            }
        },
        async postAuthCode() {
            try {
                const postData = {
                    authToken: this.code,
                };
                const url = 'http://localhost:3000/api' + this.postApiUrl;
                const token = localStorage.getItem("votegrityToken");
                const response = await axios.post(url, postData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log(response.data);
                if (response.data.invalid) {
                    alert('Invalid Code');
                }
                else {
                    this.$router.push(this.routeUrl);
                }  
            } 
            catch (error) {
                alert('Error submitting authentication code:', error);
            }
        },
    },
};
</script>

<style scoped>
.code-container {
    margin-top: 5em !important;
}

.primary {
    background-color: #00e5ff;
}

.v-btn:hover {
    cursor: 'pointer';
    color: #00e5ff;
    background-color: black;
    box-shadow: 0 12px 16px 0 rgba(0,0,0,0.24), 0 17px 50px 0 rgba(0,0,0,0.19);
}
.v-btn:active {
    cursor: wait;
}
</style>