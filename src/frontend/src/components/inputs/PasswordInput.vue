<template>
    <v-text-field
        v-model="password"
        :label="label || 'Password'"
        :type="showPassword ? 'text' : 'password'"
        :rules="displayPasswordRules ? passwordRules : []"
        @input="updatePassword"
    ></v-text-field>
    <v-checkbox v-model="showPassword" label="Show Password"></v-checkbox>
</template>

<script>
export default {
    props: {
        label: {
            type: String,
            default: 'Password',
        },
        displayPasswordRules: {
            type: Boolean,
            default: false,
        },
    },
    data: () => ({
        password: '',
        showPassword: false,
        passwordRules: [
            v => !!v || 'password is required',
            /*v => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,}$/.test(v)
                || `Password must have at least the following:
                    one lowercase letter
                    one uppercase letter
                    one number
                    one special character
                    minimum 10 characters long`,*/
            v => (/[a-z]/.test(v)) || 'Must contain lowercase letter',
            v => (/[A-Z]/.test(v)) || 'Must contain uppercase letter',
            v => (/\d/.test(v)) || 'Must contain number',
            v => (/[@$!%*?&]/.test(v)) || 'Must contain special character',
            v => (v && v.length >= 10) || 'Minimum 10 characters long',
        ],
    }),
    methods: {
        updatePassword() {
            this.$emit('update:password', this.password);
        },
    },
};
</script>