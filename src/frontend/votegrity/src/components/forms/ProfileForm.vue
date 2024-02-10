<template>
    <div class="form-container">
        <v-form ref="form">
            <v-text-field class="disabled"
                disabled
                v-model="name"
                label="Name: "
            ></v-text-field>
            <v-text-field class="disabled"
                disabled
                v-model="date"
                label="Date of Birth: "
            ></v-text-field>
            <v-text-field class="disabled"
                disabled
                v-model="specialNumber"
                label="Special Number: "
            ></v-text-field>
            <v-text-field class="disabled"
                disabled
                v-model="citizenship"
                label="Citizenship: "
            ></v-text-field>
            <v-row>
                <v-col>
                    <v-text-field class="disabled"
                        disabled
                        v-model="currentEmail"
                        label="Current Email: "
                    ></v-text-field>
                    <v-text-field class="disabled"
                        disabled
                        v-model="currentPhoneNumber"
                        label="Current Phone Number: "
                    ></v-text-field>
                </v-col>
                <v-col>
                    <EmailInput :required=false @update:email="emailValue"/>
                    <PhoneNumberInput :required=false @update:phoneNumber="phoneNumberValue"/>
                </v-col>
            </v-row>

            <div class="d-flex flex-row">
                <v-btn class="mt-4 primary" @click="validate">
                  Submit
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
import EmailInput from '../inputs/EmailInput.vue';
import PhoneNumberInput from '../inputs/PhoneNumberInput.vue';

export default {
    components: {
        EmailInput,
        PhoneNumberInput,
    },
    data: () => ({
        name: '',
        currentEmail: '',
        email: null,
        citizenship: '',
        specialNumber: '',
        currentPhoneNumber: '',
        phoneNumber: null,
        date: null,
    }),
    created() {
        this.fetchUserData();
    },
    methods: {
        async validate() {
            const { valid } = await this.$refs.form.validate()
            if (valid) {
                const postData = {
                    newEmail: this.email,
                    newNumber: this.phoneNumber,
                };
                try {
                    const token = localStorage.getItem("votegrityToken");
                    const response = await axios.post('http://localhost:3000/api/user/userdetails', postData, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    console.log(response.data);
                    window.location.reload();
                } 
                catch (error) {
                    alert('Error changing details:', error);
                }
            }
        },
        async fetchUserData() {
            try {
                const token = localStorage.getItem("votegrityToken");
                const response = await axios.get('http://localhost:3000/api/user/userinfo', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const userData = response.data;
                this.name = userData.name;
                this.date = userData.dateOfBirth;
                this.specialNumber = userData.specialNumber;
                this.citizenship = userData.citizenship;
                this.currentEmail = userData.email;
                this.currentPhoneNumber = userData.phoneNumber;
                console.log(response.data);
            } 
            catch (error) {
                await alert('Error retrieving details:', error);
                window.history.back();
            }
        },
        reset() {
            this.$refs.form.reset()
        },
        test() {
            console.log(this.email);
            console.log(this.phoneNumber);
        },
        emailValue(params) {
            this.email = params;
        },
        phoneNumberValue(params) {
            this.phoneNumber = params;
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

.disabled {
    cursor: not-allowed;
}
</style>