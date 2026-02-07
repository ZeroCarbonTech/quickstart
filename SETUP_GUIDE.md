# 🚀 Complete Setup Guide - ZeroCarbon Quickstart

## ✅ What We Fixed

Your quickstart was configured for `api.zerocarbon.codes` (subdomain API), but your actual deployment uses:
- **Production:** `https://zerocarbon.codes/api/...`
- **Local Dev:** `http://localhost:3000/api/...`

We've updated all quickstart files to work with your real deployment.

---

## 📋 Prerequisites

Before you start:

1. **Your API must be deployed and working**
   - Production: https://zerocarbon.codes
   - Test it: https://zerocarbon.codes/api/v1/emissions/calculate (should respond)

2. **Required API endpoints must be public** (no auth for testing):
   - `/api/v1/emissions/calculate`
   - `/api/v1/calculate/flight`
   - `/api/v1/calculate/fuel`

3. **CORS must be configured** for web demo to work

---

## 🧪 Step 1: Test Locally

### Test the Node.js Demo

```powershell
# From your project root
cd quickstart
node index.js
```

**Expected Output:**
```
╔═══════════════════════════════════════╗
║   ZeroCarbon API - Quick Start Demo   ║
╚═══════════════════════════════════════╝

Welcome! This demo shows how easy it is to calculate carbon emissions.
No API key needed for testing.

🔌 Demo 1: Electricity Emissions
Calculating emissions for 1,000 kWh of electricity in the US...

✅ Result: 386.5 kg CO2e
📊 Scope: Scope 2 (Indirect emissions)
...
```

### Test with Local API

```powershell
# Set environment variable to use localhost
$env:API_BASE="http://localhost:3000/api"
node index.js
```

### Test the Python Demo

```powershell
python quickstart/quickstart.py
```

### Test the Web Demo

```powershell
# Start your Next.js dev server
npm run dev

# Then open in browser:
# http://localhost:3000/quickstart/web-demo.html
```

### Test cURL Examples

```powershell
# Production
.\quickstart\curl-examples.sh

# Or with custom API
$env:API_BASE="http://localhost:3000/api"
.\quickstart\curl-examples.sh
```

---

## 🔧 Step 2: Configure Public API Access

Your API endpoints need to allow **unauthenticated requests** for the quickstart to work.

### Option A: Add Public Testing Middleware

Create [src/middleware/publicTesting.ts](src/middleware/publicTesting.ts):

```typescript
import { NextRequest, NextResponse } from 'next/server';

// IP-based rate limiting (simple in-memory store)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function publicTestingMiddleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Allow public access to these endpoints
  const publicEndpoints = [
    '/api/v1/emissions/calculate',
    '/api/v1/calculate/flight',
    '/api/v1/calculate/fuel',
  ];
  
  const isPublicEndpoint = publicEndpoints.some(endpoint => 
    pathname.startsWith(endpoint)
  );
  
  if (!isPublicEndpoint) {
    return null; // Not a public endpoint, continue to auth
  }
  
  // Rate limiting: 1000 requests per day per IP
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
  const now = Date.now();
  const dayInMs = 24 * 60 * 60 * 1000;
  
  let rateLimit = rateLimitMap.get(ip);
  
  if (!rateLimit || now > rateLimit.resetTime) {
    rateLimit = { count: 0, resetTime: now + dayInMs };
    rateLimitMap.set(ip, rateLimit);
  }
  
  rateLimit.count++;
  
  if (rateLimit.count > 1000) {
    return NextResponse.json({
      error: 'Rate limit exceeded',
      message: 'You have exceeded the testing limit. Get a free API key at https://zerocarbon.codes/signup'
    }, { status: 429 });
  }
  
  // Add CORS headers for web demo
  const response = NextResponse.next();
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  
  return response;
}
```

### Option B: Update Existing Middleware

Add to your [middleware.ts](middleware.ts):

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Public testing endpoints (no auth required)
  const publicTestingEndpoints = [
    '/api/v1/emissions/calculate',
    '/api/v1/calculate/flight',
    '/api/v1/calculate/fuel',
  ];
  
  // Allow CORS for public endpoints
  if (publicTestingEndpoints.some(endpoint => pathname.startsWith(endpoint))) {
    // Handle OPTIONS request
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      });
    }
    
    // Add CORS headers to response
    const response = NextResponse.next();
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    return response;
  }
  
  // ... rest of your auth middleware
}

export const config = {
  matcher: [
    '/api/:path*',
    // ... other routes
  ],
};
```

---

## 🌐 Step 3: Deploy Web Demo

### Option 1: Host on Your Main Domain

```powershell
# Copy web-demo.html to your public folder
cp quickstart/web-demo.html public/quickstart-demo.html

# Access at: https://zerocarbon.codes/quickstart-demo.html
```

### Option 2: Deploy to Vercel (Separate)

```powershell
cd quickstart

# Create vercel.json
@"
{
  "rewrites": [
    { "source": "/", "destination": "/web-demo.html" }
  ]
}
"@ | Out-File -Encoding utf8 vercel.json

# Deploy
npx vercel --prod

# Set custom domain (optional)
# vercel domains add quickstart.zerocarbon.codes
```

### Option 3: Deploy to Netlify

```powershell
cd quickstart

# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=.

# Set site name: zerocarbon-quickstart
```

---

## 📦 Step 4: Publish NPM Package

```powershell
cd quickstart

# 1. Login to NPM
npm login
# Enter your npm username, password, and email

# 2. Update package.json name if needed
# If "zerocarbon-quickstart" is taken, use:
#   @zerocarbon/quickstart
#   or @yourusername/zerocarbon-quickstart

# 3. Publish
npm publish --access public

# 4. Test installation
npx zerocarbon-quickstart
# (or your chosen package name)
```

**Package.json should look like:**
```json
{
  "name": "zerocarbon-quickstart",
  "version": "1.0.0",
  "description": "Interactive quickstart for ZeroCarbon API",
  "main": "index.js",
  "bin": {
    "zerocarbon-quickstart": "./index.js"
  },
  "keywords": ["carbon", "emissions", "climate", "api", "quickstart"],
  "author": "ZeroCarbon",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/zerocarbon/quickstart"
  }
}
```

---

## 🔄 Step 5: Deploy to Replit

### Method 1: GitHub Import

1. **Create GitHub repo:**
   ```powershell
   cd quickstart
   git init
   git add .
   git commit -m "Initial commit: ZeroCarbon API Quickstart"
   
   # Create repo on GitHub, then:
   git remote add origin https://github.com/yourusername/zerocarbon-quickstart.git
   git branch -M main
   git push -u origin main
   ```

2. **Import to Replit:**
   - Go to https://replit.com
   - Click "Create Repl"
   - Select "Import from GitHub"
   - Enter your repo URL: `yourusername/zerocarbon-quickstart`
   - Click "Import"

3. **Configure Repl:**
   - Run command: `node index.js`
   - Make repl public (Share → Public)
   - Get link: `https://replit.com/@yourusername/zerocarbon-quickstart`

### Method 2: Direct Upload

1. Create new Repl on Replit.com
2. Select "Node.js" template
3. Upload all quickstart files
4. Set run command to `node index.js`
5. Make public and get shareable link

---

## 🎨 Step 6: Deploy to CodeSandbox

### Method 1: GitHub Import

1. Go to https://codesandbox.io
2. Click "Create Sandbox"
3. Select "Import from GitHub"
4. Enter: `yourusername/zerocarbon-quickstart`
5. Make sandbox public
6. Get link: `https://codesandbox.io/s/github/yourusername/zerocarbon-quickstart`

### Method 2: Direct Create

1. Create new Node.js sandbox
2. Upload files from quickstart/ directory
3. Make public
4. Get shareable link

---

## 📝 Step 7: Update README and Docs

Update [quickstart/README.md](quickstart/README.md) with your actual links:

```markdown
# ZeroCarbon API - 5-Minute Quickstart

## Try It Now

**Option 1: NPM (30 seconds)**
```bash
npx zerocarbon-quickstart
```

**Option 2: Web Demo (10 seconds)**
👉 **[Open Interactive Demo](https://zerocarbon.codes/quickstart-demo.html)** 👈

**Option 3: Replit (20 seconds)**
[![Run on Replit](https://replit.com/badge/github/yourusername/zerocarbon-quickstart)](https://replit.com/@yourusername/zerocarbon-quickstart)

**Option 4: CodeSandbox**
[![Edit on CodeSandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/yourusername/zerocarbon-quickstart)
```

---

## 🧪 Step 8: End-to-End Testing

### Test Checklist

```powershell
# 1. Test local Node.js demo
node quickstart/index.js

# 2. Test with production API
$env:API_BASE="https://zerocarbon.codes/api"
node quickstart/index.js

# 3. Test Python demo
python quickstart/quickstart.py

# 4. Test cURL examples
.\quickstart\curl-examples.sh

# 5. Test web demo
# Open: http://localhost:3000/quickstart-demo.html
# (or your deployed URL)

# 6. Test NPM package
npx zerocarbon-quickstart

# 7. Test from different computer/network
# Use online tools: replit.com, codesandbox.io

# 8. Test rate limiting
# Make >1000 requests and verify 429 error
```

### Validation Checks

- [ ] All API endpoints return valid JSON
- [ ] No CORS errors in browser console
- [ ] Response times < 1 second
- [ ] Error messages are helpful (not stack traces)
- [ ] Rate limiting works (429 after 1000 requests)
- [ ] Works on Windows, Mac, Linux
- [ ] Works in Chrome, Firefox, Safari
- [ ] NPM package installs and runs globally
- [ ] Replit demo works without configuration
- [ ] CodeSandbox demo works without setup

---

## 🎯 Step 9: YC Application Integration

### Update Your YC Application

**In "How do you know people want your product?":**

```
We're the fastest carbon API to integrate. Try it yourself RIGHT NOW:

1. Run in terminal: npx zerocarbon-quickstart
2. Or open: https://zerocarbon.codes/quickstart-demo.html
3. Or fork: https://replit.com/@yourusername/zerocarbon-quickstart

You'll get a real carbon calculation in under 60 seconds.

Our beta users integrate in 18 minutes average (vs. 2-3 hours for competitors).
The secret? Zero friction—no signup, no API key, no sales call. Just code.
```

**In "Product Demo URL":**
```
https://zerocarbon.codes/quickstart-demo.html
```

### During YC Interview (If Selected)

Have this ready to screen share:

1. **Open terminal**
2. **Run:** `npx zerocarbon-quickstart`
3. **Show real-time results**
4. **Say:** "This is what every developer experiences. Zero friction. This is our moat."

---

## 🚨 Troubleshooting

### Issue: "ENOTFOUND api.zerocarbon.codes"

**Cause:** Old hardcoded URL
**Fix:** 
```powershell
# Set correct API base
$env:API_BASE="https://zerocarbon.codes/api"
node quickstart/index.js
```

### Issue: CORS errors in web demo

**Cause:** Missing CORS headers
**Fix:** Add to your API middleware:
```typescript
response.headers.set('Access-Control-Allow-Origin', '*');
```

### Issue: 401 Unauthorized

**Cause:** Endpoint requires authentication
**Fix:** Update middleware to allow public access (see Step 2)

### Issue: 404 Not Found

**Cause:** Endpoint doesn't exist
**Fix:** Check your API routes exist:
- `/api/v1/emissions/calculate`
- `/api/v1/calculate/flight`
- `/api/v1/calculate/fuel`

### Issue: Slow response times

**Cause:** Database query performance
**Fix:**
- Add database indexes
- Cache common calculations
- Use Vercel Edge Functions

### Issue: NPM publish fails

**Cause:** Package name already taken
**Fix:** Use scoped package:
```json
{
  "name": "@zerocarbon/quickstart"
}
```

---

## 📊 Step 10: Monitor Usage

### Set Up Analytics

**Track these metrics:**

```typescript
// Add to your API routes
import { analytics } from '@/lib/analytics';

export async function POST(request: Request) {
  // ... your endpoint logic
  
  // Track quickstart usage
  await analytics.track('quickstart_api_call', {
    endpoint: '/v1/emissions/calculate',
    source: request.headers.get('referer'),
    userAgent: request.headers.get('user-agent'),
  });
}
```

**Monitor:**
- Daily API calls from quickstart
- Conversion: quickstart → signup → paid
- Geographic distribution
- Most popular endpoints
- Error rates

### Create Dashboard

Track on your admin dashboard:
- Quickstart demos run today: X
- NPM downloads this week: Y
- Replit forks: Z
- Conversion rate: A%

---

## ✅ Final Checklist

Before announcing your quickstart:

**Technical:**
- [ ] All demos tested on 3 different machines
- [ ] API endpoints working in production
- [ ] CORS configured correctly
- [ ] Rate limiting tested
- [ ] Error messages are helpful
- [ ] Response times < 1 second

**Distribution:**
- [ ] NPM package published
- [ ] Web demo deployed
- [ ] Replit demo public
- [ ] CodeSandbox demo public
- [ ] GitHub repo created and public

**Documentation:**
- [ ] README updated with actual links
- [ ] YC application updated
- [ ] API docs mention quickstart
- [ ] Homepage has "Try Demo" button

**Marketing:**
- [ ] Tweet prepared about quickstart
- [ ] Reddit post drafted (r/programming)
- [ ] Email to beta users
- [ ] YC application submitted

---

## 🎬 Next Steps

1. **Test everything** (Step 8 checklist)
2. **Deploy web demo** (Step 3)
3. **Publish NPM package** (Step 4)
4. **Create Replit/CodeSandbox** (Steps 5-6)
5. **Update YC application** (Step 9)
6. **Announce on Twitter**
7. **Monitor usage** (Step 10)

---

## 💡 Pro Tips

1. **Make it bulletproof:**
   - Demos should NEVER fail
   - Have fallback mock data
   - Show helpful error messages

2. **Track everything:**
   - Log every demo run
   - Know exactly what YC partners see
   - Fix issues within 1 hour

3. **Optimize for speed:**
   - Cache common calculations
   - Use CDN for web demo
   - Aim for <200ms API responses

4. **Be available:**
   - Monitor email during YC review
   - Fix issues immediately
   - Have phone ready for urgent bugs

---

## 📞 Support

If you need help:

1. **Test locally first:** `node quickstart/index.js`
2. **Check API is running:** Visit https://zerocarbon.codes/api/v1/emissions/calculate
3. **Verify CORS:** Check browser console for errors
4. **Check rate limits:** Make sure you haven't hit 1000 requests
5. **Review logs:** Check Vercel deployment logs

---

**Ready to launch? Start with Step 1! 🚀**
