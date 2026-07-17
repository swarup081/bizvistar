export default function robots() {
    return {
      rules: {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard/', '/api/', '/editor/', '/checkout/', '/preview/', '/test-skeleton/', '/get-started/'],
      },
      sitemap: 'https://bizvistar.in/sitemap.xml',
    }
  }
  