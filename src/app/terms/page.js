import React from 'react';
import { LegalLayout, LegalSection } from '@/components/legal/LegalLayout';
import NewHeader from '@/components/landing/NewHeader';
import Footer from '@/components/Footer';

export default function TermsOfService() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <NewHeader />
      <main className="flex-grow mt-20">
        <LegalLayout title="BizVistar Terms of Service" lastUpdated={new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}>

          <LegalSection
            title="1. Introduction and Legal Agreement"
            legalText={
              <>
                <p>
                  Welcome to BizVistar! We are excited to help you build your online presence. These Terms of Service (&quot;Terms&quot;) constitute a legally binding agreement made between you, whether personally or on behalf of an entity (&quot;you&quot; or &quot;User&quot;), and BizVistar, a Sole Proprietorship with its registered address at Mohanpur Road, Srikona Grant, Near Kali Mandir, Silchar, Assam, India (&quot;BizVistar&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;).
                </p>
                <p>
                  These Terms govern your access to and use of the BizVistar website (bizvistar.in), applications, and any related services (collectively, the &quot;Services&quot;). By accessing or using our Services, you signify that you have read, understood, and agree to be bound by these Terms. If you do not agree to these Terms, you must not access or use the Services.
                </p>
              </>
            }
            plainEnglish={
              <>
                <p>Welcome to BizVistar!</p>
                <p>By using our website and services, you are entering into a legally binding agreement with us (a Sole Proprietorship based in Silchar, Assam). </p>
                <p>Please read these terms carefully. If you don&apos;t agree with them, you shouldn&apos;t use our services.</p>
              </>
            }
          />

          <LegalSection
            title="2. User Eligibility and Age Restrictions"
            legalText={
              <>
                <p>
                  The Services are strictly intended for users who are at least eighteen (18) years old. By registering for an account or using the Services, you represent and warrant that you are 18 years of age or older and have the legal capacity and authority to enter into a binding contract under the Indian Contract Act, 1872.
                </p>
                <p>
                  Minors are strictly prohibited from opening a shop or utilizing the Services to conduct business. If we discover that a user is under the age of 18, we will terminate the account immediately and without notice.
                </p>
              </>
            }
            plainEnglish={
              <>
                <p>You must be at least 18 years old to use BizVistar.</p>
                <p>Because creating a shop involves legal contracts and financial transactions, minors cannot use our platform.</p>
              </>
            }
          />

          <LegalSection
            title="3. User Accounts and Responsibilities"
            legalText={
              <>
                <p>
                  To use certain features of the Services, you must register for an account. You agree to provide true, accurate, current, and complete information during the registration process and to update such information to keep it accurate and current.
                </p>
                <p>
                  You are solely responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must notify us immediately of any unauthorized use of your account. BizVistar will not be liable for any loss or damage arising from your failure to safeguard your password or account.
                </p>
              </>
            }
            plainEnglish={
              <>
                <p>To use our tools, you need to make an account and give us accurate info.</p>
                <p>Keep your password safe! You are responsible for anything that happens under your account.</p>
              </>
            }
          />

          <LegalSection
            title="4. User Content and Intellectual Property"
            legalText={
              <>
                <p>
                  <strong>Your Content:</strong> As between you and BizVistar, you retain ownership of all intellectual property rights in the text, images, products, and other content you upload or publish on your BizVistar website (&quot;User Content&quot;).
                </p>
                <p>
                  <strong>License to BizVistar:</strong> By uploading User Content, you grant BizVistar a worldwide, non-exclusive, royalty-free, sublicensable, and transferable license to use, reproduce, display, distribute, and perform your User Content solely for the purpose of operating, providing, and improving the Services.
                </p>
                <p>
                  <strong>Prohibited Content:</strong> You agree not to upload or publish content that is illegal, defamatory, obscene, infringes on third-party intellectual property rights, or violates any laws of India.
                </p>
              </>
            }
            plainEnglish={
              <>
                <p>You own all the content and products you put on your website.</p>
                <p>We just need your permission (a license) to display your content on the internet so your website works properly.</p>
                <p>Don&apos;t upload illegal, offensive, or copyrighted stuff that doesn&apos;t belong to you.</p>
              </>
            }
          />

          <LegalSection
            title="5. E-Commerce and Transactions"
            legalText={
              <>
                <p>
                  BizVistar provides tools allowing you to build an online store and accept payments directly from your customers via UPI and other methods.
                </p>
                <p>
                  <strong>No Facilitation:</strong> BizVistar acts merely as a software provider. We do not process, facilitate, or take a commission on the direct transactions between you and your customers. Payments are routed directly to the UPI ID or payment gateway you configure.
                </p>
                <p>
                  <strong>Your Liability:</strong> You are solely responsible for all e-commerce activities on your website, including providing the goods/services, handling customer service, processing refunds, and remitting applicable taxes (such as GST). BizVistar disclaims all liability for disputes arising between you and your customers.
                </p>
              </>
            }
            plainEnglish={
              <>
                <p>You can use BizVistar to sell things and get paid directly (like via UPI).</p>
                <p>We don&apos;t take a cut of your sales, and we don&apos;t touch the money.</p>
                <p>Because you get the money directly, you are 100% responsible for delivering the products, handling customer complaints, and paying your taxes.</p>
              </>
            }
          />

          <LegalSection
            title="6. Subscriptions, Payments, and Refund Policy"
            legalText={
              <>
                <p>
                  <strong>Fees:</strong> Certain features of the Services are offered on a paid subscription basis. You agree to pay the applicable fees in advance.
                </p>
                <p>
                  <strong>Strictly Non-Refundable:</strong> All subscription fees paid to BizVistar are strictly non-refundable. No partial refunds, credits, or prorated refunds will be issued for any reason, including unused time, accidental purchases, or dissatisfaction.
                </p>
                <p>
                  <strong>Cancellations:</strong> You may cancel your subscription at any time through your dashboard. Upon cancellation, your subscription will not renew, and you will retain access to premium features until the end of your current paid billing cycle.
                </p>
              </>
            }
            plainEnglish={
              <>
                <p>Some of our tools cost money (subscriptions).</p>
                <p><strong>We do not offer refunds. Period.</strong></p>
                <p>If you cancel your subscription, you won&apos;t be charged again, and you can keep using the premium features until your current month (or year) runs out.</p>
              </>
            }
          />

          <LegalSection
            title="7. Third-Party AI Services"
            legalText={
              <>
                <p>
                  BizVistar utilizes third-party artificial intelligence service providers (including, but not limited to, OpenAI) to offer advanced features such as content generation, text rewriting, and analytics insights.
                </p>
                <p>
                  By using these AI features, you acknowledge and agree that your inputs, prompts, and non-sensitive business data (such as product descriptions) may be transmitted to and processed by these third-party providers. You must ensure you have the right to input such data and that it does not contain sensitive personal information or confidential trade secrets.
                </p>
              </>
            }
            plainEnglish={
              <>
                <p>We use AI tools (like OpenAI) to help you write text and get insights for your website.</p>
                <p>When you use our AI features, the text you type is sent to these AI companies to generate the result.</p>
                <p>Please don&apos;t type highly sensitive or private personal information into the AI generators.</p>
              </>
            }
          />

          <LegalSection
            title="8. Disclaimers and Limitation of Liability"
            legalText={
              <>
                <p>
                  <strong>&quot;As Is&quot; Basis:</strong> The Services are provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis. BizVistar expressly disclaims all warranties, whether express or implied, including warranties of merchantability, fitness for a particular purpose, and non-infringement. We do not guarantee that the Services will be uninterrupted, secure, or error-free.
                </p>
                <p>
                  <strong>Limitation of Liability:</strong> To the maximum extent permitted by Indian law, in no event shall BizVistar, its proprietor, employees, or agents be liable for any indirect, consequential, incidental, special, or punitive damages, including loss of profits, data, or goodwill, arising out of your use of or inability to use the Services. Our total liability to you shall not exceed the amount you paid to BizVistar in the three (3) months preceding the claim.
                </p>
              </>
            }
            plainEnglish={
              <>
                <p>We try our best, but we provide the platform &quot;as is.&quot; We don&apos;t guarantee it will be perfect 100% of the time.</p>
                <p>If something goes wrong and your business loses money, we are not legally or financially responsible for those losses.</p>
              </>
            }
          />

          <LegalSection
            title="9. Governing Law and Jurisdiction"
            legalText={
              <>
                <p>
                  These Terms and any separate agreements whereby we provide you Services shall be governed by and construed in accordance with the laws of India.
                </p>
                <p>
                  You agree that any legal action, dispute, or proceeding arising out of or relating to these Terms or the Services shall be brought exclusively in the competent courts located in <strong>Silchar, Assam, India</strong>. You hereby consent to and waive all defenses of lack of personal jurisdiction and forum non conveniens with respect to venue and jurisdiction in the state and federal courts of Silchar, Assam.
                </p>
              </>
            }
            plainEnglish={
              <>
                <p>These terms are governed by Indian law.</p>
                <p>If we ever get into a legal dispute, it must be settled in the courts of Silchar, Assam.</p>
              </>
            }
          />

          <LegalSection
            title="10. Grievance Officer"
            legalText={
              <>
                <p>
                  In accordance with the Information Technology Act, 2000 and rules made thereunder, the name and contact details of the Grievance Officer are provided below:
                </p>
                <p>
                  <strong>Name:</strong> Swarup Das<br />
                  <strong>Email:</strong> bizvistar.help@gmail.com<br />
                  <strong>Address:</strong> Mohanpur Road, Srikona Grant, Near Kali Mandir, Silchar, Assam, India.
                </p>
                <p>
                  We will acknowledge your grievance within 72 hours and aim to resolve it within 30 days from the date of receipt.
                </p>
              </>
            }
            plainEnglish={
              <>
                <p>If you have any serious complaints or legal issues, you can contact our Grievance Officer, Swarup Das.</p>
                <p>We promise to reply within 72 hours and try to fix the issue within 30 days.</p>
              </>
            }
          />

        </LegalLayout>
      </main>
      <Footer />
    </div>
  );
}
