# AGRIMART — Website Replication & Deployment Guide

## Overview
This codebase is a replication of the **AGRIMART** website (`https://agrimart.in/`) developed with:
- **Framework:** Next.js (App Router, React 19, TypeScript)
- **Styling:** Tailwind CSS (matching Agrimart forest green `#2d7d32`, `#1b5e20`, red & yellow accents)
- **State & E-Commerce:** React Context, LocalStorage Cart persistence, Razorpay sandbox payment ready
- **ORM / Database:** Prisma schema for PostgreSQL with models for Users, Products, Categories, Subcategories, Brands, Orders, Enquiries, and Blogs
- **Assets:** 420+ original images and genuine multi-megabyte brochures extracted from `agrimart.in`

---

## Environment Variables (.env)
Create a `.env` file in the root folder based on this template:

```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/agrimart?schema=public"

# Payment Gateway (Razorpay)
NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_test_placeholder"
RAZORPAY_KEY_SECRET="your_razorpay_secret"

# Customer SMS / OTP Provider (MSG91 / Fast2SMS / Twilio)
SMS_PROVIDER_API_KEY="your_sms_api_key"
SMS_SENDER_ID="AGMART"

# Admin & Support Email Notifications
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="ask@agrimart.in"
SMTP_PASS="your_app_password"
```

---

## Directory Structure
- `app/`: Next.js App Router pages
  - `page.tsx`: Full replica Homepage with original banners, brands, featured products, awards, and recognition badges
  - `products/`: Products catalog with nested category tree & brand filters
  - `products/[id]/`: Product detail with gallery, RIPL codes, multiline tabs, multilingual brochures (English, Kannada, Telugu), and subsidy form
  - `about/`: About Us with Ratnagiri Impex history since 2000, vision, mission, and corporate brochure downloads
  - `services/`: Services page with 750+ dealer touchpoints map and network statistics
  - `blogs/`: Agricultural mechanization blogs with full original content
  - `contact/`: Contact Us page with the 4 exact dropdowns (Feedback type, Contact type, Country, State) + Pincode
  - `faq/`: Interactive FAQ accordion
  - `cart/` & `checkout/`: Cart management & order placement
  - `admin/`: Admin backoffice dashboard
- `components/`: Header, Footer, ProductCard, SubsidyModal, AuthModal
- `data/import/`: Structured JSON datasets for products, categories, blogs, faqs, and legal pages
- `public/assets/`:
  - `branding/`: Agrimart logos, app badges, favicons
  - `banners/`: Hero slider images
  - `brands/`: Kasei, Oleo-Mac, Agrimate, Green Panther
  - `products/`: Product image directories organized by RIPL code
  - `awards/` & `recognition/`: 14 authentic badges
  - `brochures/`: 3 original PDF documents (`corporate_brochure.pdf`, `company_profile.pdf`, `agrimart_brochure.pdf`)
- `docs/`: Reference sitemap, website audit, deployment guide
- `prisma/`: Prisma PostgreSQL schema
- `scripts/`: Automated crawling, asset extraction, and manifest generator scripts

---

## Running Development Server
```bash
npm install
npm run dev
```
Open `http://localhost:3000` in your browser.

## Production Build
```bash
npm run build
npm start
```
