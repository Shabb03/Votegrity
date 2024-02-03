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
    /*created() {
        this.fetchWinner();
    },*/
    methods: {
        async fetchWinner() {
            try {
                const authToken = localStorage.getItem("votegrityToken");
                const response = await axios.get('http://localhost:3000/api/election/results', {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                });
                const winnerData = response.data;
                this.name = winnerData.name,
                this.voice = winnerData.voice,
                this.party = winnerData.party,
                this.image = winnerData.image,
                this.biography = winnerData.biography,
                this.voteCount = winnerData.voteCount 
                console.log(response.data);
            } 
            catch (error) {
                await alert('Error retrieving details:', error);
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