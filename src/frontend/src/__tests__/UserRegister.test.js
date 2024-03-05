import { mount } from '@vue/test-utils';
import UserRegister from '../views/UserRegister.vue';

const mockRoute = {name: 'mockedRouteName',};

const VBtn = {template: '<div></div>',};
const VForm = {template: '<div></div>',};
const RouterLink = {template: '<div></div>',};
const VRow = {template: '<div></div>',};
const VCol = {template: '<div></div>',};
const VCard = {template: '<div></div>',};
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
    RouterLink,
    VRow,
    VCol,
    VCard,
    VDialog,
    VCardActions,
    VCardText,
    VToolbar,
};

//test the UserRegister View renders correctly
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
                    'v-row': VRow,
                    'v-col': VCol,
                    'v-card': VCard,
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