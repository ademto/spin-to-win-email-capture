import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.MAILERLITE_API_KEY;

    if (!apiKey) {
      console.error('MailerLite API key not configured');
      return NextResponse.json(
        { error: 'Service configuration error' },
        { status: 500 }
      );
    }

    // Check if subscriber exists in MailerLite
    const response = await fetch(
      `https://connect.mailerlite.com/api/subscribers/${encodeURIComponent(email)}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.ok) {
      // Email exists
      return NextResponse.json(
        { exists: true, error: 'This email has already been used. Only one spin per email!' },
        { status: 409 }
      );
    }

    if (response.status === 404) {
      // Email doesn't exist - good to go
      return NextResponse.json(
        { exists: false },
        { status: 200 }
      );
    }

    // Other error
    console.error('MailerLite check error:', await response.text());
    return NextResponse.json(
      { error: 'Failed to verify email' },
      { status: 500 }
    );

  } catch (error) {
    console.error('Email check error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
