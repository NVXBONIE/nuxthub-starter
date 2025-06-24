import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-04-25',
  future: { compatibilityVersion: 4 },
  modules: [
    '@nuxthub/core',
    '@nuxt/eslint',
    'shadcn-nuxt',
  ],
  css: ['~/assets/css/tailwind.css'],
  hub: {
    database: true,
    kv: true,
    blob: true,
    cache: true,
    ai: true,
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