import type { App } from 'vue';
import { VueFire } from 'vuefire';
import { firebaseApp } from '@fb/client'

export default (app: App) => {
  app.use(VueFire, {
    firebaseApp,
  });
};
