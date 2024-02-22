import { mount } from '@vue/test-utils';
import HomePage from '../views/HomePage.vue';

const mockRoute = {
    name: 'mockedRouteName',
};

global.mocks = {
    $vuetify: {
        theme: {},
    },
};

//test the HomePage View renders correctly
describe('HomePage View Test', () => {
    it('renders correctly', () => {
        const wrapper = mount(HomePage, {
            global: {
                mocks: {
                    $route: mockRoute,
                },
            },
        });
        expect(wrapper.exists()).toBe(true);
    });
});