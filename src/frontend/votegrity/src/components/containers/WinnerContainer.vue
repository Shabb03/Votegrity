<template>
    <div class="winner-container d-flex justify-space-around align-center bg-grey-lighten-4">
        <v-container>
            <v-row>
                <WinnerBox
                    :name="name"
                    :voice="voice"
                    :party="party"
                    :biography="biography"
                />
                <ImageBox
                    :image="image"
                />
            </v-row>
        </v-container>
    </div>
</template>
  
<script>
import axios from 'axios';
import ImageBox from '../cards/ImageBox.vue';
import WinnerBox from '../cards/WinnerBox.vue';

export default {
    components: {
        ImageBox,
        WinnerBox,
    },
    data: () => ({
        name: '',
        voice: '',
        party: '',
        image: '',
        biography: '',
        voteCount: 0,
    }),
    created() {
        this.fetchWinner();
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
        async fetchWinner() {
            try {
                const authToken = localStorage.getItem("votegrityToken");
                const response = await axios.get('http://localhost:3000/api/election/results', {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                });
                const winnerData = response.data;
                const candidateId = winnerData.id
                this.name = winnerData.name;
                this.voice = winnerData.voice;
                this.party = winnerData.party;
                //this.image = winnerData.image;
                this.biography = winnerData.biography;
                this.voteCount = winnerData.voteCount;

                const imageResponse = await axios.get('http://localhost:3000/api/election/image/'+candidateId, {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                    responseType: 'arraybuffer',
                });
                const binaryData = new Uint8Array(imageResponse.data);
                const dataUrl = this.arrayBufferToBase64(binaryData);
                this.image = `data:image/jpeg;base64,${dataUrl}`;
                console.log(response.data);
            } 
            catch (error) {
                alert('Error: No winner for election');
                //await alert('Error retrieving details:', error);
                window.history.back();
            }
        }
    }
}
</script>
  
<style scoped>
.winner-container {
    margin-top: 3em !important;
}
</style>  