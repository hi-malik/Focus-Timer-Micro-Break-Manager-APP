type SendEmailArgs = {
  to: string;
  subject: string;
  html: string;
};

export async function sendEmail({ to, subject, html }: SendEmailArgs): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY || process.env.SENDGRID_API_KEY || '';
  const from = process.env.EMAIL_FROM || 'noreply@example.com';
  if (!apiKey) {
    console.warn('No email API key configured. Skipping email send.');
    return;
  }
  try {
    // Resend compatible minimal client
    const endpoint = process.env.RESEND_API_KEY ? 'https://api.resend.com/emails' : '';
    if (!endpoint) {
      console.warn('Email provider endpoint not configured.');
      return;
    }
    await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from, to, subject, html }),
    });
  } catch (err) {
    console.error('sendEmail error', err);
  }
}


