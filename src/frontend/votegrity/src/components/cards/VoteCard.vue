<template>
    <v-col>
        <v-card max-width="350" min-width="350" elevation="16" style="max-width: 350px !important; width: 100% !important; margin: auto !important;">
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
        async fetchImageData() {
            try {
                console.log(this.candidateId);
                const authToken = localStorage.getItem("votegrityToken");
                const response = await axios.get('http://localhost:3000/api/election/image/'+this.candidateId, {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                    responseType: 'arraybuffer',
                });
                
                const binaryData = new Uint8Array(response.data);
                const dataUrl = this.arrayBufferToBase64(binaryData);
                this.imageSrc = `data:image/jpeg;base64,${dataUrl}`;
                
                console.log(response.data);
            } 
            catch (error) {
                console.log(error);
                alert('Error retrieving images:', error);
            }
        },
        arrayBufferToBase64(buffer) {
            let binary = '';
            const bytes = new Uint8Array(buffer);
            for (let i = 0; i < bytes.byteLength; i++) {
                binary += String.fromCharCode(bytes[i]);
            }
            return btoa(binary);
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
        async vote(candidateId) {
            try {
                const authToken = localStorage.getItem("votegrityToken");
                const postData = {
                    candidateId: candidateId,
                };
                const response = await axios.post('http://localhost:3000/api/election/vote', postData, {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                });
                console.log(response.data);
            } 
            catch (error) {
                alert('Error voting:', error);
            }
        },
    },
}
</script>

<style scoped>
.v-btn {
    font-size: 1em;
    font-weight: bold;
    margin: auto;
    margin-bottom: 0.5em;
    background-color: #00e5ff;
    border: 2px solid #000;
}
</style>