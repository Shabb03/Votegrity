//import { shallowMount } from '@vue/test-utils';
import { mount } from '@vue/test-utils';
import AddCandidate from '../views/AddCandidate.vue';

const mockRoute = {name: 'mockedRouteName',};

const VBtn = {template: '<div></div>',};
const VAppBar = {template: '<div></div>',};
const VForm = {template: '<div></div>',};
const VTextField = {template: '<div></div>',};
const VFileInput = {template: '<div></div>',};

global.mocks = {
    $vuetify: {
        theme: {},
    },
    VBtn,
    VAppBar,
    VForm,
    VTextField,
    VFileInput,
};

describe('AddCandidate View Test', () => {
    it('renders correctly', () => {
        const wrapper = mount(AddCandidate, {
            global: {
                mocks: {
                    $route: mockRoute,
                },
                components: {
                    'v-btn': VBtn,
                    'v-app-bar': VAppBar,
                    'v-form': VForm,
                    'v-text-field': VTextField,
                    'v-file-input': VFileInput
                },
            },
        });
        expect(wrapper.exists()).toBe(true);
    });
});