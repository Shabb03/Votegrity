<template>
  <div class="form-container">
  <v-form ref="form">
    <NameInput/>
    <EmailInput/>
    <!--<SelectField v-model="select" :items="items" label="Item" required />
    <CheckboxField v-model="checkbox" label="Do you agree?" required />-->

    <div class="d-flex flex-row">
        <v-btn color="success" class="mt-4" @click="validate">
          Validate
        </v-btn>

        <v-btn color="error" class="mt-4 ml-4" @click="reset">
          Reset
        </v-btn>
      </div>
  </v-form>
  </div>
</template>

<script>
import NameInput from './NameInput.vue';
import EmailInput from './EmailInput.vue';
/*import SelectField from './SelectField.vue';
import CheckboxField from './CheckboxField.vue';
import ValidationButton from './ValidationButton.vue';
import ResetButton from './ResetButton.vue';
import ResetValidationButton from './ResetValidationButton.vue';*/

export default {
  components: {
    NameInput,
    EmailInput,
    /*TextField,
    SelectField,
    CheckboxField,
    ValidationButton,
    ResetButton,
    ResetValidationButton,*/
  },
  data: () => ({
    //name: '',
    /*nameRules: [
      v => !!v || 'Name is required',
      v => (v && v.length <= 10) || 'Name must be less than 10 characters',
    ],*/
    /*email: ''*/
    //select: null,
    //items: ['Item 1', 'Item 2', 'Item 3', 'Item 4'],
    //checkbox: false,
  }),
  methods: {
      async validate() {
        const { valid } = await this.$refs.form.validate()

        if (valid) alert('Form is valid')
      },
      reset() {
        this.$refs.form.reset()
      },
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