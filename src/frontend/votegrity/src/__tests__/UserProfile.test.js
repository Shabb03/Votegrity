import { mount } from '@vue/test-utils';
import UserProfile from '../views/UserProfile.vue';

const mockRoute = {name: 'mockedRouteName',};

const VBtn = {template: '<div></div>',};
const VAppBar = {template: '<div></div>',};
const VForm = {template: '<div></div>',};
const VTextField = {template: '<div></div>',};

global.mocks = {
    $vuetify: {
        theme: {},
    },
    VBtn,
    VAppBar,
    VForm,
    VTextField,
};

describe('UserProfile View Test', () => {
    it('renders correctly', () => {
        const wrapper = mount(UserProfile, {
            global: {
                mocks: {
                    $route: mockRoute,
                },
                components: {
                    'v-btn': VBtn,
                    'v-app-bar': VAppBar,
                    'v-form': VForm,
                    'v-text-field': VTextField,
                },
            },
        });
        expect(wrapper.exists()).toBe(true);
    });
});