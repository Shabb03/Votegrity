import { mount } from '@vue/test-utils';
import ChangePassword from '../views/ChangePassword.vue';

const mockRoute = {name: 'mockedRouteName',};

const VBtn = {template: '<div></div>',};
const VAppBar = {template: '<div></div>',};
const VForm = {template: '<div></div>',};
const VRow = {template: '<div></div>',};
const VCol = {template: '<div></div>',};
const VCard = {template: '<div></div>',};
const VSheet = {template: '<div></div>',};
const VOtpInput = {template: '<div></div>',};
const VDialog = {template: '<div></div>',};
const VCardActions = {template: '<div></div>',};
const VCardText = {template: '<div></div>',};
const VToolbar = {template: '<div></div>',};

global.mocks = {
    $vuetify: {
        theme: {},
    },
    VBtn,
    VForm,
    VAppBar,
    VRow,
    VCol,
    VCard,
    VSheet,
    VOtpInput,
    VDialog,
    VCardActions,
    VCardText,
    VToolbar,
};

//test the ChangePassword View renders correctly
describe('ChangePassword View Test', () => {
    it('renders correctly', () => {
        const wrapper = mount(ChangePassword, {
            global: {
                mocks: {
                    $route: mockRoute,
                },
                components: {
                    'v-btn': VBtn,
                    'v-app-bar': VAppBar,
                    'v-form': VForm,
                    'v-row': VRow,
                    'v-col': VCol,
                    'v-card': VCard,
                    'v-sheet': VSheet,
                    'v-otp-input': VOtpInput,
                    'v-dialog': VDialog,
                    'v-card-actions': VCardActions,
                    'v-card-text': VCardText,
                    'v-toolbar': VToolbar,
                },
            },
        });
        expect(wrapper.exists()).toBe(true);
    });
});