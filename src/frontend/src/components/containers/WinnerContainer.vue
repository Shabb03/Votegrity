<template>
    <div class="winner-container d-flex justify-space-around align-center" v-for="(candidate, index) in winnerData" :key="index">
        <v-container>
            <v-row>
                <WinnerBox
                    :title="candidate.title"
                    :name="candidate.name"
                    :voice="candidate.voice"
                    :party="candidate.party"
                    :biography="candidate.biography"
                    :votes="candidate.voteCount"
                />
                <ImageBox
                    :image="candidate.image"
                />
            </v-row>
        </v-container>
    </div>
</template>
  
<script>
import axios from 'axios';
import getToken from '../../functions/GetToken.vue';
import ImageBox from '../cards/ImageBox.vue';
import WinnerBox from '../cards/WinnerBox.vue';

export default {
    components: {
        ImageBox,
        WinnerBox,
    },
    data: () => ({
        winnerData: [],
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
                const authToken = await getToken();
                const response = await axios.get('http://localhost:3000/api/election/results', {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                });
                if (response.data.error) {
                    alert(response.data.error);
                }
                else {
                    this.winnerData = response.data.electionResults;
                    for (const index in this.winnerData) {
                        const item = this.winnerData[index];
                        const imageResponse = await axios.get('http://localhost:3000/api/election/image/'+item.id, {
                            headers: {
                                Authorization: `Bearer ${authToken}`,
                            },
                            responseType: 'arraybuffer',
                        });
                        const binaryData = new Uint8Array(imageResponse.data);
                        const dataUrl = this.arrayBufferToBase64(binaryData);
                        item.image = `data:image/jpeg;base64,${dataUrl}`;
                    }
                }
            } 
            catch (error) {
                if (process.env.NODE_ENV === 'test') {
                    console.log(error);
                } 
                else {
                    alert('Error: No winner for election');
                    //window.history.back();
                }
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