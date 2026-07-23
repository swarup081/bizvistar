import React from 'react';
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
  Img,
} from '@react-email/components';

export default function PaymentReceiptEmail({
  customerName = 'Customer',
  amount = '0.00',
  currency = 'INR',
  invoiceId = 'INV-0000',
  date = new Date().toLocaleDateString(),
  planName = 'Subscription Plan',
}) {
  return (
    <Html>
      <Head />
      <Preview>Your BizVistar payment receipt</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={headerTitle}>BizVistar</Heading>
          </Section>
          
          <Section style={content}>
            <Heading style={heading}>Payment Receipt</Heading>
            <Text style={text}>Hi {customerName},</Text>
            <Text style={text}>
              Thank you for your recent payment. Your subscription to <strong>{planName}</strong> is active.
            </Text>
            
            <Section style={receiptBox}>
              <Text style={receiptRow}>
                <span style={receiptLabel}>Amount Paid:</span>
                <span style={receiptValue}>{currency} {amount}</span>
              </Text>
              <Text style={receiptRow}>
                <span style={receiptLabel}>Date:</span>
                <span style={receiptValue}>{date}</span>
              </Text>
              <Text style={receiptRow}>
                <span style={receiptLabel}>Receipt ID:</span>
                <span style={receiptValue}>{invoiceId}</span>
              </Text>
            </Section>

            <Text style={text}>
              If you have any questions about this receipt, simply reply to this email or contact our support team.
            </Text>
            
            <Text style={text}>
              Best,<br />
              The BizVistar Team
            </Text>
          </Section>
          
          <Hr style={hr} />
          <Section style={footer}>
            <Text style={footerText}>
              © {new Date().getFullYear()} BizVistar. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '40px auto',
  borderRadius: '8px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
  padding: '0',
  maxWidth: '600px',
  overflow: 'hidden',
};

const header = {
  backgroundColor: '#8a63d2', // BizVistar brand color
  padding: '24px 40px',
  textAlign: 'center',
};

const headerTitle = {
  color: '#ffffff',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0',
};

const content = {
  padding: '40px',
};

const heading = {
  fontSize: '24px',
  color: '#333333',
  fontWeight: '600',
  marginTop: '0',
  marginBottom: '24px',
};

const text = {
  color: '#555555',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0 0 16px 0',
};

const receiptBox = {
  backgroundColor: '#f9fafa',
  border: '1px solid #eeeeee',
  borderRadius: '6px',
  padding: '20px',
  margin: '24px 0',
};

const receiptRow = {
  display: 'flex',
  justifyContent: 'space-between',
  margin: '0 0 12px 0',
  fontSize: '15px',
};

const receiptLabel = {
  color: '#777777',
};

const receiptValue = {
  color: '#333333',
  fontWeight: '600',
  float: 'right', // Fallback for email clients that don't support flex
};

const hr = {
  borderColor: '#eeeeee',
  margin: '0',
};

const footer = {
  padding: '24px 40px',
  backgroundColor: '#fafafa',
};

const footerText = {
  color: '#999999',
  fontSize: '12px',
  textAlign: 'center',
  margin: '0',
};
