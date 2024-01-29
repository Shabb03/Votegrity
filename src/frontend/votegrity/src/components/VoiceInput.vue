<template>
  <v-text-field
    v-model="voice"
    label="Voice"
    @input="updateVoice"
  ></v-text-field>
</template>

<script>
export default {
  data: () => ({
    voice: '',
    /*voiceRules: [
      v => !!v || 'voice is required',
    ],*/
  }),
  methods: {
    updateVoice() {
      this.$emit('update:voice', this.voice);
    },
  },
};
</script>