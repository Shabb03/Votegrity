<template>
    <v-col>
        <v-card max-width="350" min-width="350" elevation="16">
            <v-img
                class="align-end text-white"
                height="350"
                :src="imageSrc || 'https://cdn.vuetifyjs.com/images/cards/docks.jpg'"
                cover
            >
            <v-card-title>{{ name }}, {{ calculateAge(dateOfBirth) }}</v-card-title>
            </v-img>
            <v-card-text>
                <div>{{ voice }}</div>
                <div>{{ party }}</div>
                <div>{{ biography }}</div>
            </v-card-text>

            <v-card-actions>
                <v-btn @click="vote(candidateId)">Vote</v-btn>
            </v-card-actions>
        </v-card>
    </v-col>
</template>

<script>
import axios from 'axios';
import getToken from '../../functions/GetToken.vue';

export default {
    data: () => ({
        imageSrc: 'https://cdn.vuetifyjs.com/images/cards/docks.jpg',
    }),
    props: {
        candidateId: Number,
        name: String,
        dateOfBirth: Date,
        voice: String,
        party: String,
        biography: String,
    },
    created() {
        this.fetchImageData();
    },
    methods: {
        arrayBufferToBase64(buffer) {
            let binary = '';
            const bytes = new Uint8Array(buffer);
            for (let i = 0; i < bytes.byteLength; i++) {
                binary += String.fromCharCode(bytes[i]);
            }
            return btoa(binary);
        },
        async fetchImageData() {
            try {
                const authToken = await getToken();
                const response = await axios.get('http://localhost:3000/api/election/image/'+this.candidateId, {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                    responseType: 'arraybuffer',
                });
                const binaryData = new Uint8Array(response.data);
                const dataUrl = this.arrayBufferToBase64(binaryData);
                this.imageSrc = `data:image/jpeg;base64,${dataUrl}`;
                //console.log(response.data);
            } 
            catch (error) {
                if (process.env.NODE_ENV === 'test') {
                    console.log(error);
                } 
                else {
                    alert('Error retrieving images:', error);
                }
            }
        },
        calculateAge(dateOfBirth) {
            const today = new Date();
            const birthDate = new Date(dateOfBirth);
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            return age;
        },
        async callSuccess() {
            this.$emit('callSuccessCard');
        },
        async vote(candidateId) {
            try {
                const authToken = getToken();
                const postData = {
                    candidateId: candidateId,
                };
                const response = await axios.post('http://localhost:3000/api/election/vote', postData, {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                });
                if (response.data.error) {
                    alert(response.data.error);
                }
                else {
                    this.callSuccess();
                    console.log(response.data);
                }
            } 
            catch (error) {
                if (process.env.NODE_ENV === 'test') {
                    console.log(error);
                } 
                else {
                    alert('Error voting:', error);
                }
            }
        },
    },
}
</script>

<style scoped>
.v-card {
    max-width: 350px !important; 
    width: 100% !important; 
    margin: auto !important;
}
.v-btn {
    font-size: 1em;
    font-weight: bold;
    margin: auto;
    margin-bottom: 0.5em;
    background-color: #00e5ff;
    border: 2px solid #000;
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