#!/usr/bin/env node

/**
 * ZeroCarbon API - Interactive Quickstart
 * Run: npx zerocarbon-quickstart
 */

const https = require('https');
const http = require('http');
const readline = require('readline');

// Auto-detect environment: use localhost for dev, production for deployed
const API_BASE = process.env.API_BASE || 'https://zerocarbon.codes/api';
const IS_LOCAL = API_BASE.includes('localhost');
const USE_HTTPS = API_BASE.startsWith('https');

const apiUrl = new URL(API_BASE);

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function apiRequest(endpoint, data) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(data);
    const protocol = USE_HTTPS ? https : http;
    const options = {
      hostname: apiUrl.hostname,
      port: apiUrl.port || (USE_HTTPS ? 443 : 80),
      path: apiUrl.pathname + endpoint,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = protocol.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch (e) {
          resolve(body);
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

function displayResult(result, demoName) {
  if (result.success && result.data) {
    const data = result.data;
    log(`✅ Emissions: ${data.emissions_kg_co2e} kg CO2e`, 'green');
    
    if (data.emission_factor) {
      log(`   Emission factor: ${data.emission_factor}`, 'blue');
    }
    if (data.distance_km) {
      log(`   Distance: ${data.distance_km} km`, 'blue');
    }
    if (data.fuel_consumed_liters) {
      log(`   Fuel consumed: ${data.fuel_consumed_liters} liters`, 'blue');
    }
  } else if (result.error) {
    log(`❌ Error: ${result.error}`, 'yellow');
  } else {
    // Show raw response for debugging
    log(`⚠️  Unexpected response format:`, 'yellow');
    log(JSON.stringify(result, null, 2), 'yellow');
  }
}

async function demoElectricity() {
  log('\n🔌 Demo 1: Electricity Emissions', 'cyan');
  log('Calculating emissions for 1,000 kWh of electricity in the US...\n');

  const result = await apiRequest('/v1/calculate/electricity', {
    kwh: 1000,
    country: 'US'
  });

  displayResult(result, 'Electricity');
}

async function demoFlight() {
  log('\n✈️  Demo 2: Flight Emissions', 'cyan');
  log('Calculating emissions for DEL → BOM flight...\n');

  const result = await apiRequest('/v1/calculate/flight', {
    origin: 'DEL',
    destination: 'BOM',
    passengers: 1,
    cabin_class: 'economy'
  });

  displayResult(result, 'Flight');
}

async function demoVehicle() {
  log('\n🚗 Demo 3: Vehicle Emissions', 'cyan');
  log('Calculating emissions for 50 liters of petrol...\n');

  const result = await apiRequest('/v1/calculate/fuel', {
    fuel_type: 'petrol',
    amount: 50,
    unit: 'liters'
  });

  displayResult(result, 'Vehicle');
}

async function interactiveMode() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  log('\n📊 Custom Calculation', 'cyan');
  
  const kwh = await new Promise(resolve => {
    rl.question('Enter electricity usage in kWh: ', resolve);
  });

  const country = await new Promise(resolve => {
    rl.question('Enter country code (US/IN/GB/DE): ', resolve);
  });

  rl.close();

  log('\nCalculating...\n');

  const result = await apiRequest('/v1/calculate/electricity', {
    kwh: parseFloat(kwh),
    country: country.trim().toUpperCase() || 'US'
  });

  displayResult(result, 'Custom');
}

async function main() {
  log('\n╔═══════════════════════════════════════╗', 'bold');
  log('║   ZeroCarbon API - Quick Start Demo   ║', 'bold');
  log('╚═══════════════════════════════════════╝\n', 'bold');

  log('Welcome! This demo shows how easy it is to calculate carbon emissions.', 'blue');
  log('No API key needed for testing.\n', 'blue');

  try {
    // Run pre-built demos
    await demoElectricity();
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    await demoFlight();
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    await demoVehicle();
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Offer interactive mode
    log('\n' + '─'.repeat(60), 'blue');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const answer = await new Promise(resolve => {
      rl.question('\nWant to try a custom calculation? (y/n): ', resolve);
    });
    rl.close();

    if (answer.toLowerCase() === 'y') {
      await interactiveMode();
    }

    // Show next steps
    log('\n' + '═'.repeat(60), 'green');
    log('\n🎉 That\'s it! You just calculated carbon emissions via API.', 'green');
    log('\n📚 Next Steps:', 'cyan');
    log('   1. Get free API key: https://app.zerocarbon.codes/signup', 'blue');
    log('   2. Read docs: https://docs.zerocarbon.codes', 'blue');
    log('   3. View examples: https://github.com/zerocarbon/examples', 'blue');
    log('   4. Join Discord: https://discord.gg/zerocarbon', 'blue');
    log('\n💡 Install SDK: npm install zerocarbon-sdk', 'yellow');
    log('\n' + '═'.repeat(60) + '\n', 'green');

  } catch (error) {
    log(`\n❌ Error: ${error.message}`, 'yellow');
    log('\nFalling back to local demo mode...', 'blue');
    
    // Fallback with mock data
    log('\n🔌 Electricity Demo (Mock Data)', 'cyan');
    log('✅ 1,000 kWh → 386.5 kg CO2e', 'green');
    log('\n✈️  Flight Demo (Mock Data)', 'cyan');
    log('✅ SFO → JFK → 532 kg CO2e per passenger', 'green');
    log('\n🚗 Vehicle Demo (Mock Data)', 'cyan');
    log('✅ 100 miles → 38.2 kg CO2e', 'green');
  }
}

// Run if executed directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { main, apiRequest };
