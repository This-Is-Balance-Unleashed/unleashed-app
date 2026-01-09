# Webhook Testing Scripts

This directory contains scripts to help you test Paystack webhooks locally.

## 🧪 Test Mode

When running on **localhost** (development), all Paystack transaction references are automatically prefixed with `test_` to distinguish them from production transactions:

- **Development:** `test_1736445123456_abc123`
- **Production:** `1736445123456_abc123`

### What Happens in Test Mode

✅ **Tickets are created** - Test purchases create real ticket records in the database
✅ **QR codes are generated** - Each ticket gets a unique QR code
✅ **Webhooks are processed** - Full webhook flow is executed
❌ **Quantity is NOT deducted** - Test purchases don't affect `sold_quantity` counter
❌ **Coupons are NOT consumed** - Test purchases don't increment coupon usage

This means you can test the complete purchase flow without affecting actual inventory or coupon availability!

## Method 1: Simulate Webhook (Quick Testing)

This script creates a fake Paystack webhook with proper signature to test your webhook handler locally.

### Usage:

```bash
# 1. Start your dev server
bun run dev

# 2. In another terminal, run the test script
bun run test:webhook
```

### What it does:
- Creates a sample `charge.success` webhook payload
- Generates proper HMAC SHA512 signature
- Sends POST request to your local webhook endpoint
- Shows the response from your webhook handler

### Customize the payload:
Edit `scripts/test-webhook.ts` to change:
- Customer name (`customer_first_name`, `customer_last_name`)
- Email
- Amount
- Event/Ticket IDs
- Metadata

---

## Method 2: Capture Real Webhooks (Production-like Testing)

This script runs a separate server that captures real webhook data from Paystack test mode.

### Usage:

```bash
# 1. Start the capture server
bun run webhook:capture

# 2. In another terminal, expose it with ngrok
ngrok http 3001

# 3. Copy the ngrok URL (e.g., https://abc123.ngrok.io)

# 4. Go to Paystack Dashboard:
#    - Settings → Webhooks
#    - Add webhook URL: https://abc123.ngrok.io/webhook

# 5. Make a test purchase using Paystack test cards:
#    - Card: 4084 0840 8408 4081
#    - CVV: 408
#    - Expiry: 12/30
#    - PIN: 0000

# 6. Watch the capture server console for webhook data!
```

### What it does:
- Runs a server on port 3001
- Validates webhook signatures
- Logs complete webhook payload to console
- Saves payloads to `scripts/captures/*.json` for later use
- Shows you EXACTLY what Paystack sends

---

## Method 3: Use ngrok with Your Dev Server (Full Integration Testing)

Test the actual webhook endpoint in your Next.js app with real Paystack webhooks.

### Usage:

```bash
# 1. Start your dev server
bun run dev

# 2. In another terminal, expose it
ngrok http 3000

# 3. Configure Paystack webhook URL:
#    https://abc123.ngrok.io/api/webhooks/paystack

# 4. Make a test purchase
```

This tests the complete flow with your actual webhook handler.

---

## Paystack Test Cards

Use these test cards in Paystack test mode:

| Card Number | CVV | Expiry | PIN | Result |
|-------------|-----|--------|-----|--------|
| 4084 0840 8408 4081 | 408 | 12/30 | 0000 | Success |
| 5060 6666 6666 6666 4 | 123 | 12/30 | 1234 | Success (Requires PIN) |
| 5078 5078 5078 5078 03 | 081 | 12/30 | 1111 | Insufficient funds |

More test cards: https://paystack.com/docs/payments/test-payments

---

## Troubleshooting

### Webhook not received?
- ✅ Check that ngrok is running
- ✅ Verify webhook URL in Paystack dashboard
- ✅ Make sure your dev server is running
- ✅ Check firewall/network settings

### Signature validation failing?
- ✅ Ensure `PAYSTACK_SECRET_KEY` is set correctly in `.env`
- ✅ Don't modify the webhook body before validation
- ✅ Use your test secret key for test mode webhooks

### Names not showing in database?
- ✅ Check server logs for the webhook payload
- ✅ Verify `customer_first_name` and `customer_last_name` in metadata
- ✅ Check if `customer.first_name` exists in the payload
- ✅ Review the logs from the test scripts above

---

## Files

- `test-webhook.ts` - Simulate webhook locally
- `capture-webhook.ts` - Capture real webhook data
- `captures/*.json` - Saved webhook payloads (gitignored)
