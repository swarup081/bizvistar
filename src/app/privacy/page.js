import React from 'react';
import { LegalLayout, LegalSection } from '@/components/legal/LegalLayout';
import NewHeader from '@/components/landing/NewHeader';
import Footer from '@/components/Footer';

export default function PrivacyPolicy() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <NewHeader />
      <main className="flex-grow mt-20">
        <LegalLayout title="BizVistar Privacy Policy" lastUpdated={new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}>

          <LegalSection
            title="1. Introduction"
            legalText={
              <>
                <p>
                  BizVistar (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) cares deeply about the privacy of our users. This Privacy Policy describes how we collect, use, and share your Personal Information when you use our website (bizvistar.in), our website builder tools, and related services (collectively, the &quot;Services&quot;).
                </p>
                <p>
                  This Privacy Policy is compiled in accordance with the Information Technology Act, 2000, and the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011 of India. By accessing or using our Services, you consent to the data practices described in this policy.
                </p>
              </>
            }
            plainEnglish={
              <>
                <p>We care about your privacy and keeping your data safe.</p>
                <p>This policy explains what information we collect, how we use it, and who we share it with.</p>
                <p>By using BizVistar, you agree to these rules.</p>
              </>
            }
          />

          <LegalSection
            title="2. What Personal Information Do We Collect?"
            legalText={
              <>
                <p>
                  <strong>Information you provide to us:</strong> When you register for an account, subscribe to our services, or contact our support team, we may collect Personal Information such as your name, email address, phone number, and billing information.
                </p>
                <p>
                  <strong>Information we collect automatically:</strong> When you visit our website or use our Services, we may collect technical data such as your IP address, browser type, device information, and usage patterns to ensure our Services function properly and to improve user experience.
                </p>
                <p>
                  <strong>Users-of-Users Data:</strong> We may also process information pertaining to visitors or customers of your BizVistar website (&quot;Users-of-Users&quot;). We process this data strictly on your behalf as a service provider. You are responsible for ensuring you have the legal right to collect and share this data with us.
                </p>
              </>
            }
            plainEnglish={
              <>
                <p>We collect information you give us (like your name and email when signing up).</p>
                <p>We also collect technical info automatically (like what browser you use) so our website works correctly.</p>
                <p>If you have customers on your BizVistar website, we process their data on your behalf, but you are responsible for getting their permission.</p>
              </>
            }
          />

          <LegalSection
            title="3. How Do We Use Your Personal Information?"
            legalText={
              <>
                <p>We use your Personal Information for the following purposes:</p>
                <ul>
                  <li>To provide, operate, and maintain our Services.</li>
                  <li>To process your subscription payments.</li>
                  <li>To provide customer support and respond to your inquiries.</li>
                  <li>To send you administrative messages, legal notices, and promotional materials (you can opt out of promotional emails at any time).</li>
                  <li>To analyze website usage and improve the functionality of BizVistar.</li>
                  <li>To comply with applicable laws and legal obligations.</li>
                </ul>
              </>
            }
            plainEnglish={
              <>
                <p>We use your information to run our service, process your payments, and help you if you contact support.</p>
                <p>We also use it to figure out how to make BizVistar better for everyone.</p>
              </>
            }
          />

          <LegalSection
            title="4. How We Share Your Information & Third-Party AI"
            legalText={
              <>
                <p>
                  <strong>Service Providers:</strong> We may share your Personal Information with trusted third-party service providers who assist us in operating our Services (e.g., hosting providers, payment processors, analytics tools). These providers are contractually obligated to protect your data.
                </p>
                <p>
                  <strong>Third-Party AI Services:</strong> BizVistar utilizes third-party artificial intelligence service providers, such as OpenAI, to offer advanced features like text generation and analytics. By using these features, you acknowledge that non-sensitive business data, product descriptions, and user prompts may be transmitted to these AI providers to generate the requested content.
                </p>
                <p>
                  <strong>Legal Compliance:</strong> We may disclose your information if required to do so by law, court order, or government request, or to protect the rights, property, or safety of BizVistar, our users, or the public.
                </p>
              </>
            }
            plainEnglish={
              <>
                <p>We share your data with trusted companies that help us run our business (like server hosts and payment processors).</p>
                <p><strong>Important:</strong> When you use our AI writing tools, the text you enter is sent to companies like OpenAI to generate the response.</p>
                <p>We will also share data if the law or police require us to.</p>
              </>
            }
          />

          <LegalSection
            title="5. Data Security and Retention"
            legalText={
              <>
                <p>
                  <strong>Security:</strong> We implement reasonable physical, electronic, and procedural safeguards designed to protect your Personal Information. However, no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
                </p>
                <p>
                  <strong>Retention:</strong> We will retain your Personal Information for as long as your account is active, or as needed to provide you with the Services. We may retain your information after account deactivation to comply with our legal obligations, resolve disputes, and enforce our agreements.
                </p>
              </>
            }
            plainEnglish={
              <>
                <p>We work hard to keep your data safe using industry-standard security measures.</p>
                <p>However, nothing on the internet is 100% secure, so be careful with highly sensitive information.</p>
                <p>We keep your data as long as you have an account, or as long as the law requires us to.</p>
              </>
            }
          />

          <LegalSection
            title="6. Your Rights"
            legalText={
              <>
                <p>
                  Depending on your jurisdiction and applicable laws, you may have the right to request access to, correction of, or deletion of your Personal Information held by us.
                </p>
                <p>
                  If you wish to exercise any of these rights, or if you wish to delete your account entirely, please contact us using the information provided in the Grievance Officer section below. Please note that deleting your account will result in the permanent removal of your website and associated data.
                </p>
              </>
            }
            plainEnglish={
              <>
                <p>You have the right to ask us to see, fix, or delete your personal information.</p>
                <p>If you want to delete your account and all your data, just contact us.</p>
              </>
            }
          />

          <LegalSection
            title="7. Grievance Officer"
            legalText={
              <>
                <p>
                  In accordance with the Information Technology Act, 2000 and the rules made thereunder, the name and contact details of our Grievance Officer are provided below to address any discrepancies and grievances you may have with respect to your Personal Information:
                </p>
                <p>
                  <strong>Name:</strong> Swarup Das<br />
                  <strong>Email:</strong> bizvistar.help@gmail.com<br />
                  <strong>Address:</strong> Mohanpur Road, Srikona Grant, Near Kali Mandir, Silchar, Assam, India.
                </p>
                <p>
                  We commit to acknowledging your grievance within 72 hours and resolving it within 30 days of receipt.
                </p>
              </>
            }
            plainEnglish={
              <>
                <p>If you have any serious concerns about your privacy or how we handle your data, please contact our Grievance Officer, Swarup Das.</p>
                <p>We will reply within 72 hours and aim to resolve the issue within 30 days.</p>
              </>
            }
          />

        </LegalLayout>
      </main>
      <Footer />
    </div>
  );
}
