<template>
    <v-col>
        <v-card max-width="350" elevation="16">
            <v-img
                class="align-end text-white"
                height="200"
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
    props: {
        candidateId: Number,
        imageSrc: String,
        name: String,
        dateOfBirth: Date,
        voice: String,
        party: String,
        biography: String,
    },
    methods: {
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
            } catch (error) {
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
  background-color: #fff;
  border: 2px solid #000;
}
</style>