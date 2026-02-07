# ZeroCarbon API - 5 Minute Quickstart

Get your first carbon footprint calculation in **under 5 minutes**. No signup required for testing.

## 🚀 One-Line Demos

### Option 1: Node.js (Fastest)
```bash
npx zerocarbon-quickstart
```

### Option 2: Python
```bash
pip install zerocarbon && python -m zerocarbon.quickstart
```

### Option 3: cURL (Zero Installation)
```bash
curl -X POST https://api.zerocarbon.codes/v1/emissions/calculate \
  -H "Content-Type: application/json" \
  -d '{"source":"electricity","value":1000,"unit":"kWh","country":"US"}'
```

---

## 🎮 Interactive Demos

### Try on Replit
[![Run on Replit](https://replit.com/badge/github/zerocarbon/quickstart)](https://replit.com/@zerocarbon/quickstart)

### Try on CodeSandbox
[![Open in CodeSandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/zerocarbon/quickstart)

---

## 📖 5-Minute Tutorial

### Step 1: Calculate Emissions (No Auth Needed)

**Node.js**
```javascript
const axios = require('axios');

const response = await axios.post('https://api.zerocarbon.codes/v1/emissions/calculate', {
  source: 'electricity',
  value: 1000,
  unit: 'kWh',
  country: 'US'
});

console.log(`Your emissions: ${response.data.emissions_kg_co2e} kg CO2e`);
// Output: Your emissions: 386.5 kg CO2e
```

**Python**
```python
import requests

response = requests.post('https://api.zerocarbon.codes/v1/emissions/calculate', 
    json={
        'source': 'electricity',
        'value': 1000,
        'unit': 'kWh',
        'country': 'US'
    }
)

print(f"Your emissions: {response.json()['emissions_kg_co2e']} kg CO2e")
# Output: Your emissions: 386.5 kg CO2e
```

### Step 2: Calculate Real-World Scenarios

**Flight Emissions**
```bash
curl -X POST https://api.zerocarbon.codes/v1/calculate/flight \
  -H "Content-Type: application/json" \
  -d '{
    "from": "SFO",
    "to": "JFK",
    "passengers": 1,
    "class": "economy"
  }'
```

**Vehicle Emissions**
```javascript
const emissions = await fetch('https://api.zerocarbon.codes/v1/calculate/fuel', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    fuel_type: 'gasoline',
    distance: 100,
    unit: 'miles'
  })
});
```

### Step 3: Get Free API Key (30 seconds)

For persistent tracking and dashboard access:

```bash
# Sign up via API (no email verification needed)
curl -X POST https://api.zerocarbon.codes/v1/demo-request \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Your Name",
    "email": "you@company.com",
    "company": "Your Company"
  }'

# Instant API key in response:
# { "api_key": "zc_xxxxx", "dashboard_url": "https://app.zerocarbon.codes" }
```

---

## 🏗️ Complete Example Apps

### Express.js Server (3 minutes)
```bash
git clone https://github.com/zerocarbon/examples
cd examples/nodejs-express
npm install && npm start
```

### Flask API (3 minutes)
```bash
git clone https://github.com/zerocarbon/examples
cd examples/python-flask
pip install -r requirements.txt && python app.py
```

### Next.js Dashboard (5 minutes)
```bash
git clone https://github.com/zerocarbon/examples
cd examples/nextjs-dashboard
npm install && npm run dev
```

---

## 🎯 Common Use Cases

### Scenario 1: E-commerce Carbon Labels
```javascript
// Add carbon footprint to product pages
const getShippingEmissions = async (weight, distance) => {
  const res = await fetch('https://api.zerocarbon.codes/v1/calculate/shipping', {
    method: 'POST',
    body: JSON.stringify({ weight_kg: weight, distance_km: distance })
  });
  return res.json();
};

// Display: "This shipment produces 2.3 kg CO2e"
```

### Scenario 2: SaaS Carbon Dashboard
```javascript
// Track your infrastructure emissions
const trackCloudEmissions = async () => {
  const emissions = await zerocarbon.calculate({
    source: 'aws_compute',
    instance_hours: 730,
    region: 'us-east-1'
  });
  
  await zerocarbon.emissions.save({
    category: 'cloud_infrastructure',
    value: emissions.kg_co2e
  });
};
```

### Scenario 3: Travel Booking Carbon Offset
```javascript
// Offer carbon offsets at checkout
const flight = await zerocarbon.calculate.flight({
  from: 'LAX',
  to: 'LHR',
  passengers: 2
});

const offsetCost = flight.emissions_kg_co2e * 0.015; // $15 per tonne
// Show: "Add carbon offset for $22.50?"
```

---

## 📊 What You Get

- **Instant calculations** - No rate limits for testing
- **200+ emission factors** - Electricity, fuel, flights, shipping, etc.
- **Global coverage** - Country-specific emission factors
- **GHG Protocol compliant** - Scope 1, 2, 3 classifications
- **Auto-generated reports** - BRSR, SEC, TCFD, CDP formats

---

## 💡 Why Developers Love It

✅ **No authentication** for quick testing  
✅ **RESTful API** with predictable endpoints  
✅ **JSON in, JSON out** - No XML, no SOAP  
✅ **Native SDKs** for Node.js, Python, Go, Ruby  
✅ **Webhook support** for async calculations  
✅ **OpenAPI spec** for auto-generating clients  

---

## 🔗 Next Steps

- [Full API Documentation](https://docs.zerocarbon.codes)
- [Interactive API Explorer](https://api.zerocarbon.codes/playground)
- [Example Applications](https://github.com/zerocarbon/examples)
- [Get Production API Key](https://app.zerocarbon.codes/signup)

---

## 💬 Questions?

- Discord: [discord.gg/zerocarbon](https://discord.gg/zerocarbon)
- Email: developers@zerocarbon.codes
- Docs: [docs.zerocarbon.codes](https://docs.zerocarbon.codes)

**Try it now:** `npx zerocarbon-quickstart`
