<template>
  <div class="form-container">
  <v-form ref="form">
    <NameInput/>
    <EmailInput/>
    <PasswordInput/>
    <SpecialNumberInput/>
    <DateInput/>

    <div class="d-flex flex-row">
        <v-btn color="success" class="mt-4" @click="validate">
          Validate
        </v-btn>
        <v-btn color="error" class="mt-4 ml-4" @click="reset">
          Reset
        </v-btn>
        <v-btn color="error" class="mt-4 ml-4" @click="test">
          Test
        </v-btn>
      </div>
  </v-form>
  </div>
</template>

<script>
import NameInput from './NameInput.vue';
import EmailInput from './EmailInput.vue';
import PasswordInput from './PasswordInput.vue';
import SpecialNumberInput from './SpecialNumberInput.vue';
import DateInput from './DateInput.vue';

export default {
  components: {
    NameInput,
    EmailInput,
    PasswordInput,
    SpecialNumberInput,
    DateInput,
  },
  methods: {
      async validate() {
        const { valid } = await this.$refs.form.validate()
        if (valid) alert('Form is valid')
      },
      reset() {
        this.$refs.form.reset()
      },
      test() {
        console.log(this.date);
      }
    },
};
</script>

<style scoped>
  .form-container {
    margin-top: 5em !important;
    width: 50%;
    margin: auto;
    padding: 20px;

    @media (max-width: 600px) {
      width: 100%;
    }
  }
</style>