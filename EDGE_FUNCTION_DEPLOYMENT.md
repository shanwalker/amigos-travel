# Supabase Edge Function Deployment Guide

## Prerequisites
- Supabase CLI installed
- Supabase project set up
- Resend API account

## Installation

### 1. Install Supabase CLI
```bash
npm install -g supabase
```

### 2. Login to Supabase
```bash
supabase login
```

### 3. Link Your Project
```bash
supabase link --project-ref YOUR_PROJECT_REF
```

## Setting Up Resend API

### 1. Get Resend API Key
1. Go to [resend.com](https://resend.com)
2. Sign up or log in
3. Navigate to API Keys
4. Create a new API key
5. Copy the key (starts with `re_`)

### 2. Set Environment Variable
```bash
supabase secrets set RESEND_API_KEY=re_your_api_key_here
```

### 3. Verify Domain (Important!)
1. In Resend dashboard, add your domain
2. Add DNS records as instructed
3. Verify domain ownership
4. Update the `from` email in the Edge Function to use your verified domain

## Deploying the Function

### 1. Deploy
```bash
supabase functions deploy send-proposal-email
```

### 2. Verify Deployment
```bash
supabase functions list
```

## Testing the Function

### Test with cURL
```bash
curl -i --location --request POST 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/send-proposal-email' \
  --header 'Authorization: Bearer YOUR_ANON_KEY' \
  --header 'Content-Type: application/json' \
  --data '{
    "to": "test@example.com",
    "userName": "John Doe",
    "proposalId": "123",
    "destinationName": "Bali",
    "proposalUrl": "https://yourapp.com/proposals/123",
    "expiryDate": "2026-03-01"
  }'
```

## Troubleshooting

### Function Not Found
- Ensure deployment was successful
- Check function name matches exactly
- Verify project is linked correctly

### Email Not Sending
- Verify RESEND_API_KEY is set correctly
- Check domain is verified in Resend
- Review function logs: `supabase functions logs send-proposal-email`
- Ensure `from` email uses verified domain

### CORS Errors
- The function includes CORS headers
- If issues persist, check your app's origin is allowed

## Monitoring

### View Logs
```bash
supabase functions logs send-proposal-email --tail
```

### Check Invocations
View in Supabase Dashboard → Edge Functions → send-proposal-email

## Production Checklist

- [ ] Resend API key set as secret
- [ ] Domain verified in Resend
- [ ] Function deployed successfully
- [ ] Test email sent and received
- [ ] Error handling tested
- [ ] Logs monitored for issues
- [ ] Rate limits configured in Resend (if needed)

## Cost Considerations

**Resend Pricing:**
- Free tier: 100 emails/day
- Paid plans start at $20/month for 50,000 emails

**Supabase Edge Functions:**
- Free tier: 500,000 invocations/month
- Paid plans available for higher usage

## Alternative: Using Supabase Auth Emails

If you prefer not to use Resend, you can use Supabase's built-in email service:

1. Configure SMTP in Supabase Dashboard → Authentication → Email Templates
2. Modify the Edge Function to use Supabase's email API
3. Note: Less customization but simpler setup

## Support

- Resend Docs: https://resend.com/docs
- Supabase Edge Functions: https://supabase.com/docs/guides/functions
- Supabase CLI: https://supabase.com/docs/reference/cli
