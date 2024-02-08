import { mount } from '@vue/test-utils';
import AdminLogin from '../views/AdminLogin.vue';

const mockRoute = {name: 'mockedRouteName',};

const VBtn = {template: '<div></div>',};
const VForm = {template: '<div></div>',};

global.mocks = {
    $vuetify: {
        theme: {},
    },
    VBtn,
    VForm,
};

describe('AdminLogin View Test', () => {
    it('renders correctly', () => {
        const wrapper = mount(AdminLogin, {
            global: {
                mocks: {
                    $route: mockRoute,
                },
                components: {
                    'v-btn': VBtn,
                    'v-form': VForm,
                },
            },
        });
        expect(wrapper.exists()).toBe(true);
    });
});