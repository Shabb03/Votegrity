<template>
    <v-autocomplete
        v-model="selectedElection"
        label="Select Election"
        :items="electionData"
        item-text="title"
        item-value="id"
        :rules="electionRules"
        @update:modelValue="updateElection"
    ></v-autocomplete>
</template>

<script>
export default {
    props: {
        electionData: Array,
    },
    data: () => ({
        selectedElection: null,
        electionRules: [
            v => !!v || 'election is required',
        ],
    }),
    methods: {
        updateElection() {
            this.$emit('update:election', this.selectedElection);
        },
    },
};
</script>