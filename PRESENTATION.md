# Rose & Ivy — E-Commerce Platform
## Client Presentation

---

## 1. PROJECT OVERVIEW

**Rose & Ivy** is a premium e-commerce platform built for a luxury preserved flower brand based in the UAE. The platform enables customers to browse, customize, and purchase bio-preserved floral arrangements that last over a year.

| Attribute | Detail |
|-----------|--------|
| **Platform Type** | Full-Stack E-Commerce Web Application |
| **Technology** | MERN Stack (MongoDB, Express, React, Node.js) |
| **Target Market** | UAE (Primary), International |
| **Currency** | AED (Default) + USD Support |
| **Deployment** | Vercel (Cloud) |
| **Database** | MongoDB Atlas (Cloud) |
| **Payment** | Stripe + Cash on Delivery |

---

## 2. BUSINESS FEATURES DELIVERED

### 🛍️ Customer-Facing Features

| # | Feature | Description |
|---|---------|-------------|
| 1 | **Product Catalog** | Browse preserved flowers with high-quality images, filtering by category, price, and availability |
| 2 | **Smart Search** | Live search-as-you-type in the navigation bar |
| 3 | **Category Navigation** | Hierarchical categories (parent → subcategory) with dedicated landing pages |
| 4 | **Shopping Cart** | Persistent cart for both guests and logged-in users; auto-syncs on login |
| 5 | **Wishlist** | Save favorite products for later purchase |
| 6 | **Secure Checkout** | Multi-step checkout with address management, payment selection |
| 7 | **Online Payments** | Stripe integration for secure card payments |
| 8 | **Cash on Delivery** | COD option for local UAE customers |
| 9 | **Order Tracking** | Real-time order status (Pending → Processing → Shipped → Delivered) |
| 10 | **Coupon System** | Discount codes with percentage/fixed amounts, minimum order, and expiry |
| 11 | **Gift Cards** | Purchase, send to recipients via email, and redeem at checkout |
| 12 | **Bespoke Orders** | Custom floral arrangement enquiry form with image upload |
| 13 | **Product Reviews** | Star ratings and written reviews (one per customer per product) |
| 14 | **Blog** | Content marketing section for SEO and customer engagement |
| 15 | **Multi-Currency** | Toggle between AED and USD with live conversion |
| 16 | **Responsive Design** | Fully responsive across mobile, tablet, and desktop |
| 17 | **WhatsApp Button** | Quick customer support via WhatsApp integration |
| 18 | **Cookie Consent** | GDPR-compliant cookie notice |

### 👤 User Account Features

| Feature | Description |
|---------|-------------|
| **Registration & Login** | Email/password with secure JWT authentication |
| **Password Recovery** | Forgot password flow with email token reset |
| **Profile Management** | Update name, email, and saved addresses |
| **Order History** | View all past orders with detailed breakdown |
| **Address Book** | Save multiple delivery addresses with default selection |

### 🔧 Admin Dashboard

| Feature | Description |
|---------|-------------|
| **Dashboard Stats** | Revenue, orders, users, products at a glance |
| **Product Management** | Create, edit, delete products with image uploads |
| **Category Management** | Create/edit hierarchical categories |
| **Order Management** | View all orders, update status (process, ship, deliver, cancel) |
| **User Management** | View all registered users |
| **Blog Management** | Create and publish blog posts |
| **Image Upload** | Multi-image upload for product galleries |
| **Database Seeding** | One-click test data population |

---

## 3. TECHNICAL ARCHITECTURE

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                       │
│                                                              │
│  ┌─────────┐  ┌──────────┐  ┌───────────┐  ┌───────────┐  │
│  │  React  │  │ Tailwind │  │  Framer   │  │   Vite    │  │
│  │  18.3   │  │  CSS 3.4 │  │  Motion   │  │  (Build)  │  │
│  └────┬────┘  └──────────┘  └───────────┘  └───────────┘  │
│       │                                                      │
│  ┌────▼─────────────────────────────────────────────────┐   │
│  │  Context Providers (Auth + Cart + Currency)           │   │
│  └────┬─────────────────────────────────────────────────┘   │
│       │                                                      │
│  ┌────▼─────────────────────────────────────────────────┐   │
│  │  Axios HTTP Client (JWT Token Auto-Injection)        │   │
│  └────┬─────────────────────────────────────────────────┘   │
└───────┼──────────────────────────────────────────────────────┘
        │ HTTPS (REST API)
        ▼
┌─────────────────────────────────────────────────────────────┐
│                     SERVER (Node.js + Express)                │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Security Layer                                       │   │
│  │  • Helmet (HTTP Headers)                             │   │
│  │  • CORS (Origin Whitelist)                           │   │
│  │  • Rate Limiting (Brute Force Protection)            │   │
│  │  • JWT Authentication                                │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Business Logic Layer                                 │   │
│  │  • 15 Route Modules                                  │   │
│  │  • 14 Controllers                                    │   │
│  │  • File Upload (Multer)                              │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Data Layer (Mongoose ODM)                            │   │
│  │  • 9 Database Models                                 │   │
│  │  • Validation & Relationships                        │   │
│  └──────────────────────────────────────────────────────┘   │
└───────┼──────────────────────────────────────────────────────┘
        │
        ▼
┌─────────────────────┐  ┌─────────────────┐  ┌──────────────┐
│   MongoDB Atlas     │  │   Stripe API    │  │  Email SMTP  │
│   (Cloud Database)  │  │   (Payments)    │  │ (Nodemailer) │
└─────────────────────┘  └─────────────────┘  └──────────────┘
```

---

## 4. TECHNOLOGY STACK

### Frontend

| Technology | Purpose |
|-----------|---------|
| React 18.3 | UI component library |
| React Router 6 | Client-side routing (43 pages) |
| Tailwind CSS 3.4 | Utility-first styling framework |
| Vite 5.4 | Build tool & dev server (fast HMR) |
| Framer Motion | Smooth animations & transitions |
| Axios | HTTP client for API communication |
| Lucide React | Icon library |
| React Toastify | Toast notifications |

### Backend

| Technology | Purpose |
|-----------|---------|
| Node.js | JavaScript runtime |
| Express 4.19 | Web framework |
| MongoDB + Mongoose 8 | Database & ODM |
| JWT (jsonwebtoken) | Stateless authentication |
| bcryptjs | Password hashing (10 rounds) |
| Stripe SDK | Payment processing |
| Multer | File upload handling |
| Helmet | Security headers |
| Morgan | Request logging |
| Nodemailer | Email sending |
| express-rate-limit | DDoS/brute-force protection |

### Infrastructure

| Technology | Purpose |
|-----------|---------|
| Vercel | Hosting & serverless deployment |
| MongoDB Atlas | Managed cloud database |
| Git | Version control |

---

## 5. DATABASE DESIGN

### Collections (9 Total)

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│    Users     │     │   Products   │     │  Categories  │
│──────────────│     │──────────────│     │──────────────│
│ name         │     │ name         │     │ name         │
│ email        │◄────│ slug         │────►│ slug         │
│ password     │     │ description  │     │ image        │
│ role         │     │ images[]     │     │ parent (ref) │
│ addresses[]  │     │ category     │     └──────────────┘
│ wishlist[]   │     │ price        │
└──────┬───────┘     │ salePrice    │     ┌──────────────┐
       │             │ stock        │     │   Reviews    │
       │             │ variants[]   │     │──────────────│
       │             │ rating       │     │ user (ref)   │
       │             └──────────────┘     │ product (ref)│
       │                                  │ rating (1-5) │
       │             ┌──────────────┐     │ comment      │
       │             │    Orders    │     └──────────────┘
       │             │──────────────│
       ├────────────►│ user (ref)   │     ┌──────────────┐
       │             │ items[]      │     │    Carts     │
       │             │ shipping     │     │──────────────│
       │             │ payment      │     │ userId (ref) │
       │             │ status       │     │ items[]      │
       │             │ total        │     └──────────────┘
       │             └──────────────┘
       │                                  ┌──────────────┐
       │             ┌──────────────┐     │  Gift Cards  │
       │             │   Coupons    │     │──────────────│
       │             │──────────────│     │ code         │
       │             │ code         │     │ amount       │
       │             │ discountType │     │ purchasedBy  │
       │             │ discountValue│     │ recipientEmail│
       │             │ expiresAt    │     │ isUsed       │
       │             └──────────────┘     └──────────────┘
       │
       │             ┌──────────────┐
       └────────────►│  Blog Posts  │
                     │──────────────│
                     │ title, slug  │
                     │ content      │
                     │ category     │
                     │ author       │
                     └──────────────┘
```

---

## 6. API ENDPOINTS SUMMARY

The platform exposes **50+ REST API endpoints** organized into 15 modules:

| Module | Endpoints | Access |
|--------|-----------|--------|
| Authentication | 6 | Public / Protected |
| Products | 2 | Public |
| Categories | 2 | Public |
| Cart | 6 | Protected |
| Orders | 3 | Protected |
| Wishlist | 2 | Protected |
| Reviews | 3 | Public / Protected |
| Search | 1 | Public |
| Coupons | 3 | Protected / Admin |
| Payments | 2 | Protected |
| Gift Cards | 3 | Protected |
| Blog | 2 | Public |
| Bespoke Enquiry | 1 | Public |
| Admin | 12 | Admin Only |
| Health Check | 1 | Public |

---

## 7. SECURITY MEASURES

| Layer | Implementation |
|-------|---------------|
| **Authentication** | JWT tokens with 7-day expiry, httpOnly cookies |
| **Password Storage** | bcrypt hashing (10 salt rounds) |
| **HTTP Headers** | Helmet.js (XSS, clickjacking, MIME sniffing protection) |
| **CORS** | Strict origin whitelist |
| **Rate Limiting** | 10 requests per 15 minutes on auth routes |
| **Input Validation** | Mongoose schema validation on all inputs |
| **File Uploads** | Multer with size/type restrictions |
| **Payment Security** | Stripe webhook signature verification |
| **Cookie Security** | httpOnly, Secure, SameSite flags |
| **Admin Protection** | Role-based access control (RBAC) |

---

## 8. USER FLOWS

### Customer Purchase Flow

```
Homepage → Browse/Search → Product Detail → Add to Cart
    → View Cart → Apply Coupon → Checkout
    → Enter/Select Address → Choose Payment (Stripe/COD)
    → Place Order → Order Confirmation
    → Track Order Status (Email Updates)
```

### Guest to Member Conversion

```
Guest browses → Adds items to cart (saved in browser)
    → Decides to register/login
    → Cart automatically syncs (local items merge with server)
    → No items lost during transition
```

### Bespoke Order Flow

```
Customer visits Bespoke page → Fills enquiry form
    → Uploads reference images → Describes requirements
    → Submits enquiry → Admin receives notification
    → Admin contacts customer for quote
```

### Admin Workflow

```
Admin Login → Dashboard (stats overview)
    → Manage Products (add/edit/delete with images)
    → Process Orders (pending → processing → shipped → delivered)
    → View Users & Reviews
    → Publish Blog Posts
```

---

## 9. DESIGN & UI/UX

### Brand Identity

| Element | Value |
|---------|-------|
| **Primary Color** | #D1AFA1 (Blush Rose) |
| **Brand Black** | #1a1a1a |
| **Typography** | Inter (body) + Raleway (headings, light weight) |
| **Style** | Minimalist, luxury, feminine aesthetic |
| **Animations** | Subtle fade-up, float effects, smooth page transitions |

### Responsive Breakpoints

| Device | Width | Adaptations |
|--------|-------|-------------|
| Mobile | < 768px | Hamburger menu, mobile bottom nav, stacked layouts |
| Tablet | 768px–1024px | 2-column grids, collapsible sidebar |
| Desktop | > 1024px | Full navigation, 3-4 column product grids |

### Key UI Components

- **Sticky Navbar** with dynamic transparency on hero sections
- **Announcement Bar** for promotions and offers
- **Product Cards** with hover effects, quick-view, wishlist toggle
- **Mobile Bottom Navigation** for easy thumb access
- **WhatsApp Floating Button** for instant support
- **Cookie Consent Banner** (GDPR compliance)
- **Loading Spinners** for async operations
- **Toast Notifications** for user feedback

---

## 10. DEPLOYMENT & INFRASTRUCTURE

### Production Setup

```
┌─────────────────────────────────────────────┐
│              Vercel Platform                  │
│                                              │
│  ┌────────────────┐  ┌───────────────────┐  │
│  │ Static Assets  │  │ Serverless API    │  │
│  │ (React Build)  │  │ (Express on Edge) │  │
│  │                │  │                   │  │
│  │ CDN Cached     │  │ Auto-scaling      │  │
│  │ Global Edge    │  │ Zero config       │  │
│  └────────────────┘  └───────────────────┘  │
└─────────────────────────────────────────────┘
         │                      │
         │                      ▼
         │          ┌───────────────────┐
         │          │  MongoDB Atlas    │
         │          │  (Cloud DB)       │
         │          │  Auto-backup      │
         │          │  Encryption       │
         │          └───────────────────┘
         ▼
┌─────────────────┐
│  End Users      │
│  (Global CDN)   │
└─────────────────┘
```

### Benefits of This Architecture

| Benefit | Detail |
|---------|--------|
| **Zero Downtime** | Vercel handles deployments with zero-downtime rollouts |
| **Auto-Scaling** | Serverless functions scale automatically with traffic |
| **Global CDN** | Static assets served from nearest edge location |
| **SSL/HTTPS** | Automatic SSL certificates |
| **Git Integration** | Auto-deploy on git push to main branch |
| **Preview Deployments** | Every PR gets a unique preview URL |

---

## 11. PERFORMANCE OPTIMIZATIONS

| Optimization | Implementation |
|-------------|---------------|
| Code Splitting | Vite automatic chunk splitting |
| Image Optimization | Lazy loading, fallback images |
| API Caching | MongoDB connection caching (serverless) |
| Bundle Size | Tree-shaking with Vite build |
| SPA Routing | Client-side navigation (no full page reloads) |
| Demo Fallback | App works even if API is temporarily unavailable |

---

## 12. FUTURE SCALABILITY

The architecture supports easy addition of:

- **Email Marketing** — Nodemailer already integrated
- **Push Notifications** — Service worker ready
- **Multiple Payment Gateways** — Razorpay SDK already included
- **Inventory Management** — Stock tracking built into Product model
- **Analytics Dashboard** — Admin stats endpoint expandable
- **Multi-language** — Context-based architecture supports i18n
- **Mobile App** — Same REST API can serve React Native/Flutter app

---

## 13. DELIVERABLES SUMMARY

| # | Deliverable | Status |
|---|-------------|--------|
| 1 | Responsive E-Commerce Frontend | ✅ Complete |
| 2 | RESTful Backend API (50+ endpoints) | ✅ Complete |
| 3 | MongoDB Database (9 collections) | ✅ Complete |
| 4 | User Authentication & Authorization | ✅ Complete |
| 5 | Product Catalog with Search & Filter | ✅ Complete |
| 6 | Shopping Cart (Guest + Member) | ✅ Complete |
| 7 | Checkout with Stripe & COD | ✅ Complete |
| 8 | Admin Dashboard | ✅ Complete |
| 9 | Coupon & Gift Card System | ✅ Complete |
| 10 | Bespoke Order Enquiry | ✅ Complete |
| 11 | Blog System | ✅ Complete |
| 12 | Review & Rating System | ✅ Complete |
| 13 | Wishlist | ✅ Complete |
| 14 | Multi-Currency Support | ✅ Complete |
| 15 | Vercel Cloud Deployment | ✅ Complete |
| 16 | Security Implementation | ✅ Complete |

---

## 14. CONTACT & ACCESS

| Item | Detail |
|------|--------|
| **Live URL** | https://rose-ivy-e-commerce.vercel.app |
| **Repository** | GitHub (private) |
| **Admin Access** | Provided separately |
| **Tech Stack Docs** | Available on request |

---

*Presented by: Development Team*
*Date: June 2026*
*Project: Rose & Ivy E-Commerce Platform*
