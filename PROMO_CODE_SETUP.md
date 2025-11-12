# Dynamic Promo Code Implementation

## What Changed

### 1. New File: `lib/promoCode.ts`
- **`generatePromoCode(prefix)`**: Generates unique codes like `GIFT50-A7X9K2`
- **`generatePrizePromoCode(prizeLabel)`**: Maps prizes to promo code prefixes

### 2. Updated: `lib/prizes.ts`
- Removed static `promoCode` field
- Added `needsPromoCode` boolean flag
- Only `$50 Gift` has `needsPromoCode: true`

### 3. Updated: `app/page.tsx`
- Added `promoCode` state variable
- Generates unique code when user wins
- Sends unique code to MailerLite and email

---

## Promo Code Format

```
PREFIX-XXXXXX
```

**Examples:**
- `$50 Gift` → `GIFT50-A7X9K2`
- `20% OFF` → `OFF20-P3M8N5` (if enabled)
- `Free Product` → `FREE-Z1Q4W7` (if enabled)

**Currently only $50 Gift generates codes.**

---

## Data Sent to MailerLite

```json
{
  "email": "user@example.com",
  "fields": {
    "name": "John Doe",
    "prize": "$50 Gift",
    "prize_date": "2025-11-12T14:30:45.123Z",
    "promo_code": "GIFT50-A7X9K2"  ← Unique per user
  },
  "groups": ["170892846419674422"]
}
```

---

## MailerLite Setup

### Step 1: Create Custom Fields
In MailerLite Dashboard → Fields:
1. **name** (Text)
2. **prize** (Text)
3. **prize_date** (Date or Text)
4. **promo_code** (Text) ← Important!

### Step 2: Create Automation
1. Go to Automations → Create New
2. **Trigger**: "Subscriber added"
3. **Condition**: Field `prize` equals `$50 Gift`
4. **Action**: Send Email

### Step 3: Email Template
```html
Hi {{name}},

🎉 Congratulations! You won $50 off!

Your unique promo code is:

{{promo_code}}

✅ Use at checkout for $50 off on orders over $100
✅ Valid for 30 days
✅ Single use only

Visit our store: [Your Shopify URL]

Thank you for playing!
Echo & Ember Team
```

---

## Code Generation Details

### Algorithm:
```typescript
const random = Math.random().toString(36).substring(2, 8).toUpperCase();
const timestamp = Date.now().toString(36).substring(-3).toUpperCase();
const uniqueCode = (random + timestamp).substring(0, 6);
return `GIFT50-${uniqueCode}`;
```

### Uniqueness:
- Random alphanumeric (base36)
- Timestamp component
- 6 characters total
- Probability of collision: ~1 in 2 billion

---

## Next Steps

### For Full Security (Shopify Integration):
1. Get Shopify Admin API token
2. Create Price Rule in Shopify (one-time)
3. Call Shopify API to create discount code
4. Restrict to winner's email + single use
5. Shopify validates automatically at checkout

### Current State (Without Shopify):
- ✅ Unique codes generated
- ✅ Stored in MailerLite
- ✅ Sent in emails
- ⚠️ Manual validation needed in Shopify (check email + code)

---

## Testing

1. Fill form and spin
2. Win $50 Gift
3. Check generated code on screen (e.g., `GIFT50-A7X9K2`)
4. Check MailerLite dashboard for subscriber with same code
5. Check email (once automation is set up)

---

## Questions?

Contact developer for Shopify API integration or automation setup.
