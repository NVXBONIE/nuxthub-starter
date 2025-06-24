import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-04-25',
  future: { compatibilityVersion: 4 },
  modules: [
    '@nuxthub/core',
    '@nuxt/eslint',
    'shadcn-nuxt',
    '@nuxtjs/i18n',
  ],
  css: ['~/assets/css/tailwind.css'],
  hub: {
    database: true,
    kv: true,
    blob: true,
    cache: true,
    ai: true,
  },
  i18n: {
    locales: [
      {
        code: 'ro',
        iso: 'ro-RO',
        name: 'Română',
        file: 'ro.json'
      },
      {
        code: 'en',
        iso: 'en-US',
        name: 'English',
        file: 'en.json'
      }
    ],
    defaultLocale: 'ro',
    strategy: 'prefix_except_default',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root',
    }
  },
  nitro: {
    experimental: {
      openAPI: true
    }
  },
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  shadcn: {
    prefix: '',
    componentDir: './app/components/ui',
  },
  devtools: { enabled: true },
  routeRules: {
    '/': {
      ssr: false,
    }
  }
})