// https://nuxt.com/docs/api/configuration/nuxt-config
import svgLoader from 'vite-svg-loader'

export default defineNuxtConfig({
  compatibilityDate: '2025-05-25',
  devtools: { enabled: true },
  pages: true,
  css: ['~/assets/css/main.css'],

  app: {
    head: {
      htmlAttrs: {
        lang: 'da'
      },

      title: 'Studenterhuset Aalborg',

      meta: [
        {
          name: 'description',
          content:
            'Studenterhuset Aalborg er et kulturhus og samlingssted for studerende med koncerter, events og fællesskab.'
        },
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1'
        },

        // Open Graph
        {
          property: 'og:title',
          content: 'Studenterhuset Aalborg'
        },
        {
          property: 'og:description',
          content:
            'Kulturhus og samlingssted for studerende med koncerter, events og fællesskab.'
        },
        {
          property: 'og:type',
          content: 'website'
        },
        {
          property: 'og:locale',
          content: 'da_DK'
        }
      ],

      link: [
        {
          rel: 'icon',
          type: 'image/svg+xml',
          href: '/favicon-logo.svg'
        }
      ]
    }
  },

  vite: {
    plugins: [svgLoader()]
  }
})