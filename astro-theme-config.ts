type NavItem = {
  label: string;
  href: string;
};

/**
 * astro-theme-config.ts
 *
 * Central configuration for the blog.
 */

const config = {
  site: {
    url: 'https://blog.alshyra.fr',
    base: '',
    lang: 'fr',
    locale: 'fr_FR',
    dateLocale: 'fr-FR',
    title: 'alshyra — IA & Tech',
    logoLabel: 'alshyra',
    description: 'Blog technique sur l\'IA, le DevOps et l\'infrastructure auto-hébergée.',
    author: 'Antoine Savajols',
    defaultOgImage: '/og.png',
  },

  nav: [] as NavItem[],

  footerNav: [
    { label: 'Articles', href: '/posts' },
    { label: 'À propos', href: '/about' },
    { label: 'Recherche', href: '/search' },
  ] as NavItem[],

  content: {
    categoryOrder: [
      'IA',
      'DevOps',
      'Infrastructure',
      'Hermes',
      'Astro',
      'Notes',
    ],
  },

  behavior: {
    smoothScroll: true,
  },

  comments: {
    mode: 'off',
    provider: 'giscus',
    giscus: {
      repo: '',
      repoId: '',
      category: '',
      categoryId: '',
      mapping: 'pathname',
      strict: '0',
      reactionsEnabled: '0',
      emitMetadata: '0',
      inputPosition: 'bottom',
      theme: 'preferred_color_scheme',
      customLightTheme: '/giscus-light.css',
      customDarkTheme: '/giscus-dark.css',
      lang: 'fr',
      loading: 'eager',
    },
  },

  social: {
    website: 'https://blog.alshyra.fr',
    email: 'antoine.savajols@gmail.com',
    linkedin: '',
    github: 'https://github.com/alshyra',
  },

  about: {
    profileImage: '',
    name: 'Antoine Savajols',
    role: 'Product Builder — IA, DevOps, infra auto-hébergée.',
    location: 'France',
    focus: 'IA, automatisation, infrastructure, et tout ce qui se construit.',
    lead: 'Je construis des produits, j\'automatise ce qui peut l\'être, et j\'écris sur ce que j\'apprends en chemin.',
    headline: ['Construire,', 'automatiser,', 'partager.'],
    statementLabel: 'Travail',
    statementTitle: 'Engineering & Product.',
    statement:
      'Product Builder avec une passion pour l\'infrastructure auto-hébergée, l\'IA, et les workflows qui tiennent la route. J\'aime construire des systèmes simples qui marchent — et écrire pour clarifier ma pensée.',
    careerLabel: 'Parcours',
    career: [
      {
        period: '2025 — Aujourd\'hui',
        title: 'Product Builder — Indépendant',
        description:
          'Consulting en architecture logicielle, infrastructure, et automatisation. Stack : TypeScript, Python, Go, K8s, Docker.',
      },
      {
        period: '2023 — 2025',
        title: 'Lead DevOps / Fullstack',
        description:
          'DevOps, K8s/Helm, Keycloak SSO, Backend Python/Go, Frontend Vue/React, CI/CD, monitoring VictoriaMetrics.',
      },
      {
        period: '2019 — 2023',
        title: 'Ingénieur DevOps & Fullstack',
        description:
          'Migration AngularJS→TypeScript, mise en place GitOps, automatisation d\'infrastructure, et refonte de pipelines CI/CD.',
      },
    ],
    interests: [
      'IA générative et agents autonomes',
      'Infrastructure reproductible et auto-hébergée',
      'Automatisation des workflows',
      'Danser la gavotte entre deux déploiements',
    ],
    interestsLabel: 'Centres d\'intérêt',
    interestsHeading: 'Ce qui me fait avancer',
  },
};

export default config;
