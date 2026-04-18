export const runtime = 'edge';

export const metadata = {
  title: 'Website Unavailable | Bizvistar',
  description: 'This website is currently unavailable.',
};

export default function SiteUnavailablePage() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body style={{ margin: 0, padding: 0, fontFamily: "'Inter', sans-serif" }}>
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0f0c29 0%, #1a1440 30%, #24243e 60%, #0f0c29 100%)',
          color: '#fff',
          textAlign: 'center',
          padding: '24px',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Background glow effects */}
          <div style={{
            position: 'absolute',
            top: '20%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '600px',
            height: '400px',
            background: 'radial-gradient(ellipse, rgba(138,99,210,0.15) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute',
            bottom: '10%',
            right: '10%',
            width: '300px',
            height: '300px',
            background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />

          {/* Main Content */}
          <div style={{
            maxWidth: '520px',
            zIndex: 1,
          }}>
            {/* Icon */}
            <div style={{
              width: '88px',
              height: '88px',
              borderRadius: '24px',
              background: 'linear-gradient(135deg, rgba(138,99,210,0.2), rgba(138,99,210,0.05))',
              border: '1px solid rgba(138,99,210,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 32px',
              backdropFilter: 'blur(10px)',
            }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(138,99,210,0.8)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 8v4"/>
                <path d="M12 16h.01"/>
              </svg>
            </div>

            {/* Title */}
            <h1 style={{
              fontSize: 'clamp(28px, 5vw, 40px)',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              margin: '0 0 16px',
              background: 'linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.7) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              lineHeight: 1.2,
            }}>
              This Website is Currently Unavailable
            </h1>

            {/* Description */}
            <p style={{
              fontSize: '16px',
              color: 'rgba(255,255,255,0.55)',
              lineHeight: 1.7,
              margin: '0 0 40px',
              maxWidth: '420px',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}>
              The owner has temporarily taken this website offline. If you believe this is an error, please contact the site owner or check back later.
            </p>

            {/* Divider */}
            <div style={{
              width: '48px',
              height: '1px',
              background: 'rgba(138,99,210,0.3)',
              margin: '0 auto 40px',
            }} />

            {/* CTA */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px',
            }}>
              <p style={{
                fontSize: '13px',
                color: 'rgba(255,255,255,0.35)',
                margin: 0,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                fontWeight: 600,
              }}>
                Want your own online store?
              </p>
              <a
                href="https://bizvistar.in"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '14px 32px',
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, #8A63D2, #6A43B2)',
                  color: '#fff',
                  textDecoration: 'none',
                  fontWeight: 700,
                  fontSize: '15px',
                  letterSpacing: '-0.01em',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 4px 24px rgba(138,99,210,0.3)',
                }}
              >
                Get Started with Bizvistar
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14"/>
                  <path d="m12 5 7 7-7 7"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Footer */}
          <div style={{
            position: 'absolute',
            bottom: '24px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            color: 'rgba(255,255,255,0.2)',
            fontSize: '12px',
            fontWeight: 500,
          }}>
            Powered by
            <a
              href="https://bizvistar.in"
              style={{
                color: 'rgba(138,99,210,0.5)',
                textDecoration: 'none',
                fontWeight: 700,
              }}
            >
              Bizvistar
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
