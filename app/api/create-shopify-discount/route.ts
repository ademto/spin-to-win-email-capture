import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { code, prizeLabel } = await request.json();

    if (!code) {
      return NextResponse.json(
        { error: 'Discount code is required' },
        { status: 400 }
      );
    }

    const shopDomain = process.env.SHOPIFY_STORE_DOMAIN;
    const accessToken = process.env.SHOPIFY_ADMIN_API_TOKEN;
    
    // Determine which price rule to use based on prize
    let priceRuleId;
    if (prizeLabel === '50% OFF') {
      priceRuleId = process.env.SHOPIFY_PRICE_RULE_ID_50;
    } else if (prizeLabel === '20% OFF') {
      priceRuleId = process.env.SHOPIFY_PRICE_RULE_ID_20;
    } else {
      // Free Product doesn't need a Shopify discount code
      return NextResponse.json({
        success: true,
        message: 'No Shopify code needed for this prize',
      });
    }

    if (!shopDomain || !accessToken || !priceRuleId) {
      console.error('Missing Shopify configuration');
      return NextResponse.json(
        { error: 'Shopify configuration incomplete' },
        { status: 500 }
      );
    }

    // Create discount code in Shopify
    const response = await fetch(
      `https://${shopDomain}/admin/api/2024-10/price_rules/${priceRuleId}/discount_codes.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': accessToken,
        },
        body: JSON.stringify({
          discount_code: {
            code: code,
            usage_limit: 1, // Single use only
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Shopify API error:', errorText);
      return NextResponse.json(
        { error: 'Failed to create discount code in Shopify' },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      discountCode: data.discount_code,
    });
  } catch (error) {
    console.error('Error creating Shopify discount:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
