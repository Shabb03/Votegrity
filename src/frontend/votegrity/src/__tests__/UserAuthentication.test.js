import { mount } from '@vue/test-utils';
import UserAuthentication from '../views/UserAuthentication.vue';

const mockRoute = {name: 'mockedRouteName',};

const VBtn = {template: '<div></div>',};
const VAppBar = {template: '<div></div>',};
const VForm = {template: '<div></div>',};
const VCard = {template: '<div></div>',};
const VSheet = {template: '<div></div>',};
const VOtpInput = {template: '<div></div>',};

global.mocks = {
    $vuetify: {
        theme: {},
    },
    VBtn,
    VAppBar,
    VForm,
    VCard,
    VSheet,
    VOtpInput,
};

describe('UserAuthentication View Test', () => {
    it('renders correctly', () => {
        const wrapper = mount(UserAuthentication, {
            global: {
                mocks: {
                    $route: mockRoute,
                },
                components: {
                    'v-btn': VBtn,
                    'v-app-bar': VAppBar,
                    'v-form': VForm,
                    'v-card': VCard,
                    'v-sheet': VSheet,
                    'v-otp-input': VOtpInput,
                },
            },
        });
        expect(wrapper.exists()).toBe(true);
    });
});