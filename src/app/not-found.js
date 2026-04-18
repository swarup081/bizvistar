export const metadata = {
  title: 'Page Not Found | Bizvistar',
};

export default function NotFound() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
      <style>{`
        * { box-sizing: border-box; }
        .nf-container {
          display: flex;
          min-height: 100vh;
          align-items: center;
          justify-content: center;
          padding: 40px 80px;
          max-width: 1400px;
          margin: 0 auto;
          font-family: 'Inter', sans-serif;
          background-color: #ffffff;
          color: #000000;
        }
        .nf-left-content {
          flex: 1;
          padding-right: 20px;
          max-width: 550px;
        }
        .nf-right-graphics {
          flex: 1.2;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .nf-error-label {
          font-size: 15px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 30px;
        }
        .nf-error-code {
          font-size: clamp(140px, 16vw, 260px);
          font-weight: 400;
          line-height: 0.9;
          letter-spacing: -0.04em;
          margin-bottom: 30px;
          color: #000000;
        }
        .nf-error-desc {
          font-size: clamp(20px, 3vw, 26px);
          margin-bottom: 40px;
          color: #000000;
        }
        .nf-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background-color: #000;
          color: #fff;
          padding: 16px 36px;
          border-radius: 40px;
          text-decoration: none;
          font-size: 16px;
          font-weight: 500;
          transition: opacity 0.2s;
        }
        .nf-btn:hover {
          background: linear-gradient(135deg, #8A63D2, #6A43B2);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(138,99,210,0.3);
          opacity: 1;
        }
        .nf-svg-graphic {
          width: 100%;
          height: auto;
          max-width: 650px;
        }
        @media (max-width: 900px) {
          .nf-container {
            flex-direction: column;
            text-align: left;
            padding: 32px 24px;
            justify-content: flex-start;
            padding-top: 8vh;
          }
          .nf-left-content {
            padding-right: 0;
            margin-bottom: 60px;
            max-width: 100%;
          }
          .nf-right-graphics {
            width: 100%;
            max-width: 500px;
            margin: 0 auto;
          }
          .nf-error-code {
            font-size: 120px;
          }
        }
      `}</style>
      <div className="nf-container">
        <div className="nf-left-content">
          <div className="nf-error-label">ERROR: PAGE NOT FOUND</div>
          <div className="nf-error-code">404</div>
          <div className="nf-error-desc">This page isn't available.</div>
          <a href="https://bizvistar.in" className="nf-btn">
            Go to Bizvistar.in
          </a>
        </div>
        <div className="nf-right-graphics">
          <svg viewBox="0 0 600 500" className="nf-svg-graphic" style={{ overflow: 'visible' }}>
            {/* Dark Green Shape */}
            <g transform="translate(100, 140) rotate(-15) scale(1.1)">
              <path d="M45,0 h40 a20,20 0 0 1 20,20 v30 a20,20 0 0 1 -20,20 h-20 v20 a20,20 0 0 1 -20,20 h-40 a20,20 0 0 1 -20,-20 v-30 a20,20 0 0 1 20,-20 h20 v-20 a20,20 0 0 1 20,-20 z" fill="#065C50" />
            </g>

            {/* Light Blue Circle (top) */}
            <g transform="translate(360, 60)">
              <circle cx="45" cy="45" r="45" fill="#D5E2EF" />
            </g>

            {/* Orange Pill */}
            <rect x="180" y="240" width="250" height="75" rx="37.5" transform="rotate(-35 305 277.5)" fill="#FA866F" />

            {/* Purple Circle (bottom left) */}
            <g transform="translate(210, 370)">
              <circle cx="35" cy="35" r="35" fill="#9BA8FC" />
            </g>

            {/* Light Green Square (mid right) */}
            <g transform="translate(480, 260) rotate(8)">
              <rect x="0" y="0" width="60" height="60" rx="14" fill="#D3F98E" />
            </g>

            {/* Yellow Cursor (bottom right) */}
            <g transform="translate(370, 360) rotate(-15) scale(1.1)">
              <path d="M0,0 L0,50 L15,35 L26,60 L36,55 L25,30 L45,30 Z" fill="#FAD172" stroke="#FAD172" strokeWidth="4" strokeLinejoin="round"/>
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}
