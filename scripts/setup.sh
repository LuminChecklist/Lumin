#!/bin/bash

# Lumin+ Setup Script
echo "🌟 Setting up Lumin+ Development Environment..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2)
REQUIRED_VERSION="18.0.0"

if ! node -e "process.exit(require('semver').gte('$NODE_VERSION', '$REQUIRED_VERSION') ? 0 : 1)" 2>/dev/null; then
    echo "❌ Node.js version must be 18.0.0 or higher. Current version: $NODE_VERSION"
    exit 1
fi

echo "✅ Node.js version check passed"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "📝 Creating .env.local file..."
    cp env.example .env.local
    echo "⚠️  Please edit .env.local with your actual environment variables"
else
    echo "✅ .env.local already exists"
fi

# Check if Stripe CLI is installed
if ! command -v stripe &> /dev/null; then
    echo "⚠️  Stripe CLI not found. Install it for webhook testing:"
    echo "   npm install -g stripe-cli"
    echo "   stripe login"
else
    echo "✅ Stripe CLI found"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Set up your Supabase project"
echo "2. Run the SQL schema: supabase-schema.sql"
echo "3. Configure your .env.local file"
echo "4. Set up Stripe webhooks"
echo "5. Run: npm run dev"
echo ""
echo "📚 See README.md for detailed instructions"