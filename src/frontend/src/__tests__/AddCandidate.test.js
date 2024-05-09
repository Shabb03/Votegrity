import { mount } from '@vue/test-utils';
import AddCandidate from '../views/AddCandidate.vue';

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

//test the AddCandidate View renders correctly
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
                },
            },
        });
        expect(wrapper.exists()).toBe(true);
    });
});