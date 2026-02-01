import { defineStore } from "pinia";

export const useLayoutStore = defineStore("layout", {
  state: () => ({
    isDrawerOpen: false,
  }),
  actions: {
    toggleDrawer() {
      this.isDrawerOpen = !this.isDrawerOpen;
    },
    setDrawer(value: boolean) {
      this.isDrawerOpen = value;
    },
    closeDrawer() {
      this.isDrawerOpen = false;
    },
    openDrawer() {
      this.isDrawerOpen = true;
    },
  },
});
