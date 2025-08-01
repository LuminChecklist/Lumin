#!/usr/bin/env node

// Test script for Stripe webhook functionality
// Run with: node scripts/test-webhook.js

const { createServiceClient } = require('../src/lib/supabase/server')

async function testWebhookFlow() {
  console.log('🧪 Testing Stripe webhook flow...')
  
  const supabase = createServiceClient()
  
  // Test user ID (you should replace this with a real user ID from your database)
  const testUserId = 'test-user-id'
  const testEmail = 'test@example.com'
  
  try {
    // 1. Test creating/updating user profile
    console.log('1. Testing user profile creation...')
    
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .upsert({
        user_id: testUserId,
        email: testEmail,
        is_lumin_plus: true,
        stripe_customer_id: 'cus_test123',
        updated_at: new Date().toISOString(),
      })
      .select()
    
    if (profileError) {
      console.error('❌ Profile test failed:', profileError)
      return
    }
    
    console.log('✅ Profile test passed')
    
    // 2. Test reading premium status
    console.log('2. Testing premium status check...')
    
    const { data: premiumCheck, error: premiumError } = await supabase
      .from('user_profiles')
      .select('is_lumin_plus')
      .eq('user_id', testUserId)
      .single()
    
    if (premiumError) {
      console.error('❌ Premium check failed:', premiumError)
      return
    }
    
    if (premiumCheck.is_lumin_plus) {
      console.log('✅ Premium status test passed')
    } else {
      console.error('❌ Premium status not set correctly')
      return
    }
    
    // 3. Clean up test data
    console.log('3. Cleaning up test data...')
    
    const { error: deleteError } = await supabase
      .from('user_profiles')
      .delete()
      .eq('user_id', testUserId)
    
    if (deleteError) {
      console.error('⚠️  Cleanup failed:', deleteError)
    } else {
      console.log('✅ Cleanup completed')
    }
    
    console.log('\n🎉 All webhook tests passed!')
    console.log('\nNext steps:')
    console.log('1. Set up Stripe webhook endpoint')
    console.log('2. Test with real Stripe checkout')
    console.log('3. Verify user gets upgraded to premium')
    
  } catch (error) {
    console.error('❌ Test failed with error:', error)
  }
}

// Simulated webhook payload for testing
function createTestWebhookPayload() {
  return {
    id: 'evt_test123',
    object: 'event',
    type: 'checkout.session.completed',
    data: {
      object: {
        id: 'cs_test123',
        object: 'checkout.session',
        customer: 'cus_test123',
        customer_email: 'test@example.com',
        metadata: {
          userId: 'test-user-id',
          productType: 'lumin_plus'
        },
        payment_status: 'paid'
      }
    }
  }
}

function testWebhookPayloadParsing() {
  console.log('\n🔍 Testing webhook payload parsing...')
  
  const payload = createTestWebhookPayload()
  
  // Extract data like the webhook handler would
  const session = payload.data.object
  const userId = session.metadata?.userId
  const customerEmail = session.customer_email
  
  if (!userId) {
    console.error('❌ No userId found in metadata')
    return false
  }
  
  if (!customerEmail) {
    console.error('❌ No customer email found')
    return false
  }
  
  console.log('✅ Webhook payload parsing test passed')
  console.log(`   User ID: ${userId}`)
  console.log(`   Email: ${customerEmail}`)
  
  return true
}

// Run tests
async function runAllTests() {
  console.log('🚀 Starting Lumin+ webhook tests...\n')
  
  // Test 1: Webhook payload parsing
  const payloadTest = testWebhookPayloadParsing()
  
  if (!payloadTest) {
    console.error('❌ Payload test failed, stopping')
    return
  }
  
  // Test 2: Database operations
  await testWebhookFlow()
}

// Only run if called directly
if (require.main === module) {
  runAllTests().catch(console.error)
}

module.exports = {
  testWebhookFlow,
  testWebhookPayloadParsing,
  createTestWebhookPayload
}