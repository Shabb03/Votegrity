import { mount } from '@vue/test-utils';
import CreateElection from '../views/CreateElection.vue';

const mockRoute = {name: 'mockedRouteName',};

const VBtn = {template: '<div></div>',};
const VAppBar = {template: '<div></div>',};
const VForm = {template: '<div></div>',};

global.mocks = {
    $vuetify: {
        theme: {},
    },
    VBtn,
    VAppBar,
    VForm,
};

describe('CreateElection View Test', () => {
    it('renders correctly', () => {
        const wrapper = mount(CreateElection, {
            global: {
                mocks: {
                    $route: mockRoute,
                },
                components: {
                    'v-btn': VBtn,
                    'v-app-bar': VAppBar,
                    'v-form': VForm,
                },
            },
        });
        expect(wrapper.exists()).toBe(true);
    });
});