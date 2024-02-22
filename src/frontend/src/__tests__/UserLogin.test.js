import { mount } from '@vue/test-utils';
import UserLogin from '../views/UserLogin.vue';

const mockRoute = {name: 'mockedRouteName',};

const VBtn = {template: '<div></div>',};
const VForm = {template: '<div></div>',};
const RouterLink = {template: '<div></div>',};
const VRow = {template: '<div></div>',};
const VCol = {template: '<div></div>',};

global.mocks = {
    $vuetify: {
        theme: {},
    },
    VBtn,
    VForm,
    RouterLink,
    VRow,
    VCol,
};

//test the UserLogin View renders correctly
describe('UserLogin View Test', () => {
    it('renders correctly', () => {
        const wrapper = mount(UserLogin, {
            global: {
                mocks: {
                    $route: mockRoute,
                },
                components: {
                    'v-btn': VBtn,
                    'v-form': VForm,
                    'router-link': RouterLink,
                    'v-row': VRow,
                    'v-col': VCol,
                },
            },
        });
        expect(wrapper.exists()).toBe(true);
    });
});