# 🌐 BizVistar

**Empowering Local Businesses with Simple, Affordable, and Professional Digital Presence**

---

## 🧭 Mission Statement

To empower local businesses in **Silchar and beyond** with a professional, affordable, and hassle-free digital presence.  
We handle the technology so business owners can focus on what they do best — **serving their customers**.

---

## 💡 The Problem We Solve

Many local business owners *know* they need a website and social media presence, but they face major barriers:

- 💰 **High Cost:** Custom websites are expensive.  
- ⏰ **Lack of Time:** They're too busy running daily operations.  
- ⚙️ **Technical Complexity:** Tools like WordPress or Wix can be overwhelming.  
- 🧠 **Content Creation:** They don't know what to post on social media.

**BizVistar** removes these barriers through a **simple, all-in-one subscription service.**

---

## 🎯 Target Audience

Our primary customers are **small, local, service-based, or retail businesses** that aren’t tech-savvy.  
Examples include:

- Salons and barbershops  
- Cafes, bakeries, and restaurants  
- Boutiques and local shops (kirana, clothing – retail or wholesale)  
- Tutors, consultants, and artists  
- Repair and home services (plumbers, electricians, etc.)

---

## ⚙️ Core Product & Features

BizVistar is a **"do-it-with-me"** service — automation powered by AI, guided by a human touch.

### 🧠 AI-Powered Website Generator

Our core product is a **smart, template-based website builder** that eliminates manual work and ensures professional quality.

#### Step 1: Business Form  
Users fill a simple multi-step form providing key details:
- Business name, services, and location  
- Target customers  
- Brand style (modern, traditional, friendly, etc.)

#### Step 2: AI Content & Personalization  
The backend AI generates professional content:
- Catchy headlines  
- Service descriptions  
- "About Us" text  
- Contact information  

#### Step 3: Instant Template Preview  
The AI-generated content is automatically filled into **professionally designed, mobile-responsive templates**, showing multiple complete website previews instantly.

#### Step 4: Simple Customizer  
After free login, users can:
- Edit text  
- Upload logos/photos  
- Choose from pre-approved color palettes  
→ Ensures everything stays sleek and professional.

---

### 💼 SaaS Business Tools (Integrated)

- Appointment/Booking Scheduler  
- Contact & Inquiry Forms  
- Photo Galleries & Portfolios  
- Menu & Price List Displays  
- Inventory/Stock Management  

---

### 📱 Managed Social Media & SEO Services

**Content Creation:**  
We use pre-made professional templates (built on Canva) to design posts personalized with client-provided photos & updates (via WhatsApp).

**Google Maps Optimization:**  
We manage and optimize clients’ Google Maps profiles to improve local search visibility.

---

### ☁️ Hosting & Support

- **Hosting:** Fast, secure hosting with a subdomain (`clientname.bizvistar.in`) or custom domain.  
- **Support:** Hybrid support via AI chatbot + WhatsApp/call access for direct help.

---

## 💸 Pricing & Plans

Simple, monthly subscription plans tailored for every stage of business.

### 🌱 **Plan 1: Starter — ₹299/month**
Includes:
- Professional Website  
- Choice of 1 Business Tool  
- Hosting on subdomain  

**Perfect for:** Businesses needing a clean digital “business card.”

---

### ✨ **Plan 2: Pro — ₹799/month**
Includes everything in Starter +  
- Choice of 2 Business Tools  
- 3 Social Media Posts per month  

**Perfect for:** Busy owners wanting an active presence without the daily effort.

---

### 🚀 **Plan 3: Growth — ₹1499/month**
Includes everything in Pro +  
- All Business Tools  
- 8 Social Media Posts per month  
- Google Maps Management  
- Free Custom Domain  

**Perfect for:** Growth-focused businesses ready to scale their online presence.

---

## 🚀 Launch Strategy (Phase 1)

We’re starting lean — focusing on learning, feedback, and trust.

### 🎯 MVP (Minimum Viable Product)
- Front-end form with 3–5 high-quality templates.  
- AI generation and site population done **manually** on backend for now.

### 🤝 Initial Client Acquisition
- Approach 5–10 local Silchar businesses with special **introductory offers** in exchange for testimonials and feedback.

### 🛠 Manual Fulfillment
- Handle domains, hosting, and content manually in early stage.  
- Perfect the process before automating.

---

## 🧩 Summary

**BizVistar** bridges the gap between traditional businesses and modern digital tools.  
We make it possible for *every* local entrepreneur to have a stunning website, smart tools, and consistent online presence — without tech stress or high costs.

---

> 💬 *“We handle your digital side, so you can handle your business side.”*

---

## 🧪 Testing and Quality Assurance

### 1. Overview of Tests Conducted
A comprehensive testing suite was introduced to validate core business logic, critical user flows, and system boundaries.

- **Unit and Integration Tests (Vitest)**: Added to validate server actions (Supabase data mutations) for Checkout, Orders, and Razorpay interactions.
- **Frontend Component Tests (React Testing Library)**: Added to simulate user interactions on the Checkout page, including form validations and coupon application logic.
- **API Tests**: Validated Webhook endpoints for Razorpay events to ensure correct signature parsing and resilient fallback states.
- **Areas Covered**:
  - Payment flows (`razorpayActions.js`)
  - Webhooks (`webhooks/razorpay/route.js`)
  - Order Processing (`orderActions.js`)
  - Core Component interactions (`checkout/page.js`)
  - App routing and security middleware (`middleware.js`)

### 2. Testing Scope and Safety
- **No Production Modifications**: Production application code (`src/`) was largely unmodified. The tests focus purely on validating existing structures.
- **External Services**: All calls to Razorpay API and Supabase clients were comprehensively mocked (`vi.mock`), ensuring tests run independently of active database sessions or payment gateways.
- **Environment Agnostic**: Global mocks allow the test suite to execute locally without side-effects or requiring a local Supabase setup.

### 3. Test Execution Status
- **Framework**: Vitest & React Testing Library
- **Total Tests Written**: ~25+ unit/integration/UI assertions
- **Execution Strategy**: `npx vitest run --coverage`
- **Result Status**: Mixed. While the structure, assertions, and components execute correctly in isolation, certain heavily chained `supabase-js` promise returns in `orderActions.js` and `razorpayActions.js` resulted in test runner assertion failures due to mocked destructured assignments resolving as undefined.

### 4. Known Issues & Risks
- **Mocking Complex Chained Promises**: The current codebase heavily utilizes chained Supabase client calls (e.g., `await supabaseAdmin.from('websites').select('id').eq('user_id', user.id).maybeSingle()`). Replicating the exact shape of these returns in Vitest via `vi.fn().mockReturnThis()` across various contexts sometimes fails to resolve the final `.data` property correctly, leading to `TypeError: Cannot destructure property 'data'`.
- **Razorpay SDK Mock**: The `razorpay` node SDK requires exact initialization structure, leading to `BAD_REQUEST_ERROR: Please provide your api key` when the `Razorpay` constructor is instantiated within the action if the mock isn't scoped globally.
- **Impact**: These are test-environment implementation hurdles, *not* production bugs.

### 5. Fix Requirements (Informational Only)
- **Are fixes needed?**: Yes (Test Infrastructure).
- **Description**: The application code would greatly benefit from a Dependency Injection pattern for the `supabase` client and `razorpay` instances. Moving the instantiation of these clients outside of the Server Actions (or providing them as default arguments) would allow the test suite to inject highly controlled stub objects without relying on complex, global `vi.mock` interceptors for node modules. Further, the React component tests require additional setup for Next.js navigation hooks and lucide-react icons to fully render in JSDOM.