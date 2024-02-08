//import { shallowMount } from '@vue/test-utils';
import { mount } from '@vue/test-utils';
//const axios = require('axios');
import HomePage from '../views/HomePage.vue';

const mockRoute = {
    name: 'mockedRouteName',
};
/*
const VBtn = {
    template: '<div></div>',
};
*/
global.mocks = {
    $vuetify: {
        theme: {},
    },
    //VBtn,
  };

describe('HomePage View Test', () => {
    it('renders correctly', () => {
        const wrapper = mount(HomePage, {
            global: {
                mocks: {
                    $route: mockRoute,
                },
                /*components: {
                    'v-btn': VBtn
                },*/
            },
        });
        expect(wrapper.exists()).toBe(true);
    });
});