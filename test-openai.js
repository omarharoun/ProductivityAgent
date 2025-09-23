#!/usr/bin/env node

// Test script for OpenAI integration
const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3000';

async function testOpenAI() {
  console.log('🧪 Testing OpenAI GPT-4.1 Integration...\n');

  try {
    // Test 1: Health Check
    console.log('1. Testing AI Health Check...');
    const healthResponse = await fetch(`${BASE_URL}/api/ai/health`);
    const healthData = await healthResponse.json();
    
    if (healthData.healthy) {
      console.log('✅ AI Service: Online');
    } else {
      console.log('❌ AI Service: Offline');
      console.log('   Make sure to set OPENAI_API_KEY in your .env file');
      return;
    }

    // Test 2: Text Generation
    console.log('\n2. Testing Text Generation...');
    const generateResponse = await fetch(`${BASE_URL}/api/ai/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: 'Help me organize my day' })
    });
    const generateData = await generateResponse.json();
    
    if (generateData.success) {
      console.log('✅ Text Generation: Working');
      console.log(`   Response: ${generateData.response.substring(0, 100)}...`);
    } else {
      console.log('❌ Text Generation: Failed');
      console.log(`   Error: ${generateData.error}`);
    }

    // Test 3: Text Editing
    console.log('\n3. Testing Text Editing...');
    const editResponse = await fetch(`${BASE_URL}/api/ai/edit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        text: 'This is a test document that needs improvement.',
        instruction: 'make it more professional'
      })
    });
    const editData = await editResponse.json();
    
    if (editData.success) {
      console.log('✅ Text Editing: Working');
      console.log(`   Edited: ${editData.response.substring(0, 100)}...`);
    } else {
      console.log('❌ Text Editing: Failed');
      console.log(`   Error: ${editData.error}`);
    }

    // Test 4: Text Improvement
    console.log('\n4. Testing Text Improvement...');
    const improveResponse = await fetch(`${BASE_URL}/api/ai/improve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        text: 'This text has some grammar issues and could be better written.'
      })
    });
    const improveData = await improveResponse.json();
    
    if (improveData.success) {
      console.log('✅ Text Improvement: Working');
      console.log(`   Improved: ${improveData.response.substring(0, 100)}...`);
    } else {
      console.log('❌ Text Improvement: Failed');
      console.log(`   Error: ${improveData.error}`);
    }

    console.log('\n🎉 OpenAI Integration Test Complete!');
    console.log('\nNext steps:');
    console.log('1. Set your OPENAI_API_KEY in .env file');
    console.log('2. Start the development server: npm run dev');
    console.log('3. Test the Notion AI Editor in your browser');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\nMake sure:');
    console.log('1. The development server is running (npm run dev)');
    console.log('2. OPENAI_API_KEY is set in your .env file');
  }
}

testOpenAI();




