/**
 * One-time script to create the Shopify Price Rule for $50 discount codes
 * Run with: npx tsx scripts/setup-shopify-price-rule.ts
 */

import { config } from 'dotenv';
import { resolve } from 'path';

// Load .env.local
config({ path: resolve(process.cwd(), '.env.local') });

async function createPriceRule() {
  const shopDomain = process.env.SHOPIFY_STORE_DOMAIN;
  const accessToken = process.env.SHOPIFY_ADMIN_API_TOKEN;

  if (!shopDomain || !accessToken) {
    console.error('❌ Missing Shopify credentials in .env.local');
    console.error('Make sure SHOPIFY_STORE_DOMAIN and SHOPIFY_ADMIN_API_TOKEN are set');
    process.exit(1);
  }

  const priceRule = {
    price_rule: {
      title: 'Spin Wheel $50 Gift',
      target_type: 'line_item',
      target_selection: 'all',
      allocation_method: 'across',
      value_type: 'fixed_amount',
      value: '-50.0',
      customer_selection: 'all',
      once_per_customer: false,
      prerequisite_subtotal_range: {
        greater_than_or_equal_to: '100.0'
      },
      starts_at: new Date().toISOString(),
    }
  };

  try {
    console.log('🔧 Creating Shopify Price Rule...\n');
    
    const response = await fetch(
      `https://${shopDomain}/admin/api/2024-10/price_rules.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': accessToken,
        },
        body: JSON.stringify(priceRule),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Shopify API error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    const priceRuleId = data.price_rule.id;

    console.log('✅ Price Rule created successfully!\n');
    console.log('📋 Price Rule Details:');
    console.log(`   ID: ${priceRuleId}`);
    console.log(`   Title: ${data.price_rule.title}`);
    console.log(`   Discount: $50 off`);
    console.log(`   Minimum purchase: $100`);
    console.log('\n📝 Add this to your .env.local file:\n');
    console.log(`SHOPIFY_PRICE_RULE_ID=${priceRuleId}`);
    console.log('\n');

  } catch (error) {
    console.error('❌ Error creating price rule:', error);
    process.exit(1);
  }
}

createPriceRule();
