<template>
    <div class="form-container">
        <v-form ref="form">

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


            <SecurityAnswerInput @update:securityAnswer1="sa1Value" @update:securityAnswer2="sa2Value"/>
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
  import SecurityAnswerInput from '../inputs/SecurityAnswerInput.vue';
  import PasswordInput from '../inputs/PasswordInput.vue';
  
  export default {
    components: {
      SecurityAnswerInput,
      PasswordInput,
    },
    data: () => ({
        passwordLabel1: "Enter New Password",
        passwordLabel2: "Confirm New Password",
        code: '',
        sa1: '',
        sa2: '',
        password1: '',
        password2: '',
        codeRules: [
            v => !!v || 'code is required',
        ],
    }),
    created() {
      this.getAuthCode();
    },
    methods: {
        async validate() {
            if (this.password1 !== this.password2) {
                alert('Passwords do not match');
                return;
            }
            const { valid } = await this.$refs.form.validate()
            if (valid) {
                const postData = {
                    resetToken: this.code,
                    securityAnswer1: this.sa1,
                    securityAnswer2: this.sa2,
                    password: this.password,
                };
                try {
                    const token = localStorage.getItem("votegrityToken");
                    const response = await axios.post('http://localhost:3000/api/user/changepassword', postData, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    if (response.data.error) {
                      alert(response.data.error);
                    }
                    else {
                      localStorage.setItem("votegrityToken", null);
                      console.log(response.data);
                      this.$router.push('/login');
                    }
                } 
                catch (error) {
                    alert('Error changing password:', error);
                }
            }
        },
        async getAuthCode() {
            try {
                const token = localStorage.getItem("votegrityToken");
                const response = await axios.get('http://localhost:3000/api/user/authenticationcode', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log(response.data);
            } 
            catch (error) {
                alert('Error retrieving code:', error);
            }
        },
        reset() {
            this.$refs.form.reset()
        },
        test() {
            console.log(this.password);
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