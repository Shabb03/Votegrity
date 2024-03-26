<template>
    <div v-if="process" class="description">{{ description }}</div>
    <br>
    <v-autocomplete
        v-model="process"
        label="Voting Method"
        :items="processes.map(process => process.label)"
        :rules="displayProcessRules ? processRules : []"
        @update:modelValue="updateProcess"
    ></v-autocomplete>
</template>
  
<script>
import processData from '../../assets/process.json';

export default {
    props: {
        displayProcessRules: {
            type: Boolean,
            default: true,
        },
    },
    data: () => ({
        process: null,
        description: '',
        processRules: [
            v => !!v || 'process is required',
        ],
        processes: processData,
    }),
    methods: {
        updateProcess() {
            const procLabel = this.process;
            const selectedProcess = this.processes.find(process => process.label === procLabel);
            this.description = selectedProcess.description;
            this.$emit('update:process', this.process);
        },
    },
};
</script>