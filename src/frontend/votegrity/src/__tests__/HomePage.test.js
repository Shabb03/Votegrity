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