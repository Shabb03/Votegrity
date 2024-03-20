<template>
    <v-sheet class="mx-auto" width="350">
    <v-select
        clearable
        v-model="rank"
        label="Choose Rank Preference"
        :items="rankData"
        :rules="rankRules"
        @update:modelValue="updateRank"
    ></v-select>
    </v-sheet>
</template>

<script>
export default {
    props: {
        rankData: Array,
    },
    data: () => ({
        rank: null,
        rankRules: [
            v => !!v || 'rank is required',
        ],
    }),
    methods: {
        updateRank() {
            this.$emit('update:rank', this.rank);
        },
    },
};
</script>