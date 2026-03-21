import { NextRequest, NextResponse } from 'next/server';
import emailjs from '@emailjs/nodejs';

interface ContactPayload {
  from_name?: string;
  from_email?: string;
  subject?: string;
  message?: string;
  source?: string;
}

function missingEnv() {
  return !process.env.EMAILJS_SERVICE_ID
    || !process.env.EMAILJS_TEMPLATE_ID
    || !process.env.EMAILJS_PUBLIC_KEY
    || !process.env.EMAILJS_PRIVATE_KEY;
}

export async function POST(req: NextRequest) {
  try {
    if (missingEnv()) {
      return NextResponse.json({ error: 'Email service is not configured' }, { status: 500 });
    }

    const body = (await req.json()) as ContactPayload;
    const fromName = body.from_name?.trim() || '';
    const fromEmail = body.from_email?.trim() || '';
    const subject = body.subject?.trim() || 'Portfolio contact';
    const message = body.message?.trim() || '';

    if (!fromName || !fromEmail || !message) {
      return NextResponse.json({ error: 'Name, email, and message are required' }, { status: 400 });
    }

    if (!/^\S+@\S+\.\S+$/.test(fromEmail)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    const finalMessage = [
      '[Sent from Tech Portfolio Email app]',
      `Source: ${body.source || 'unknown'}`,
      '',
      message,
    ].join('\n');

    await emailjs.send(
      process.env.EMAILJS_SERVICE_ID!,
      process.env.EMAILJS_TEMPLATE_ID!,
      {
        from_name: fromName,
        from_email: fromEmail,
        subject,
        message: finalMessage,
      },
      {
        publicKey: process.env.EMAILJS_PUBLIC_KEY!,
        privateKey: process.env.EMAILJS_PRIVATE_KEY!,
      }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
