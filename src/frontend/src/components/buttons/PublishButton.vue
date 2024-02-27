<template>
    <div class="publishbutton">
        <v-btn variant="tonal" size="large" rounded="lg" elevation="8" @click="goToPublish">Publish&nbsp;&nbsp;&nbsp;Election</v-btn>
    </div>
</template>

<script>
export default {
    name: 'PublishButton',
    methods: {
        goToPublish() {
            this.$router.push('/admin/publishresults');
        },
    },
};
</script>

<style scoped>
.publishbutton {
    margin-right: 3em !important;
    margin-bottom: 3em !important;
    text-align: right;
}
.v-btn {
    text-align: center;
    font-size: 1.2em;
    font-weight: bold;
    background-color: #fff;
    border: 3px solid #000;
}

.v-btn:hover, 
.v-btn:focus {
    cursor: 'pointer';
    font-weight: bolder;
    box-shadow: 0 12px 16px 0 rgba(0,0,0,0.24), 0 17px 50px 0 #2616bb;
    transform: translateY(-0.25em);
}
</style>