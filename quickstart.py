#!/usr/bin/env python3
"""
ZeroCarbon API - Interactive Quickstart
Run: python quickstart.py
"""

import requests
import json
from typing import Dict, Any
import os

# Auto-detect environment
API_BASE = os.environ.get('API_BASE', 'https://zerocarbon.codes/api')

# Colors for terminal output
class Colors:
    RESET = '\033[0m'
    GREEN = '\033[32m'
    BLUE = '\033[34m'
    YELLOW = '\033[33m'
    CYAN = '\033[36m'
    BOLD = '\033[1m'

def log(message: str, color: str = 'RESET'):
    """Print colored message to console"""
    color_code = getattr(Colors, color, Colors.RESET)
    print(f"{color_code}{message}{Colors.RESET}")

def api_request(endpoint: str, data: Dict[str, Any]) -> Dict[str, Any]:
    """Make API request to ZeroCarbon"""
    try:
        response = requests.post(
            f"{API_BASE}{endpoint}",
            json=data,
            headers={'Content-Type': 'application/json'},
            timeout=10
        )
        return response.json()
    except Exception as e:
        return {"success": False, "error": str(e)}

def demo_electricity():
    """Demo: Calculate electricity emissions"""
    log('\n🔌 Demo 1: Electricity Emissions', 'CYAN')
    log('Calculating emissions for 1,000 kWh of electricity in the US...\n')
    
    result = api_request('/v1/emissions/calculate', {
        'source': 'electricity',
        'value': 1000,
        'unit': 'kWh',
        'country': 'US'
    })
    
    if result.get('success'):
        data = result.get('data', {})
        log(f"✅ Emissions: {data.get('emissions_kg_co2e')} kg CO2e", 'GREEN')
        log(f"   Equivalent to: {data.get('emissions_kg_co2e', 0) / 411:.1f} gallons of gasoline", 'BLUE')
        log(f"   Emission factor: {data.get('emission_factor')} kg CO2e per kWh", 'BLUE')

def demo_flight():
    """Demo: Calculate flight emissions"""
    log('\n✈️  Demo 2: Flight Emissions', 'CYAN')
    log('Calculating emissions for SFO → JFK flight...\n')
    
    result = api_request('/v1/calculate/flight', {
        'from': 'SFO',
        'to': 'JFK',
        'passengers': 1,
        'class': 'economy'
    })
    
    if result.get('success'):
        data = result.get('data', {})
        log(f"✅ Emissions: {data.get('emissions_kg_co2e')} kg CO2e", 'GREEN')
        log(f"   Distance: {data.get('distance_km')} km", 'BLUE')
        log(f"   Per passenger: {data.get('emissions_per_passenger_kg_co2e')} kg CO2e", 'BLUE')

def demo_vehicle():
    """Demo: Calculate vehicle emissions"""
    log('\n🚗 Demo 3: Vehicle Emissions', 'CYAN')
    log('Calculating emissions for 100 miles of driving...\n')
    
    result = api_request('/v1/calculate/fuel', {
        'fuel_type': 'gasoline',
        'distance': 100,
        'unit': 'miles',
        'vehicle_type': 'car'
    })
    
    if result.get('success'):
        data = result.get('data', {})
        log(f"✅ Emissions: {data.get('emissions_kg_co2e')} kg CO2e", 'GREEN')
        log(f"   Fuel consumed: {data.get('fuel_consumed_liters')} liters", 'BLUE')
        log(f"   Emission factor: {data.get('emission_factor')} kg CO2e per liter", 'BLUE')

def interactive_mode():
    """Interactive custom calculation"""
    log('\n📊 Custom Calculation', 'CYAN')
    
    source = input('Enter emission source (electricity/gasoline/diesel/natural_gas): ').strip()
    value = float(input('Enter value: '))
    unit = input('Enter unit (kWh/liters/m3): ').strip()
    
    log('\nCalculating...\n')
    
    result = api_request('/v1/emissions/calculate', {
        'source': source,
        'value': value,
        'unit': unit,
        'country': 'US'
    })
    
    if result.get('success'):
        data = result.get('data', {})
        log(f"✅ Emissions: {data.get('emissions_kg_co2e')} kg CO2e", 'GREEN')
        log(f"   Source: {data.get('source')}", 'BLUE')
        log(f"   Scope: {data.get('scope')}", 'BLUE')
    else:
        log(f"❌ Error: {result.get('error', 'Unknown error')}", 'YELLOW')

def main():
    """Main function"""
    log('\n╔═══════════════════════════════════════╗', 'BOLD')
    log('║   ZeroCarbon API - Quick Start Demo   ║', 'BOLD')
    log('╚═══════════════════════════════════════╝\n', 'BOLD')
    
    log('Welcome! This demo shows how easy it is to calculate carbon emissions.', 'BLUE')
    log('No API key needed for testing.\n', 'BLUE')
    
    try:
        # Run pre-built demos
        demo_electricity()
        demo_flight()
        demo_vehicle()
        
        # Offer interactive mode
        log('\n' + '─' * 60, 'BLUE')
        answer = input('\nWant to try a custom calculation? (y/n): ')
        
        if answer.lower() == 'y':
            interactive_mode()
        
        # Show next steps
        log('\n' + '═' * 60, 'GREEN')
        log('\n🎉 That\'s it! You just calculated carbon emissions via API.', 'GREEN')
        log('\n📚 Next Steps:', 'CYAN')
        log('   1. Get free API key: https://app.zerocarbon.codes/signup', 'BLUE')
        log('   2. Read docs: https://docs.zerocarbon.codes', 'BLUE')
        log('   3. View examples: https://github.com/zerocarbon/examples', 'BLUE')
        log('   4. Join Discord: https://discord.gg/zerocarbon', 'BLUE')
        log('\n💡 Install SDK: pip install zerocarbon', 'YELLOW')
        log('\n' + '═' * 60 + '\n', 'GREEN')
        
    except Exception as e:
        log(f'\n❌ Error: {str(e)}', 'YELLOW')
        log('\nFalling back to local demo mode...', 'BLUE')
        
        # Fallback with mock data
        log('\n🔌 Electricity Demo (Mock Data)', 'CYAN')
        log('✅ 1,000 kWh → 386.5 kg CO2e', 'GREEN')
        log('\n✈️  Flight Demo (Mock Data)', 'CYAN')
        log('✅ SFO → JFK → 532 kg CO2e per passenger', 'GREEN')
        log('\n🚗 Vehicle Demo (Mock Data)', 'CYAN')
        log('✅ 100 miles → 38.2 kg CO2e', 'GREEN')

if __name__ == '__main__':
    main()
