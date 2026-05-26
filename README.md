# 🪡 SANKIRTHI DESIGNERS — Billing & Management System

A professional tailoring shop billing and customer management system built with Next.js, Tailwind CSS, and Firebase.

---

## ✨ Features

- 🔐 Firebase Email/Password Login
- 📊 Dashboard with revenue stats
- 👥 Customer management with measurements
- 🧾 GST invoice generation with QR payment
- 📦 Order tracking (Cutting → Stitching → Trial → Ready → Delivered)
- 💬 WhatsApp customer updates
- ⚙️ Settings with logo & QR code upload
- 📱 Fully mobile responsive

---

## 🚀 SETUP GUIDE (Step by Step)

### STEP 1 — Create Firebase Project

1. Go to **https://console.firebase.google.com**
2. Click **"Add project"** → Name it `sankirthi-designers`
3. Disable Google Analytics (optional) → Click **Create Project**

### STEP 2 — Enable Firebase Services

**Authentication:**
1. In Firebase Console → Click **Authentication** (left menu)
2. Click **Get Started**
3. Under **Sign-in method** → Enable **Email/Password**
4. Click **Save**

**Create Admin User:**
1. Go to **Authentication → Users → Add User**
2. Enter your email and password → **Add User**
   - Example: `vasanthamani420@gmail.com` / your-password

**Firestore Database:**
1. Click **Firestore Database** (left menu)
2. Click **Create database**
3. Choose **Start in production mode** → Next
4. Select region: `asia-south1 (Mumbai)` → **Done**
5. Go to **Rules** tab → Replace with:
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if request.auth != null;
       }
     }
   }
   ```
6. Click **Publish**

**Firebase Storage:**
1. Click **Storage** (left menu)
2. Click **Get Started** → **Next** → **Done**
3. Go to **Rules** tab → Replace with:
   ```
   rules_version = '2';
   service firebase.storage {
     match /b/{bucket}/o {
       match /{allPaths=**} {
         allow read, write: if request.auth != null;
       }
     }
   }
   ```
4. Click **Publish**

### STEP 3 — Get Firebase Config Keys

1. In Firebase Console → Click **⚙️ Project Settings** (gear icon)
2. Scroll down to **"Your apps"** section
3. Click **"</>"** (Web) icon → Name it `sankirthi-web` → Register app
4. Copy the `firebaseConfig` object — you need these values:
   - `apiKey`
   - `authDomain`
   - `projectId`
   - `storageBucket`
   - `messagingSenderId`
   - `appId`

### STEP 4 — Set Up Environment Variables

**For Local Development:**
1. In your project folder, create a file called `.env.local`
2. Copy from `.env.example` and fill in your Firebase values:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your_actual_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
   NEXT_PUBLIC_FIREBASE_APP_ID=1:123:web:abc123
   ```

### STEP 5 — Install and Run Locally

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000 in your browser
```

---

## 📤 GITHUB SETUP (for editing from phone)

```bash
# Initialize git (first time only)
git init
git add .
git commit -m "Initial commit: Sankirthi Designers billing system"

# Create repo on GitHub.com first, then:
git remote add origin https://github.com/YOUR_USERNAME/sankirthi-designers.git
git branch -M main
git push -u origin main
```

After this, you can **edit files directly on GitHub.com** from your phone!

---

## 🌐 VERCEL DEPLOYMENT

1. Go to **https://vercel.com** → Sign in with GitHub
2. Click **"New Project"** → Import your `sankirthi-designers` repo
3. **IMPORTANT — Add Environment Variables:**
   - Go to project Settings → **Environment Variables**
   - Add all 6 Firebase variables from your `.env.local`
4. Click **Deploy**
5. Your app is live! 🎉

**Every time you push to GitHub → Vercel auto-deploys!**

---

## 📁 FOLDER STRUCTURE

```
sankirthi-designers/
├── app/
│   ├── globals.css          ← All styles
│   ├── layout.js            ← Root layout (auth + toasts)
│   ├── page.js              ← Home (redirects to login/dashboard)
│   ├── login/page.js        ← Login page
│   ├── dashboard/page.js    ← Dashboard with stats
│   ├── customers/page.js    ← Customer management
│   ├── billing/page.js      ← Invoice creation & list
│   ├── orders/page.js       ← Order tracking
│   └── settings/page.js     ← Shop settings & QR upload
├── components/
│   ├── layout/
│   │   ├── Sidebar.js       ← Navigation sidebar
│   │   └── DashboardLayout.js ← Protected page wrapper
│   └── ui/
│       ├── index.js         ← Reusable UI components
│       └── InvoicePrint.js  ← Printable invoice design
├── lib/
│   ├── firebase.js          ← Firebase initialization
│   ├── firestore.js         ← Database helper functions
│   ├── storage.js           ← File upload helpers
│   └── auth-context.js      ← Authentication context
├── .env.example             ← Environment variables template
├── .env.local               ← Your actual keys (DO NOT commit!)
├── firestore.rules          ← Database security rules
├── storage.rules            ← Storage security rules
└── README.md                ← This file
```

---

## 💡 HOW TO USE

### First Login
1. Go to your deployed URL
2. Enter the email/password you created in Firebase Auth
3. You're in the dashboard!

### Add First Customer
1. Click **Customers** → **Add Customer**
2. Fill name, phone
3. Click **Measurements** tab to add body measurements
4. Save

### Create First Invoice
1. Click **Billing** → **New Invoice**
2. Select customer from dropdown
3. Add items with quantity and price
4. GST is calculated automatically
5. Click **Create Invoice**
6. Click 👁 Eye icon to preview/print

### Upload Payment QR Code
1. Click **Settings**
2. Scroll to **Payment QR Code** section
3. Click **Upload QR Code**
4. Select your GPay/PhonePe QR image
5. Click **Save All Settings**
6. QR now appears on all invoices!

---

## 🔧 CUSTOMIZATION

To change shop details permanently, edit `lib/firestore.js`:
```js
// Find the getSettings() function and change defaults:
return {
  shopName: 'YOUR SHOP NAME',
  ownerName: 'YOUR NAME',
  // ... etc
};
```

Or simply change them in the **Settings** page — they'll save to Firebase.

---

## ⚠️ IMPORTANT NOTES

- Never commit `.env.local` to GitHub (it's in `.gitignore`)
- The `.env.example` file is safe to commit — it has no real keys
- First time deploy to Vercel — always add environment variables in Vercel dashboard
- Firebase free tier (Spark) is sufficient for a small shop

---

**Built with ❤️ for Sankirthi Designers, Coimbatore**
