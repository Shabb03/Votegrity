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
        //used to convert images into a displayable format
        arrayBufferToBase64(buffer) {
            let binary = '';
            const bytes = new Uint8Array(buffer);
            for (let i = 0; i < bytes.byteLength; i++) {
                binary += String.fromCharCode(bytes[i]);
            }
            return btoa(binary);
        },
        //get the image of the candidate
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
        //calculate the age of the candidate given the date of birth
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
    },
}
</script>

<style scoped>
.v-card {
    max-width: 350px !important; 
    width: 100% !important; 
    margin: auto !important;
}
</style>