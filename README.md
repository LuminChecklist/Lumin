# Lumin+ - Psychology-Optimized Task Management

A modern, psychology-powered productivity app built with Next.js, Supabase, and Stripe. Transform your tasks into dopamine with beautiful animations, premium features, and a focus timer.

## 🌟 Features

### Free Features
- ✅ Task management (add, complete, delete, undo)
- ✅ User authentication & data persistence
- ✅ Basic statistics and progress tracking
- ✅ Responsive design for all devices
- ✅ Dark theme optimized for focus

### Lumin+ Premium Features ($0.99 one-time)
- 🌈 Pastel rainbow gradients
- ✨ Confetti & glow rewards
- 🌀 Smooth hover animations
- 🎯 Psychology-powered completion effects
- ⏱️ Focus timer (Pomodoro technique)
- 📊 Enhanced statistics and work time tracking

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- Stripe account

### 1. Clone and Install

\`\`\`bash
git clone <your-repo-url>
cd lumin-nextjs
npm install
\`\`\`

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the schema from \`supabase-schema.sql\`
3. Get your project URL and anon key from Settings > API

### 3. Set Up Stripe

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Get your publishable and secret keys from the dashboard
3. Set up a webhook endpoint pointing to \`your-domain.com/api/stripe/webhook\`
4. Configure webhook to listen for \`checkout.session.completed\` events

### 4. Environment Variables

Create a \`.env.local\` file:

\`\`\`env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
\`\`\`

### 5. Run the Development Server

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) to see your app!

## 🔧 Database Schema

The app uses the following Supabase tables:

- \`user_profiles\` - User information and premium status
- \`tasks\` - Task data with work time tracking
- \`user_settings\` - Customizable user preferences
- \`task_sessions\` - Detailed timer session tracking

Run \`supabase-schema.sql\` in your Supabase SQL editor to set up the complete schema.

## 💳 Stripe Integration

### Webhook Setup

1. In your Stripe dashboard, go to Webhooks
2. Add endpoint: \`https://your-domain.com/api/stripe/webhook\`
3. Listen for events: \`checkout.session.completed\`
4. Copy the webhook secret to your environment variables

### Testing Webhooks Locally

\`\`\`bash
# Install Stripe CLI
npm install -g stripe-cli

# Login to Stripe
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/stripe/webhook
\`\`\`

Use the webhook secret from the CLI output in your \`.env.local\`.

## 🎨 Customization

### Premium Features Toggle

The app automatically detects premium status from the database. Premium features include:

- Enhanced animations and visual effects
- Timer functionality 
- Advanced statistics
- Pastel rainbow themes

### Styling

The app uses Tailwind CSS with custom CSS variables for premium/free mode switching:

- Edit \`src/app/globals.css\` for global styles
- Modify \`tailwind.config.js\` for theme customization
- Premium features use \`data-premium\` attribute for conditional styling

## 📱 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repo to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms

The app is a standard Next.js application and can be deployed to:

- Netlify
- Railway
- DigitalOcean App Platform
- Any Node.js hosting service

## 🧪 Testing

### Test Premium Features (Development)

Open browser console and run:

\`\`\`javascript
// Enable premium for testing
localStorage.setItem('testPremium', 'true')
window.location.reload()
\`\`\`

### Stripe Test Cards

Use Stripe test cards for payment testing:

- \`4242 4242 4242 4242\` - Successful payment
- \`4000 0000 0000 0002\` - Declined payment

## 🔐 Security

- Row Level Security (RLS) enabled on all Supabase tables
- Webhook signature verification for Stripe events
- Environment variables for sensitive keys
- Client-side premium checks backed by server-side validation

## 📊 Analytics & Monitoring

Consider adding:

- Vercel Analytics for performance monitoring
- Supabase Analytics for database insights
- Stripe Dashboard for payment monitoring
- Sentry for error tracking

## 🚀 Production Checklist

- [ ] Set up production Supabase project
- [ ] Configure production Stripe webhooks
- [ ] Add proper domain to environment variables
- [ ] Test payment flow end-to-end
- [ ] Set up monitoring and alerts
- [ ] Configure email notifications
- [ ] Test user registration flow
- [ ] Verify RLS policies are working

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (\`git checkout -b feature/amazing-feature\`)
3. Commit your changes (\`git commit -m 'Add amazing feature'\`)
4. Push to the branch (\`git push origin feature/amazing-feature\`)
5. Open a Pull Request

## 💡 Future Enhancements

- [ ] Team collaboration features
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Integration with calendar apps
- [ ] Sound notifications and background music
- [ ] AI-powered task suggestions
- [ ] Habit tracking features

---

Built with ❤️ using Next.js, Supabase, and Stripe.