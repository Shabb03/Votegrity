import { mount } from '@vue/test-utils';
import DeleteAccount from '../views/DeleteAccount.vue';

const mockRoute = {name: 'mockedRouteName',};

const VBtn = {template: '<div></div>',};
const VAppBar = {template: '<div></div>',};
const VOtpInput = {template: '<div></div>',};
const VCard = {template: '<div></div>',};
const VDialog = {template: '<div></div>',};
const VCardActions = {template: '<div></div>',};
const VCardText = {template: '<div></div>',};
const VToolbar = {template: '<div></div>',};
const VSheet = {template: '<div></div>',};

global.mocks = {
    $vuetify: {
        theme: {},
    },
    VBtn,
    VAppBar,
    VOtpInput,
    VCard,
    VDialog,
    VCardActions,
    VCardText,
    VToolbar,
    VSheet,
};

//test the DeleteAccount View renders correctly
describe('DeleteAccount View Test', () => {
    it('renders correctly', () => {
        const wrapper = mount(DeleteAccount, {
            global: {
                mocks: {
                    $route: mockRoute,
                },
                components: {
                    'v-btn': VBtn,
                    'v-app-bar': VAppBar,
                    'v-otp-input': VOtpInput,
                    'v-card': VCard,
                    'v-dialog': VDialog,
                    'v-card-actions': VCardActions,
                    'v-card-text': VCardText,
                    'v-toolbar': VToolbar,
                    'v-sheet': VSheet,
                },
            },
        });
        expect(wrapper.exists()).toBe(true);
    });
});