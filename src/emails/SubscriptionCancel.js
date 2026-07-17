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
} from '@react-email/components';

export default function SubscriptionCancelEmail({
  customerName = 'Customer',
  planName = 'Subscription Plan',
  endDate = new Date().toLocaleDateString(),
}) {
  return (
    <Html>
      <Head />
      <Preview>Your BizVistar subscription has been cancelled</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={headerTitle}>BizVistar</Heading>
          </Section>
          
          <Section style={content}>
            <Heading style={heading}>Subscription Cancelled</Heading>
            <Text style={text}>Hi {customerName},</Text>
            <Text style={text}>
              This email is to confirm that your <strong>{planName}</strong> subscription has been successfully cancelled.
            </Text>
            
            <Section style={infoBox}>
              <Text style={infoText}>
                Your website will remain active and you will continue to have access to premium features until the end of your current billing period on <strong>{endDate}</strong>.
              </Text>
            </Section>

            <Text style={text}>
              After this date, your website will be paused. We&apos;d love to hear your feedback on why you decided to cancel. Simply reply to this email to let us know.
            </Text>
            
            <Text style={text}>
              We hope to see you again soon!<br /><br />
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

const infoBox = {
  backgroundColor: '#fef3c7', // Amber-50
  borderLeft: '4px solid #f59e0b', // Amber-500
  padding: '16px 20px',
  margin: '24px 0',
  borderRadius: '0 4px 4px 0',
};

const infoText = {
  color: '#92400e', // Amber-900
  fontSize: '15px',
  margin: '0',
  lineHeight: '22px',
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
