<template>
  <v-text-field
    v-model="party"
    label="Party"
    @input="updateParty"
  ></v-text-field>
</template>

<script>
export default {
  data: () => ({
    party: '',
    /*partyRules: [
      v => !!v || 'party is required',
    ],*/
  }),
  methods: {
    updateParty() {
      this.$emit('update:party', this.party);
    },
  },
};
</script>