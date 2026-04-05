export default function robots() {
    return {
      rules: {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard/', '/api/'],
      },
      sitemap: 'https://bizvistar.in/sitemap.xml',
    }
  }
  