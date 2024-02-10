//import { shallowMount } from '@vue/test-utils';
import { mount } from '@vue/test-utils';
import NotFound from '../views/NotFound.vue';

const mockRoute = {name: 'mockedRouteName',};

const VBtn = {template: '<div></div>',};

global.mocks = {
    $vuetify: {
        theme: {},
    },
    VBtn,
};

//test the NotFound View renders correctly
describe('NotFound View Test', () => {
    it('renders correctly', () => {
        const wrapper = mount(NotFound, {
            global: {
                mocks: {
                    $route: mockRoute,
                },
                components: {
                    'v-btn': VBtn
                },
            },
        });
        expect(wrapper.exists()).toBe(true);
    });
});