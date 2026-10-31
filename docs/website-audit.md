# AGRIMART Website Replication & Audit Report

**Reference Website:** https://agrimart.in/  
**Company:** Agrimart (Ratnagiri Impex Pvt. Ltd. / Annapurna Group)  
**Location:** Annapurna House, #1/1G, 7th Cross, New Guddadahalli, Mysore Road, Bangalore – 560026  
**Customer Helpline:** 7393 938 938  
**Email:** ask@agrimart.in  

---

## 1. Discovered Page Hierarchy & Sitemap
Audited and recorded in `docs/reference-sitemap.json`:

| Page / Route | Original Agrimart URL | Status | Description |
|---|---|---|---|
| **Home** | `/` | 200 OK | Hero sliders, brand showcase, featured products, awards, metrics, network map |
| **Product Catalogue** | `/index.php/home/list_products` | 200 OK | 28 categories, nested subcategories, brand filters, sorting, product grid |
| **Product Details** | `/index.php/home/prduct_details/:id/:cat` | 200 OK | Gallery, RIPL codes, tax-inclusive prices, multilingual brochures, subsidy modal |
| **About Us** | `/index.php/home/about_us` | 200 OK | Ratnagiri Impex history since 2000, vision, mission, corporate brochure downloads |
| **Services** | `/index.php/home/services` | 200 OK | Service network (750+ network points), technical excellence, imported machinery |
| **Blogs** | `/index.php/home/blogs` | 200 OK | 9 detailed agricultural mechanization articles with original body content |
| **Contact Us** | `/index.php/home/contact_us` | 200 OK | Verified 4 dropdowns: Feedback Type, Contact Type, Country, State + Pincode |
| **FAQ** | `/index.php/home/faq` | 200 OK | Agrimart E-kart, accounts, credentials, Razorpay payments, warranty |
| **Privacy Policy** | `/index.php/home/cms/privacy_policy` | 200 OK | Customer data privacy terms and protection policy |
| **Terms & Conditions**| `/index.php/home/terms_and_conditions` | 200 OK | Ordering, shipping, cancellation terms |
| **Legal Notice** | `/index.php/home/cms/legal_notice` | 200 OK | Trademark, IP, and legal declaration |
| **Disclaimer** | `/index.php/home/cms/disclaimer` | 200 OK | Product specifications, accuracy, and operational disclaimer |
| **Warranty** | `/index.php/home/cms/warranty` | 200 OK | Manufacturer warranty coverage & service terms |
| **Become a Partner** | `/index.php/home/cms/become_a_partner` | 200 OK | Franchise and dealer onboarding |
| **Buy, Earn & Rent** | `/index.php/home/cms/buy_earn_rent` | 200 OK | Rural equipment leasing and rental program |
| **Knowledge Bank** | `/index.php/home/cms/knowledge_bank` | 200 OK | Educational equipment documentation |
| **Cart & Checkout** | `/index.php/home/view_cart` | 200 OK | Dynamic bag, quantity updates, order summary, Razorpay-ready checkout |
| **Customer Auth** | `/index.php/login/user_login` | 200 OK | OTP login, SMS verification, customer registration |
| **B2B Login** | `/index.php/home/dealer_register` | 200 OK | Separate dealer/distributor business registration & login |
| **Admin Portal** | `/index.php/vendor/user_login` | 200 OK | Backoffice dashboard for catalogue, enquiries, orders, and CMS |

---

## 2. Verified Corporate Brochures
Downloaded and validated genuine PDFs:
1. `public/assets/brochures/corporate_brochure.pdf` (802 KB, 6-page comprehensive corporate deck)
2. `public/assets/brochures/company_profile.pdf` (14.9 MB, full company history and network profile)
3. `public/assets/brochures/agrimart_brochure.pdf` (11.6 MB, Agrimate private label equipment deck)

---

## 3. Brand & Visual Identity
- **Primary Color:** Forest Green `#2e7d32` / `#1b5e20` (Agrimart Brand Green)
- **Accent Color:** Golden Yellow `#f59e0b` / Red `#dc2626`
- **Backgrounds:** Clean white `#ffffff` with subtle slate `#f8fafc` sections
- **Typography:** Modern clean sans-serif typography matching original proportions
- **Core Brands:** KASEI, OLEO MAC, AGRIMATE, GREEN PANTHER
