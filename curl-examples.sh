#!/bin/bash
# ZeroCarbon API - cURL Examples
# No API key needed for quick testing

# Use environment variable or default to production
API_BASE="${API_BASE:-https://zerocarbon.codes/api}"

echo "╔═══════════════════════════════════════╗"
echo "║   ZeroCarbon API - cURL Examples      ║"
echo "╚═══════════════════════════════════════╝"
echo ""

# Example 1: Electricity Emissions
echo "🔌 Example 1: Electricity Emissions"
echo "Request: 1,000 kWh in the US"
echo ""
curl -X POST $API_BASE/v1/emissions/calculate \
  -H "Content-Type: application/json" \
  -d '{
    "source": "electricity",
    "value": 1000,
    "unit": "kWh",
    "country": "US"
  }' | jq
echo ""
echo "─────────────────────────────────────────"
echo ""

# Example 2: Vehicle Emissions
echo "🚗 Example 2: Vehicle Emissions"
echo "Request: 100 miles of gasoline driving"
echo ""
curl -X POST $API_BASE/v1/calculate/fuel \
  -H "Content-Type: application/json" \
  -d '{
    "fuel_type": "gasoline",
    "distance": 100,
    "unit": "miles",
    "vehicle_type": "car"
  }' | jq
echo ""
echo "─────────────────────────────────────────"
echo ""

# Example 3: Flight Emissions
echo "✈️  Example 3: Flight Emissions"
echo "Request: SFO to JFK economy class"
echo ""
curl -X POST $API_BASE/v1/calculate/flight \
  -H "Content-Type: application/json" \
  -d '{
    "from": "SFO",
    "to": "JFK",
    "passengers": 1,
    "class": "economy"
  }' | jq
echo ""
echo "─────────────────────────────────────────"
echo ""

# Example 4: Natural Gas Emissions
echo "🔥 Example 4: Natural Gas Emissions"
echo "Request: 100 cubic meters of natural gas"
echo ""
curl -X POST $API_BASE/v1/emissions/calculate \
  -H "Content-Type: application/json" \
  -d '{
    "source": "natural_gas",
    "value": 100,
    "unit": "m3",
    "country": "US"
  }' | jq
echo ""
echo "─────────────────────────────────────────"
echo ""

echo "✅ Done! All examples completed."
echo ""
echo "📚 Next steps:"
echo "   1. Get API key: https://app.zerocarbon.codes/signup"
echo "   2. View docs: https://docs.zerocarbon.codes"
echo "   3. See more examples: https://github.com/zerocarbon/examples"
