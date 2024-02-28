import { mount } from '@vue/test-utils';
import UserProfile from '../views/UserProfile.vue';

const mockRoute = {name: 'mockedRouteName',};

const VBtn = {template: '<div></div>',};
const VAppBar = {template: '<div></div>',};
const VForm = {template: '<div></div>',};
const VTextField = {template: '<div></div>',};
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
    VAppBar,
    VForm,
    VTextField,
    VRow,
    VCol,
    VCard,
    VDialog,
    VCardActions,
    VCardText,
    VToolbar,
};

//test the UserProfile View renders correctly
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