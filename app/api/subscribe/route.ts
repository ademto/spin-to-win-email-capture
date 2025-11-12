import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { name, email, prize } = await request.json();

    // Validate input
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    // Get API key from environment
    const apiKey = process.env.MAILERLITE_API_KEY;
    const groupId = process.env.MAILERLITE_GROUP_ID;

    if (!apiKey) {
      console.error('MailerLite API key not configured');
      return NextResponse.json(
        { error: 'Service configuration error' },
        { status: 500 }
      );
    }

    // Prepare subscriber data
    const subscriberData: any = {
      email: email,
      fields: {
        name: name,
      },
    };

    // Add prize information if provided
    if (prize) {
      subscriberData.fields.prize = prize;
      subscriberData.fields.prize_date = new Date().toISOString();
    }

    // Add to group if groupId is provided
    if (groupId) {
      subscriberData.groups = [groupId];
    }

    // Call MailerLite API
    const response = await fetch('https://connect.mailerlite.com/api/subscribers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(subscriberData),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('MailerLite API error:', data);
      
      // Check if subscriber already exists
      if (response.status === 422 || data.message?.includes('already exists')) {
        return NextResponse.json(
          { error: 'This email has already been used. Only one spin per email!' },
          { status: 409 }
        );
      }

      return NextResponse.json(
        { error: 'Failed to subscribe. Please try again.' },
        { status: response.status }
      );
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'Successfully subscribed!',
        subscriber: data.data 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Subscription error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
