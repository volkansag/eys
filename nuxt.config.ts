// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: false },
  modules: ["@pinia/nuxt", "nuxt-auth-utils"],
  nitro: {
    preset: "node-server",
    esbuild: {
      options: {
        target: "esnext",
      },
    },
    rollupConfig: {
      output: {
        inlineDynamicImports: true,
      },
    },
  },
  css: ["~/assets/sass/main.sass"],
  runtimeConfig: {
    oauth: {
      google: {
        clientId: process.env.NUXT_OAUTH_GOOGLE_CLIENT_ID,
        clientSecret: process.env.NUXT_OAUTH_GOOGLE_CLIENT_SECRET,
      },
    },
  },
  vite: {
    css: {
      preprocessorOptions: {
        sass: {
          additionalData: '@use "~/assets/sass/_variables.sass" as *\n',
        },
      },
    },
  },
});
