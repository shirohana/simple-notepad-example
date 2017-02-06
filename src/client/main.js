import 'bulma';

import Vue from 'vue';
import Vuex from 'vuex';
import VueMediaQuery from 'v-media-query';

import store from './store';
import App from './components/App';

// breakpoints from Bulma.css
const breakpoint = {
  tablet: 769,
  // 960px container + 40px
  desktop: 1000,
  // 1152px container + 40px
  widescreen: 1192
};

Vue.use(Vuex);
Vue.use(VueMediaQuery, {
  methods: {
    isMobile: () => VueMediaQuery.methods.below(breakpoint.tablet - 1),
    isTablet: () => VueMediaQuery.methods.above(breakpoint.tablet),
    isTabletOnly: () => VueMediaQuery.methods.between([breakpoint.tablet, breakpoint.desktop - 1]),
    isTouch: () => VueMediaQuery.methods.below(breakpoint.desktop - 1),
    isDesktop: () => VueMediaQuery.methods.above(breakpoint.desktop),
    isDesktopOnly: () => VueMediaQuery.methods.between([breakpoint.desktop, breakpoint.widescreen - 1]),
    isWidescreen: () => VueMediaQuery.methods.above(breakpoint.widescreen)
  },
  variables: breakpoint
});

new Vue({
  store,
  el: 'app',
  components: { App }
});
