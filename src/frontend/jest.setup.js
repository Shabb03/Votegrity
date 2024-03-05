import { config } from '@vue/test-utils';

config.global.mocks = {
  $vuetify: {
    theme: {},
  },
};