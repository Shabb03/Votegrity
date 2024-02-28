<template>
    <v-dialog v-model="isActive" persistent transition="dialog-top-transition" width="auto">
        <template v-slot:default>
            <v-card>
                <v-toolbar></v-toolbar>
                <v-card-text class="text-center">
                    <div class="text-h2 pa-8">{{ title }}</div>
                    <div class="pa-4">{{ message }}</div>
                </v-card-text>
                <v-card-actions class="justify-center">
                    <v-btn variant="text" @click="goBack">Return</v-btn>
                    <v-btn variant="text" @click="goContinue">Continue</v-btn>
                </v-card-actions>
            </v-card>
        </template>
    </v-dialog>
</template>

<script>
export default {
    data: () => ({
        isActive: false
    }),
    props: {
        title: {
            type: String,
            default: 'Confirmation',
        },
        message: {
            type: String,
            default: 'Are you sure you wish to continue?'
        },
    },
    methods: {
        openDialog() {
            this.isActive = true;
        },
        goBack() {
            this.isActive = false;
        },
        goContinue() {
            this.isActive = false;
            this.$emit('continueValidation');
        },
    }
}
</script>

<style scoped>
.v-toolbar {
    color: white;
    background-color: black;
}

.text-center {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
}

.v-card-actions {
    font-size: 1.2em;
    font-weight: bold;
    background-color: #2616bb;
}

.v-card-actions .v-btn {
    border: 2px solid black;
    margin: 0 2em;
    background-color: #00e5ff;
}

.v-btn:hover, 
.v-btn:focus {
    cursor: 'pointer';
    font-weight: bolder;
    box-shadow: 0 12px 16px 0 rgba(0,0,0,0.24), 0 17px 50px 0 black;
    transform: translateY(-0.25em);
}
</style>