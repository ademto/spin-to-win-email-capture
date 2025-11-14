import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { name, email, prize, promoCode } = await request.json();

    // Validate input
    if (!email || !prize) {
      return NextResponse.json(
        { error: 'Email and prize information required' },
        { status: 400 }
      );
    }

    // Get MailerLite API key
    const apiKey = process.env.MAILERLITE_API_KEY;

    if (!apiKey) {
      console.error('MailerLite API key not configured');
      return NextResponse.json(
        { error: 'Service configuration error' },
        { status: 500 }
      );
    }

    // Determine discount details based on prize
    let discountDescription = '';
    let discountAmount = '';
    
    if (prize === '50% OFF') {
      discountDescription = 'Use this promo code to get 50% off your purchase:';
      discountAmount = '50% discount';
    } else if (prize === '20% OFF') {
      discountDescription = 'Use this promo code to get 20% off your purchase:';
      discountAmount = '20% discount';
    } else if (prize === 'Free Product') {
      discountDescription = 'Use this promo code to claim your free product:';
      discountAmount = 'free product';
    }

    // Email content based on prize
    const emailContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #000; color: white; padding: 20px; text-align: center; }
          .content { padding: 30px; background-color: #f9f9f9; }
          .promo-code { background-color: #4CAF50; color: white; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 2px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Congratulations ${name}!</h1>
          </div>
          <div class="content">
            <h2>You Won: ${prize}</h2>
            ${promoCode ? `
              <p>${discountDescription}</p>
              <div class="promo-code">${promoCode}</div>
              <p><strong>How to redeem:</strong></p>
              <ul>
                <li>Add items to your cart</li>
                <li>Enter promo code at checkout</li>
                <li>Enjoy your ${discountAmount}!</li>
              </ul>
              <p><strong>Terms:</strong> Valid for 30 days. Cannot be combined with other offers.</p>
            ` : `
              <p>Please visit Echo & Ember to collect your prize!</p>
            `}
          </div>
          <div class="footer">
            <p>Echo & Ember - Thank you for playing!</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Note: MailerLite doesn't have a direct API to send individual emails
    // You would need to:
    // 1. Set up an automation in MailerLite dashboard that triggers on group join
    // 2. Or use a transactional email service like Resend
    
    // For now, we'll log the email content
    console.log('Email would be sent to:', email);
    console.log('Content:', emailContent);

    // TODO: Implement actual email sending
    // Option 1: Use MailerLite automation (recommended)
    // Option 2: Integrate Resend/SendGrid for transactional emails

    return NextResponse.json(
      { 
        success: true, 
        message: 'Email notification prepared',
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Email sending error:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
