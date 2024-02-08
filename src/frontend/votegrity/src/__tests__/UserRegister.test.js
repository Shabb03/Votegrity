import { mount } from '@vue/test-utils';
import UserRegister from '../views/UserRegister.vue';

const mockRoute = {name: 'mockedRouteName',};

const VBtn = {template: '<div></div>',};
const VForm = {template: '<div></div>',};
const RouterLink = {template: '<div></div>',};

global.mocks = {
    $vuetify: {
        theme: {},
    },
    VBtn,
    VForm,
    RouterLink,
};

describe('UserRegister View Test', () => {
    it('renders correctly', () => {
        const wrapper = mount(UserRegister, {
            global: {
                mocks: {
                    $route: mockRoute,
                },
                components: {
                    'v-btn': VBtn,
                    'v-form': VForm,
                    'router-link': RouterLink,
                },
            },
        });
        expect(wrapper.exists()).toBe(true);
    });
});