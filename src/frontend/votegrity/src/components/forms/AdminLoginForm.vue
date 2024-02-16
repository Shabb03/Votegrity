<template>
    <div class="form-container">
        <v-form ref="form">
            <EmailInput @update:email="emailValue"/>
            <PasswordInput @update:password="passwordValue"/>
  
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
import hashPassword from '../../functions/EncryptPassword.vue';
import EmailInput from '../inputs/EmailInput.vue';
import PasswordInput from '../inputs/PasswordInput.vue';
  
export default {
    components: {
        EmailInput,
        PasswordInput,
    },
    data: () => ({
        email: '',
        password: '',
    }),
    mounted() {
        window.addEventListener('keyup', this.handleKeyUp.bind(this));
    },
    methods: {
        async validate() {
            const { valid } = await this.$refs.form.validate()
            if (valid) {
                const hashedPassword = await hashPassword(this.password);
                const postData = {
                    email: this.email,
                    password: hashedPassword,
                };
                try {
                    const response = await axios.post('http://localhost:3000/api/admin/login', postData);
                    if (response.data.error) {
                        alert(response.data.error);
                    }
                    else {
                        const token = response.data.token;
                        localStorage.setItem("votegrityToken",token);
                        console.log(response.data);
                        this.$router.push('/admin/dashboard');
                    }
                } 
                catch (error) {
                    alert('Error during login:', error);
                }
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

.primary:hover {
    cursor: 'pointer';
    box-shadow: 0 12px 16px 0 rgba(0,0,0,0.24), 0 17px 50px 0 rgba(0,0,0,0.19);
}
.primary:active {
    cursor: wait;
}

.secondary {
    background-color: #2616bb;
    color: white;
}

.secondary:hover {
    cursor: 'pointer';
    box-shadow: 0 12px 16px 0 rgba(0,0,0,0.24), 0 17px 50px 0 rgba(0,0,0,0.19);
}
</style>