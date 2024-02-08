import { mount } from '@vue/test-utils';
import ThankYou from '../views/ThankYou.vue';

const mockRoute = {
    name: 'mockedRouteName',
};

const VAppBar = {
    template: '<div></div>',
};

global.mocks = {
    $vuetify: {
        theme: {},
    },
    VAppBar,
};

describe('ThankYou View Test', () => {
    it('renders correctly', () => {
        const wrapper = mount(ThankYou, {
            global: {
                mocks: {
                    $route: mockRoute,
                },
                components: {
                    'v-app-bar': VAppBar
                },
            },
        });
        expect(wrapper.exists()).toBe(true);
    });
});