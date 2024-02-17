<template>
    <div class="form-container">
        <v-form ref="form">
            <TextInput :label="nameLabel" :required="true" @update:text="nameValue"/>
            <EmailInput @update:email="emailValue"/>
            <PasswordInput @update:password="passwordValue"/>
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
                <v-btn class="mt-4 ml-10" @click="test">
                    Test
                </v-btn>
            </div>
        </v-form>
        <router-link class="form-link" to="/login">Login</router-link>
    </div>
</template>

<script>
import axios from 'axios';
import hashPassword from '../../functions/EncryptPassword.vue';
import TextInput from '../inputs/TextInput.vue';
import EmailInput from '../inputs/EmailInput.vue';
import PasswordInput from '../inputs/PasswordInput.vue';
import CitizenshipInput from '../inputs/CitizenshipInput.vue';
import PhoneNumberInput from '../inputs/PhoneNumberInput.vue';
import DateInput from '../inputs/DateInput.vue';
import SecurityInput from '../inputs/SecurityInput.vue';

export default {
    components: {
        TextInput,
        EmailInput,
        PasswordInput,
        CitizenshipInput,
        PhoneNumberInput,
        DateInput,
        SecurityInput,
    },
    data: () => ({
        nameLabel: 'Full Name',
        specialNumberLabel: 'Special Number',
        birthDateLabel: 'Birth Date: ',
        name: '',
        email: '',
        password: '',
        citizenship: '',
        specialNumber: '',
        phoneNumber: '',
        date: null,
        sq1: '',
        sa1: '',
        sq2: '',
        sa2: '',
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
                    name: this.name,
                    email: this.email,
                    password: hashedPassword,
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
                    console.log(response.data);
                    if (response.data.error) {
                        alert(response.data.error);
                    }
                    else {
                        this.$router.push('/login');
                    }
                } 
                catch (error) {
                    alert('Error during registration:', error);
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
            console.log(this.name);
            console.log(this.email);
            console.log(this.password);
            console.log(this.citizenship);
            console.log(this.specialNumber);
            console.log(this.phoneNumber);
            console.log(this.date);
            console.log(this.sq1);
            console.log(this.sa1);
            console.log(this.sq2);
            console.log(this.sa2);
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

.form-link {
    color: blue; 
    margin-top: 2em;
    display: block;
}
</style>