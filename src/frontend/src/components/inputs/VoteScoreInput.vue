<template>
    <v-sheet class="mx-auto" width="350">
    <v-text-field
        v-model="score"
        :label="label || 'Score'"
        :rules="scoreRules"
        @input="updateScore"
        type="number"
        required
    ></v-text-field>
    </v-sheet>
</template>

<script>
export default {
    props: {
        label: {
            type: String,
            default: 'Score',
        },
        required: {
            type: Boolean,
            default: true,
        },
    },
    data: () => ({
        score: 0,
    }),
    computed: {
        scoreRules() {
            const validationRules = [];
            if (this.required) {
                validationRules.push((v) => !!v || 'score is required');
                validationRules.push((v) => (v <= 100) || 'Score must be between 0-100');
            }
            return validationRules;
        },
    },
    methods: {
        updateScore() {
            this.$emit('update:score', this.score);
        },
    },
};
</script>