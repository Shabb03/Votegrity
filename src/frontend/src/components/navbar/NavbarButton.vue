<template>
    <v-btn variant="tonal" @click="goToRoute">{{ buttonText }}</v-btn>
</template>

<script>
export default {
    name: 'NavbarButton',
    props: {
        buttonText: String,
        routeName: String,
    },
    methods: {
        goToRoute() {
            this.$router.push(this.routeName);
        },
    },
};
</script>

<style scoped>
.v-btn {
    font-size: 1.2em;
    font-weight: bold;
    margin-right: 1.5em;
    background-color: #00e5ff;
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