import { mount } from '@vue/test-utils';
import VoteCandidate from '../views/VoteCandidate.vue';

const mockRoute = {name: 'mockedRouteName',};

const VBtn = {template: '<div></div>',};
const VAppBar = {template: '<div></div>',};
const VCol = {template: '<div></div>',};
const VCard = {template: '<div></div>',};
const VCardText = {template: '<div></div>',};
const VCardTitle = {template: '<div></div>',};
const VImg = {template: '<div></div>',};
const VContainer = {template: '<div></div>',};
const VRow = {template: '<div></div>',};

global.mocks = {
    $vuetify: {
        theme: {},
    },
    VBtn,
    VAppBar,
    VCol,
    VCard,
    VCardText,
    VCardTitle,
    VImg,
    VContainer,
    VRow,
};

describe('VoteCandidate View Test', () => {
    it('renders correctly', () => {
        const wrapper = mount(VoteCandidate, {
            global: {
                mocks: {
                    $route: mockRoute,
                },
                components: {
                    'v-btn': VBtn,
                    'v-app-bar': VAppBar,
                    'v-col': VCol,
                    'v-card': VCard,
                    'v-card-text': VCardText,
                    'v-card-title': VCardTitle,
                    'v-img': VImg,
                    'v-container': VContainer,
                    'v-row': VRow
                },
            },
        });
        expect(wrapper.exists()).toBe(true);
    });
});