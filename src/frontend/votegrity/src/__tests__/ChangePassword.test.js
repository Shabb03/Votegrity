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
};

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
                },
            },
        });
        expect(wrapper.exists()).toBe(true);
    });
});