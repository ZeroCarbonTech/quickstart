# 🎯 Quick Action Summary - Get Your Quickstart Running

## ✅ What We Fixed

Changed all quickstart files from:
- ❌ `https://api.zerocarbon.codes` (doesn't exist)
- ✅ `https://zerocarbon.codes/api` (your actual deployment)

## 🚀 How to Test RIGHT NOW

### Option 1: Test with Production API (if deployed)

```powershell
# Run this command:
node quickstart/index.js
```

### Option 2: Test with Local API

```powershell
# Start your Next.js dev server
npm run dev

# In another terminal:
$env:API_BASE="http://localhost:3000/api"
node quickstart/index.js
```

### Option 3: Run Full Test Suite

```powershell
# This tests everything automatically
.\test-quickstart.ps1
```

---

## 🔧 Required: Make Your API Public for Testing

Your quickstart **won't work** until these API endpoints allow unauthenticated requests:

- `/api/v1/emissions/calculate`
- `/api/v1/calculate/flight`
- `/api/v1/calculate/fuel`

### Quick Fix: Update Your Middleware

**File:** `middleware.ts` (at project root)

**Add this code:**

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
  
  // Check if this is a public testing endpoint
  const isPublicEndpoint = publicTestingEndpoints.some(
    endpoint => pathname.startsWith(endpoint)
  );
  
  if (isPublicEndpoint) {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }
    
    // Allow the request and add CORS headers
    const response = NextResponse.next();
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
    
    return response;
  }
  
  // For all other routes, your existing auth logic here
  // ... your existing middleware code
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/api/:path*',
  ],
};
```

**Then deploy:**

```powershell
npm run build
git add .
git commit -m "Enable public testing endpoints for quickstart"
git push
```

---

## 📦 Files Updated

All these files now use `https://zerocarbon.codes/api`:

1. ✅ `quickstart/index.js` - Node.js interactive demo
2. ✅ `quickstart/quickstart.py` - Python demo
3. ✅ `quickstart/web-demo.html` - Browser demo
4. ✅ `quickstart/curl-examples.sh` - cURL examples

---

## 🎯 Step-by-Step Deployment

### Step 1: Test Locally (5 minutes)

```powershell
# Make sure your API is running
npm run dev

# Test quickstart with local API
$env:API_BASE="http://localhost:3000/api"
node quickstart/index.js
```

**Expected output:**
```
╔═══════════════════════════════════════╗
║   ZeroCarbon API - Quick Start Demo   ║
╚═══════════════════════════════════════╝

🔌 Demo 1: Electricity Emissions
✅ Result: 386.5 kg CO2e
...
```

### Step 2: Deploy Web Demo (10 minutes)

```powershell
# Copy web demo to public folder
Copy-Item quickstart/web-demo.html public/quickstart-demo.html

# Deploy
npm run build
git add .
git commit -m "Add quickstart web demo"
git push

# Access at: https://zerocarbon.codes/quickstart-demo.html
```

### Step 3: Publish NPM Package (15 minutes)

```powershell
cd quickstart

# Login to NPM (create account at npmjs.com first)
npm login

# Publish
npm publish --access public

# Test
npx zerocarbon-quickstart
```

### Step 4: Deploy to Replit (10 minutes)

1. **Create GitHub repo**:
   ```powershell
   cd quickstart
   git init
   git add .
   git commit -m "ZeroCarbon API Quickstart"
   
   # Create repo on github.com, then:
   git remote add origin https://github.com/yourusername/zerocarbon-quickstart.git
   git push -u origin main
   ```

2. **Import to Replit**:
   - Go to replit.com → "Create Repl"
   - Select "Import from GitHub"
   - Enter: `yourusername/zerocarbon-quickstart`
   - Make public and get link

### Step 5: Update YC Application (5 minutes)

In your YC application, add:

**Demo URL:**
```
https://zerocarbon.codes/quickstart-demo.html
```

**In "How do you know people want your product?":**
```
Try our API right now: Run `npx zerocarbon-quickstart` in your terminal.
Or visit: https://zerocarbon.codes/quickstart-demo.html

Developers get their first emission calculation in under 60 seconds.
Zero friction—no signup, no API key, no sales call. Just code.
```

---

## 🧪 Troubleshooting

### Issue: Still seeing ENOTFOUND error

**Solution:**

```powershell
# Check if API_BASE is set correctly
$env:API_BASE="https://zerocarbon.codes/api"
node quickstart/index.js

# Or edit index.js line 11 directly:
# const API_BASE = process.env.API_BASE || 'https://zerocarbon.codes/api';
```

### Issue: Connection refused or 404 errors

**Problem:** Your API endpoints don't exist or aren't deployed

**Check:**
```powershell
# Test if your API is running
curl https://zerocarbon.codes/api/v1/emissions/calculate
```

**If it returns 404:** Your routes aren't deployed. Check:
1. Is your app deployed to production?
2. Do the routes exist in `src/app/api/v1/`?
3. Did the build succeed?

### Issue: 401 Unauthorized

**Problem:** Your API requires authentication

**Solution:** Follow the middleware fix above to make testing endpoints public

### Issue: CORS errors in browser

**Problem:** Missing CORS headers

**Solution:** Add to your API routes or middleware:
```typescript
response.headers.set('Access-Control-Allow-Origin', '*');
```

---

## 📚 Documentation

We created these guides for you:

1. **SETUP_GUIDE.md** - Complete step-by-step deployment (you're here!)
2. **DEPLOYMENT_GUIDE.md** - Detailed deployment instructions
3. **YC_APPLICATION_GUIDE.md** - How to use this in your YC application
4. **test-quickstart.ps1** - Automated testing script

---

## ✅ Quick Checklist

Before deploying:

- [ ] Test locally: `node quickstart/index.js` works
- [ ] API endpoints allow public access (no auth)
- [ ] CORS headers configured
- [ ] Web demo copied to `public/` folder
- [ ] Build succeeds: `npm run build`
- [ ] Deploy to production
- [ ] Test production: Visit `https://zerocarbon.codes/quickstart-demo.html`
- [ ] Publish NPM package (optional)
- [ ] Create Replit demo (optional)
- [ ] Update YC application

---

## 🎯 Priority Actions (Do These First)

### 1. Enable Public API Access ⭐⭐⭐

Without this, nothing else will work:

```typescript
// Add to middleware.ts
const publicTestingEndpoints = [
  '/api/v1/emissions/calculate',
  '/api/v1/calculate/flight',
  '/api/v1/calculate/fuel',
];

if (publicTestingEndpoints.some(e => pathname.startsWith(e))) {
  // Skip auth, add CORS headers
  const response = NextResponse.next();
  response.headers.set('Access-Control-Allow-Origin', '*');
  return response;
}
```

### 2. Test Locally ⭐⭐

```powershell
$env:API_BASE="http://localhost:3000/api"
node quickstart/index.js
```

### 3. Deploy Web Demo ⭐

```powershell
Copy-Item quickstart/web-demo.html public/quickstart-demo.html
npm run build
git push
```

---

## 🚀 You're Ready!

Once you complete the priorities above:

1. Your quickstart will work locally and in production
2. You can test with: `node quickstart/index.js`
3. You can share: `https://zerocarbon.codes/quickstart-demo.html`
4. You can add to YC application
5. You can publish to NPM and Replit

**Need help?** Check [SETUP_GUIDE.md](SETUP_GUIDE.md) for detailed instructions.

---

## 💡 Quick Test Command

```powershell
# Test everything at once
.\test-quickstart.ps1

# Or test just the Node.js demo
node quickstart/index.js

# Or test with production API
$env:API_BASE="https://zerocarbon.codes/api"
node quickstart/index.js
```

**That's it! You're all set! 🎉**
