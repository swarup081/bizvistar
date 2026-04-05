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
                  Welcome to BizVistar! We are excited to have you aboard. These Terms of Service (&quot;Terms&quot;) constitute a legally binding agreement made between you, whether personally or on behalf of an entity (&quot;you&quot; or &quot;User&quot;), and BizVistar, a Sole Proprietorship with its registered address at Mohanpur Road, Srikona Grant, Near Kali Mandir, Silchar, Assam, India (&quot;BizVistar&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;).
                </p>
                <p>
                  Our Services offer our Users the ability to easily create a highly functional online presence, manage and promote businesses, and process transactions without needing to be tech-savvy. The online websites and platforms created by Users are collectively referred to herein as &quot;User Platform(s)&quot;.
                </p>
                <p>
                  These Terms, together with any additional guidelines or policies presented on the BizVistar website (bizvistar.in), govern your access to and use of all services, applications, and features offered by us (collectively, the &quot;Services&quot;).
                </p>
                <p>
                  By accessing, registering for, or using our Services, you signify and affirm your informed consent to these Terms. If you do not read, fully understand, or agree to these Terms, you must immediately leave the website and discontinue all use of the Services.
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
            title="2. User Eligibility and Legal Capacity"
            legalText={
              <>
                <p>
                  By using the Services, you represent and warrant that:
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-2">
                  <li>You are at least eighteen (18) years of age, or the legal age of majority in your jurisdiction.</li>
                  <li>You possess the legal authority, right, and freedom to enter into these Terms and form a binding agreement under the Indian Contract Act, 1872.</li>
                  <li>You are not included on any sanctions list, nor will you use the Services directly or indirectly for the benefit of any sanctioned party.</li>
                  <li>Your country of residence is accurately specified in the contact or billing address you provide us.</li>
                </ul>
                <p className="mt-4">
                  Minors are strictly prohibited from opening a shop or utilizing the Services to conduct business. If we discover that a user is under the age of 18, we will terminate the account immediately and without notice, and we reserve the right to forfeit any data associated with that account.
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
            title="3. User Accounts and Roles"
            legalText={
              <>
                <p>
                  In order to access and use the Services, you must register and create an account with BizVistar (&quot;User Account&quot;). You must provide accurate and complete information when registering your User Account.
                </p>
                <p>
                  <strong>Account Security:</strong> You are solely responsible and liable for maintaining the confidentiality of your account credentials and for all activities that occur under your User Account and User Platforms. We strongly encourage you to allow access to your User Account only to people you trust.
                </p>
                <p>
                  <strong>Account Ownership:</strong> BizVistar considers the owner of a User Platform to be the person or entity whose email address is listed in our records as the owner of the User Account. In case of a dispute regarding User Account ownership, we reserve the right to determine ownership based on our reasonable judgment, which may involve requesting government-issued IDs or business licenses. If we cannot make a determination, we reserve the right to suspend the User Account until the disputing parties reach a resolution.
                </p>
              </>
            }
            plainEnglish={
              <>
                <p>To use our tools, you need to make an account and give us accurate info.</p>
                <p>Keep your password safe! You are responsible for anything that happens under your account.</p>
                <p>The owner of the account is the person who owns the email address registered with us.</p>
              </>
            }
          />

          <LegalSection
            title="4. Your Obligations and Prohibited Conduct"
            legalText={
              <>
                <p>
                  You undertake and agree to fully comply with all applicable laws and regulations governing your use of the Services, including consumer rights, intellectual property, product safety, and trade regulations.
                </p>
                <p><strong>You agree and undertake NOT to:</strong></p>
                <ul className="list-disc pl-5 mt-2 space-y-2">
                  <li>Copy, modify, create derivative works of, download, reverse engineer, or compile any of our Services or content offered by BizVistar.</li>
                  <li>Use any illegal action to collect login data or passwords for other websites or services.</li>
                  <li>Phish, collect, upload, or otherwise make available credit card information or other forms of financial data without compliance with applicable security standards (e.g., PCI DSS).</li>
                  <li>Act in a manner which might be perceived as damaging to BizVistar&apos;s reputation and goodwill.</li>
                  <li>Engage in any form of spam, unsolicited mail, fraud, scam, phishing, &quot;pyramid schemes&quot;, or unethical marketing.</li>
                  <li>Utilize the Services for massive video streaming or file storage purposes that exceed reasonable fair use.</li>
                  <li>Remove or alter any copyright notices, watermarks, or signs indicating proprietary rights of BizVistar or our licensors.</li>
                </ul>
                <p className="mt-4">
                  Failure to abide by any of the foregoing may result in the immediate termination of your User Account without further notice and without any refund.
                </p>
              </>
            }
            plainEnglish={
              <>
                <p>In general, play nice and follow the law.</p>
                <p>Do not hack, steal code, spam people, or engage in scams.</p>
                <p>If you break these rules, we will shut down your account immediately without a refund.</p>
              </>
            }
          />

          <LegalSection
            title="5. User Content and Intellectual Property"
            legalText={
              <>
                <p>
                  <strong>Your Intellectual Property:</strong> As between you and BizVistar, you shall own all intellectual property pertaining to your content, including any designs, images, animations, videos, audio files, fonts, logos, code, or texts you upload or provide (&quot;User Content&quot;). BizVistar does not claim ownership rights over your User Content.
                </p>
                <p>
                  <strong>License to BizVistar:</strong> You grant us a non-exclusive, transferable, sub-licensable, royalty-free, and worldwide license to use, access, copy, and duplicate your User Content for the purpose of operating, maintaining, and improving the Services. We may also use any version of your User Platform (or any part thereof) for our own marketing and promotional activities.
                </p>
                <p>
                  <strong>BizVistar&apos;s Intellectual Property:</strong> All rights, title, and interest in and to the Services, including any copyrightable materials, templates, artwork, source code, and algorithms, are owned by and/or licensed to BizVistar. We grant you a limited, non-exclusive, fully revocable license to use our Services strictly as permitted by these Terms.
                </p>
              </>
            }
            plainEnglish={
              <>
                <p>You own all the content and products you put on your website.</p>
                <p>We just need your permission to display your content on the internet and occasionally feature your site in our marketing materials.</p>
                <p>We own the platform, the code, and the templates. You are renting access to use them.</p>
              </>
            }
          />

          <LegalSection
            title="6. E-Commerce and Payment Integrations"
            legalText={
              <>
                <p>
                  The Services include features that enable you to sell goods, content, media, and services through your User Platform (&quot;E-Commerce&quot;).
                </p>
                <p>
                  <strong>Your Responsibility:</strong> You are solely responsible for your E-Commerce related activities, products, and compliance with all applicable laws. BizVistar merely provides the platform for you to manage your online store. We are not involved in your relationship or any transaction with your buyers.
                </p>
                <p>
                  <strong>Payments and UPI:</strong> Payments for your products will be processed through third-party payment providers or directly via UPI interfaces you configure. BizVistar does not act as a payment gateway, does not touch the funds transferred between your customers and you, and explicitly disclaims all liability for failed transactions, chargebacks, or payment disputes.
                </p>
                <p>
                  <strong>Taxes and Fulfilment:</strong> You are fully responsible for collecting and remitting any applicable taxes (including GST), procuring and delivering your products in a safe manner, and handling all customer warranties and support.
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
            title="7. Fees, Renewals, and Strict No-Refund Policy"
            legalText={
              <>
                <p>
                  <strong>Paid Services:</strong> The use of certain features requires the payment of fees (&quot;Paid Services&quot;). If you wish to use the Paid Services, you are required to pay all applicable fees in advance.
                </p>
                <p>
                  <strong>Strictly Non-Refundable:</strong> Due to the nature of the software services provided, all fees paid to BizVistar are strictly non-refundable and non-cancellable once charged. We do not offer prorated refunds, partial refunds, or credits for unused time, regardless of the reason for cancellation or dissatisfaction.
                </p>
                <p>
                  <strong>Auto-Renewals:</strong> To ensure uninterrupted service, certain Paid Services may include an automatic renewal option by default. Unless you turn off auto-renewal before the billing date, your subscription will automatically renew at the then-current rate.
                </p>
                <p>
                  <strong>Chargebacks:</strong> If we record a decline, chargeback, or other rejection of a charge, your use of the Services may be automatically disabled or terminated, and you may be held liable for associated administrative fees.
                </p>
              </>
            }
            plainEnglish={
              <>
                <p>Some of our tools cost money (subscriptions).</p>
                <p><strong>We do not offer refunds. Period.</strong></p>
                <p>If you don&apos;t want to be charged again, make sure you cancel before your next billing date.</p>
              </>
            }
          />

          <LegalSection
            title="8. Artificial Intelligence (AI) Services"
            legalText={
              <>
                <p>
                  BizVistar may provide access to artificial intelligence tools (e.g., powered by OpenAI) to help generate text, insights, or content (&quot;AI Services&quot;).
                </p>
                <p>
                  <strong>Input and Output:</strong> You agree that any prompt you submit (&quot;Input&quot;) may be processed by third-party AI providers. BizVistar does not warrant that the output generated will be accurate, legal, or free from intellectual property infringement. You are strictly responsible for reviewing and verifying all AI-generated content before publishing it on your User Platform.
                </p>
                <p>
                  <strong>Data Sharing:</strong> You grant us a license to share your Inputs with our third-party AI vendors as required to provide these features. Do not input highly sensitive, confidential, or legally restricted personal data into the AI tools.
                </p>
              </>
            }
            plainEnglish={
              <>
                <p>We use AI tools (like OpenAI) to help you write text and get insights for your website.</p>
                <p>AI isn&apos;t perfect. Always double-check what the AI writes before publishing it on your site.</p>
                <p>Please don&apos;t type highly sensitive or private personal information into the AI generators.</p>
              </>
            }
          />

          <LegalSection
            title="9. Third-Party Services"
            legalText={
              <>
                <p>
                  The Services may enable you to engage with third-party providers (e.g., domain registrars, payment gateways, third-party apps).
                </p>
                <p>
                  BizVistar acts merely as an intermediary platform. We do not endorse any Third-Party Services, nor are we responsible or liable for their actions, policies, or the data they collect. Any use of such Third-Party Services is done solely at your own risk and is subject to the legal terms governing those specific services.
                </p>
              </>
            }
            plainEnglish={
              <>
                <p>Our platform might connect to other services (like a payment processor or a domain provider).</p>
                <p>We don&apos;t control those other companies, so you use them at your own risk and must follow their rules.</p>
              </>
            }
          />

          <LegalSection
            title="10. Disclaimer of Warranties"
            legalText={
              <>
                <p>
                  We provide the Services on an &quot;AS IS&quot;, &quot;with all faults&quot;, and &quot;AS AVAILABLE&quot; basis, without warranties of any kind. We specifically disclaim any implied warranties of merchantability, fitness for a particular purpose, workmanlike effort, and non-infringement.
                </p>
                <p>
                  We do not warrant that the Services will be complete, accurate, reliable, secure, or comply with all laws applicable to your specific industry. We are not a &quot;publisher&quot; of your User Content and assume no liability for any losses, damages, or claims arising from the content you publish.
                </p>
              </>
            }
            plainEnglish={
              <>
                <p>We try our best, but we provide the platform &quot;as is.&quot; We don&apos;t guarantee it will be perfect, secure, or online 100% of the time.</p>
                <p>You are solely responsible for the content you put on your website.</p>
              </>
            }
          />

          <LegalSection
            title="11. Limitation of Liability and Indemnity"
            legalText={
              <>
                <p>
                  <strong>Limitation of Liability:</strong> To the fullest extent permitted by Indian law, BizVistar, its proprietor, affiliates, and employees shall not be liable for any direct, indirect, incidental, special, punitive, or consequential damages (including loss of profits, data, or goodwill) resulting from your use of or inability to use the Services. Our maximum aggregate liability to you shall not exceed the total fees you paid to us in the three (3) months preceding the event giving rise to the claim.
                </p>
                <p>
                  <strong>Indemnity:</strong> You agree to defend, indemnify, and hold harmless BizVistar from any and all claims, damages, obligations, losses, or costs arising from your violation of these Terms, your User Content, or any damage your User Platform causes to a third party.
                </p>
              </>
            }
            plainEnglish={
              <>
                <p>If something goes wrong and your business loses money, we are not legally or financially responsible for those losses.</p>
                <p>If we get sued because of something illegal or harmful you did on your website, you will be responsible for covering our legal costs and damages.</p>
              </>
            }
          />

          <LegalSection
            title="12. Governing Law and Jurisdiction"
            legalText={
              <>
                <p>
                  These Terms, your use of the Services, and any disputes related thereto shall be governed by, construed under, and enforced exclusively in accordance with the internal substantive laws of the State of Assam and the Republic of India.
                </p>
                <p>
                  You agree that any legal action or dispute shall be brought exclusively in the competent courts located in <strong>Silchar, Assam, India</strong>. The application of the United Nations Convention of Contracts for the International Sale of Goods is hereby expressly excluded.
                </p>
              </>
            }
            plainEnglish={
              <>
                <p>These terms are governed by Indian law.</p>
                <p>If we ever get into a legal dispute, it must be settled exclusively in the courts of Silchar, Assam.</p>
              </>
            }
          />

          <LegalSection
            title="13. Changes & Updates"
            legalText={
              <>
                <p>
                  BizVistar reserves the right to change, suspend, or terminate any of the Services, or alter these Terms at any time. If we make material changes, we will notify you by posting a notice on our website or via email. Your continued use of the Services following such notification constitutes your acceptance of the updated Terms.
                </p>
              </>
            }
            plainEnglish={
              <>
                <p>We may update these terms or change our features from time to time.</p>
                <p>If we make big changes, we&apos;ll let you know.</p>
              </>
            }
          />

          <LegalSection
            title="14. Grievance Officer"
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
