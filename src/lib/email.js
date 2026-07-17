import { Resend } from 'resend';
import PaymentReceiptEmail from '@/emails/PaymentReceipt';
import SubscriptionCancelEmail from '@/emails/SubscriptionCancel';

// Initialize Resend
// Note: You must add RESEND_API to your .env file
const resend = new Resend(process.env.RESEND_API);

// Default sender - must be a verified domain in Resend
const SENDER_EMAIL = 'support@bizvistar.in'; 
// If you haven't verified a domain on Resend yet, Resend allows sending to the email address 
// associated with your Resend account if you use 'onboarding@resend.dev' as the from address.

export async function sendPaymentReceipt({ to, customerName, amount, currency, invoiceId, date, planName }) {
  try {
    if (!process.env.RESEND_API) {
      console.warn('[Email] RESEND_API key missing. Cannot send Payment Receipt.');
      return { success: false, error: 'Missing API key' };
    }

    const { data, error } = await resend.emails.send({
      from: `BizVistar <${SENDER_EMAIL}>`,
      to,
      subject: `Payment Receipt for ${planName} - BizVistar`,
      react: PaymentReceiptEmail({
        customerName,
        amount,
        currency,
        invoiceId,
        date,
        planName,
      }),
    });

    if (error) {
      console.error('[Email] Failed to send Payment Receipt:', error);
      return { success: false, error };
    }

    console.log(`[Email] Payment Receipt sent to ${to} (ID: ${data.id})`);
    return { success: true, data };
  } catch (err) {
    console.error('[Email] Exception sending Payment Receipt:', err);
    return { success: false, error: err.message };
  }
}

export async function sendSubscriptionCancel({ to, customerName, planName, endDate }) {
  try {
    if (!process.env.RESEND_API) {
      console.warn('[Email] RESEND_API key missing. Cannot send Subscription Cancel Email.');
      return { success: false, error: 'Missing API key' };
    }

    const { data, error } = await resend.emails.send({
      from: `BizVistar <${SENDER_EMAIL}>`,
      to,
      subject: `Subscription Cancelled - BizVistar`,
      react: SubscriptionCancelEmail({
        customerName,
        planName,
        endDate,
      }),
    });

    if (error) {
      console.error('[Email] Failed to send Subscription Cancel Email:', error);
      return { success: false, error };
    }

    console.log(`[Email] Subscription Cancel Email sent to ${to} (ID: ${data.id})`);
    return { success: true, data };
  } catch (err) {
    console.error('[Email] Exception sending Subscription Cancel Email:', err);
    return { success: false, error: err.message };
  }
}
