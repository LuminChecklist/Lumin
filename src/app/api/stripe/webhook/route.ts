import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createServiceClient } from '@/lib/supabase/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (error) {
    console.error('Webhook signature verification failed:', error)
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    )
  }

  const supabase = createServiceClient()

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        
        const userId = session.metadata?.userId
        const customerEmail = session.customer_email

        if (!userId) {
          console.error('No userId found in session metadata')
          return NextResponse.json(
            { error: 'No userId in metadata' },
            { status: 400 }
          )
        }

        // Update user profile to premium
        const { error: profileError } = await supabase
          .from('user_profiles')
          .upsert({
            user_id: userId,
            email: customerEmail || '',
            is_lumin_plus: true,
            stripe_customer_id: session.customer as string,
            updated_at: new Date().toISOString(),
          })

        if (profileError) {
          console.error('Error updating user profile:', profileError)
          return NextResponse.json(
            { error: 'Failed to update user profile' },
            { status: 500 }
          )
        }

        console.log(`Successfully upgraded user ${userId} to Lumin+`)
        break
      }

      case 'invoice.payment_succeeded': {
        // Handle recurring payments if you add subscriptions later
        const invoice = event.data.object as Stripe.Invoice
        console.log('Payment succeeded for invoice:', invoice.id)
        break
      }

      case 'invoice.payment_failed': {
        // Handle failed payments
        const invoice = event.data.object as Stripe.Invoice
        console.log('Payment failed for invoice:', invoice.id)
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}