/**
 * ============================================================================
 * CLOTHING SHOP - PROJECT ARCHITECTURE DOCUMENTATION
 * ============================================================================
 * 
 * Modern Full-Stack E-Commerce Application
 * Built with Vue 3 (Frontend) + Express.js (Backend) + SQLite (Database)
 * 
 * Project Deadline: 2025.12.17 23:59
 * 
 * ============================================================================
 * TABLE OF CONTENTS
 * ============================================================================
 * 1. Project Overview
 * 2. Architecture Overview
 * 3. Backend Structure & Patterns
 * 4. Frontend Structure & Patterns
 * 5. Database Design
 * 6. API Endpoints
 * 7. Key Features
 * 8. Installation & Running
 * 
 * ============================================================================
 * 1. PROJECT OVERVIEW
 * ============================================================================
 * 
 * Clothing Shop is a full-stack e-commerce web application that allows users to:
 * - Browse and search for clothing products across categories
 * - Create accounts and manage user profiles
 * - Add items to shopping cart with size/color selection
 * - Place orders and track order history
 * - View detailed product information with available stock
 * - Contact the store with inquiries
 * 
 * Technologies:
 * - Frontend: Vue 3 with Composition API, Vue Router, Axios
 * - Backend: Node.js, Express.js, SQLite3, bcrypt
 * - Architecture: Client-Server with RESTful API
 * - Authentication: Session-based (express-session)
 * 
 * ============================================================================
 * 2. ARCHITECTURE OVERVIEW
 * ============================================================================
 * 
 * This project implements a modern, scalable architecture:
 * 
 * CLIENT (Vue 3 SPA)
 *     ↓ HTTP Requests (JSON)
 * [CORS] 
 *     ↓
 * EXPRESS API SERVER
 *     ├── Routes (HTTP endpoints)
 *     ├── Controllers (Request handling)
 *     ├── Services (Business logic)
 *     ├── Validators (Data validation)
 *     └── Middleware (Auth, Error handling)
 *     ↓
 * SQLite DATABASE
 *     ├── users
 *     ├── products
 *     ├── stock
 *     ├── cart_items
 *     ├── orders
 *     ├── order_items
 *     └── contact_messages
 * 
 * ============================================================================
 * 3. BACKEND STRUCTURE & PATTERNS
 * ============================================================================
 * 
 * Pattern: MVC (Model-View-Controller) with Service Layer
 * Reference: 05-ModernBackEnd.pdf - Modern Backend Architecture
 * 
 * server/
 * ├── server.js                 # Main application entry point
 * │                              # Configures Express, middleware, routes
 * │
 * ├── database.js               # Database initialization and connection
 * │                              # Creates tables if not exist
 * │
 * ├── config/                   # Configuration files
 * │   └── ... (for future expansion)
 * │
 * ├── middleware/               # Express middleware
 * │   ├── authMiddleware.js     # Authentication checks (requireAuth)
 * │   ├── validationMiddleware.js # Input validation (validateRequired, etc)
 * │   └── errorHandler.js       # Global error handling & async wrapper
 * │
 * ├── routes/                   # API endpoint definitions
 * │   ├── authRoutes.js         # /api/auth/* endpoints
 * │   ├── productRoutes.js      # /api/products/* endpoints
 * │   ├── cartRoutes.js         # /api/cart/* endpoints
 * │   ├── orderRoutes.js        # /api/orders/* endpoints
 * │   ├── profileRoutes.js      # /api/profile/* endpoints
 * │   └── contactRoutes.js      # /api/contact/* endpoints
 * │
 * ├── controllers/              # Request handlers & response logic
 * │   ├── authController.js     # Auth operations (login, register, logout)
 * │   ├── productController.js  # Product fetching
 * │   ├── cartController.js     # Cart operations
 * │   ├── orderController.js    # Order creation & retrieval
 * │   ├── profileController.js  # User profile
 * │   └── contactController.js  # Contact form submissions
 * │
 * ├── services/                 # Business logic & data operations
 * │   ├── authService.js        # User registration, login, authentication
 * │   ├── productService.js     # Product fetching & filtering
 * │   ├── cartService.js        # Cart item management
 * │   ├── orderService.js       # Order creation, stock verification
 * │   └── contactService.js     # Contact message storage
 * │
 * ├── validators/               # Data validation logic
 * │   └── authValidator.js      # Auth data validation rules
 * │
 * └── utils/                    # Utility functions & helpers
 *     └── ... (for future helpers)
 * 
 * KEY PATTERNS:
 * 
 * 1. MIDDLEWARE (Express pattern)
 *    - authMiddleware: Protects routes requiring authentication
 *    - validationMiddleware: Validates request data before processing
 *    - errorHandler: Catches and responds to errors globally
 * 
 * 2. CONTROLLER LAYER (MVC pattern)
 *    - Handles HTTP request/response
 *    - Delegates business logic to services
 *    - Example: authController.register() calls authService.registerUser()
 * 
 * 3. SERVICE LAYER (Separation of Concerns)
 *    - Contains business logic
 *    - Handles database operations
 *    - Can be reused by multiple controllers
 *    - Returns Promises for async operations
 * 
 * 4. AUTHENTICATION (Stateful Session-based)
 *    - express-session for session management
 *    - Session ID stored in secure, httpOnly cookie
 *    - Prevents XSS and CSRF attacks
 *    - Reference: 07-Authentication and database.pdf
 * 
 * 5. PASSWORD HASHING (Security)
 *    - bcrypt with 10 salt rounds
 *    - Slow hashing resists brute-force attacks
 *    - Reference: 07-Authentication and database.pdf
 * 
 * ============================================================================
 * 4. FRONTEND STRUCTURE & PATTERNS
 * ============================================================================
 * 
 * Pattern: Component-Based Architecture with Composition API
 * Reference: 04-vue.pdf - Vue 3 & Composition API
 * Reference: 03-ModernFrontEnd.pdf - Modern Frontend Architecture
 * 
 * client/src/
 * ├── main.js                   # Vue app initialization
 * │                              # Creates app, registers router, mounts to #app
 * │
 * ├── App.vue                   # Root component
 * │                              # Provides NavBar, layout, router outlet
 * │
 * ├── router/
 * │   └── index.js              # Vue Router configuration
 * │                              # Defines all client-side routes
 * │                              # Pattern: SPA with client-side routing
 * │
 * ├── components/               # Reusable Vue components
 * │   ├── NavBar.vue            # Navigation header
 * │   ├── HomePage.vue          # Landing page with hero section
 * │   ├── CategoryPage.vue      # Product category listing
 * │   ├── ProductDetails.vue    # Individual product details
 * │   ├── Cart.vue              # Shopping cart view
 * │   ├── Payment.vue           # Checkout & order creation
 * │   ├── OrderConfirmation.vue # Order success page
 * │   ├── Login.vue             # User login form
 * │   ├── Register.vue          # User registration form
 * │   ├── Profile.vue           # User profile view
 * │   ├── Dresses.vue           # Dresses category
 * │   ├── TShirts.vue           # T-Shirts category
 * │   ├── Jeans.vue             # Jeans category
 * │   ├── Jackets.vue           # Jackets category
 * │   ├── Skirts.vue            # Skirts category
 * │   ├── Suiting.vue           # Suiting category
 * │   └── Accessories.vue       # Accessories category
 * │
 * ├── composables/              # Reusable logic (Composition API)
 * │   │
 * │   ├── useAuth.js            # Authentication state & operations
 * │   │                          # - Global user state
 * │   │                          # - login(), register(), logout()
 * │   │                          # - isAuthenticated computed property
 * │   │                          # - Pattern: Global state management
 * │   │
 * │   ├── useCart.js            # Shopping cart management
 * │   │                          # - Global cart items state
 * │   │                          # - addItem(), removeItem(), clearCart()
 * │   │                          # - cartCount, cartTotal computed properties
 * │   │                          # - Pattern: Shared state between components
 * │   │
 * │   ├── useProducts.js        # Product fetching & filtering
 * │   │                          # - fetchAll(), fetchById()
 * │   │                          # - getByCategory(), search()
 * │   │
 * │   ├── useOrders.js          # Order management
 * │   │                          # - createOrder(), fetchOrders()
 * │   │
 * │   └── useContact.js         # Contact form operations
 * │                              # - sendMessage(), clearMessages()
 * │
 * ├── services/                 # API communication layer
 * │   └── api.js                # Centralized API client
 * │                              # - authAPI, productAPI, cartAPI, etc.
 * │                              # - Fetch with proper headers & credentials
 * │                              # - Error handling
 * │                              # - Pattern: Service layer for API calls
 * │
 * ├── assets/                   # Static assets
 * │   ├── img/                  # Images (products, background)
 * │   └── ... (stylesheets, etc)
 * │
 * ├── public/
 * │   └── index.html            # HTML entry point
 * │                              # Contains <div id="app"></div>
 * │                              # lang="en" for English validation messages
 * │
 * └── ... (vue.config.js, babel.config.js, etc)
 * 
 * KEY PATTERNS:
 * 
 * 1. COMPOSITION API (Modern Vue 3 pattern)
 *    - useAuth, useCart, etc are composables (reusable logic units)
 *    - Encapsulate related state and methods
 *    - Can be imported in multiple components
 *    - Reference: 04-vue.pdf - Composition API
 * 
 * 2. COMPONENT-BASED ARCHITECTURE
 *    - Small, focused components with single responsibility
 *    - Props for parent→child communication
 *    - $emit for child→parent communication
 *    - Slots for flexible layouts
 *    - Reference: 03-ModernFrontEnd.pdf - Component-based Architecture
 * 
 * 3. STATE MANAGEMENT (Global State via Composables)
 *    - useAuth: Global user authentication state
 *    - useCart: Global shopping cart state
 *    - Reactive refs shared across components
 *    - Computed properties for derived state
 *    - Pattern: Similar to Pinia/Vuex but simpler
 * 
 * 4. SERVICE LAYER (API Communication)
 *    - api.js centralizes all fetch calls
 *    - Consistent error handling
 *    - Credentials: 'include' for session cookies
 *    - Reference: 03-ModernFrontEnd.pdf - Service layer pattern
 * 
 * 5. ROUTING (Single Page Application)
 *    - Vue Router for client-side navigation
 *    - No full page reload on route change
 *    - Lazy loading of components
 *    - Reference: 03-ModernFrontEnd.pdf - SPAs & Routing
 * 
 * ============================================================================
 * 5. DATABASE DESIGN
 * ============================================================================
 * 
 * Schema Overview:
 * 
 * users
 * ├── id (INTEGER PRIMARY KEY)
 * ├── email (TEXT UNIQUE)
 * ├── password (TEXT) - bcrypt hashed
 * ├── firstName (TEXT)
 * ├── lastName (TEXT)
 * ├── phone (TEXT)
 * └── createdAt (DATETIME)
 * 
 * products
 * ├── id (INTEGER PRIMARY KEY)
 * ├── name (TEXT)
 * ├── description (TEXT)
 * ├── price (REAL)
 * ├── category (TEXT) - dresses, jeans, t-shirts, jackets, skirts, suiting, accessories
 * └── image (TEXT) - image path
 * 
 * stock
 * ├── id (INTEGER PRIMARY KEY)
 * ├── productId (INTEGER FK)
 * ├── size (TEXT)
 * ├── color (TEXT)
 * └── quantity (INTEGER) - decrements on order
 * 
 * cart_items
 * ├── id (INTEGER PRIMARY KEY)
 * ├── userId (INTEGER FK)
 * ├── productId (INTEGER FK)
 * ├── size (TEXT)
 * ├── color (TEXT)
 * └── quantity (INTEGER)
 * 
 * orders
 * ├── id (INTEGER PRIMARY KEY)
 * ├── userId (INTEGER FK)
 * ├── total (REAL)
 * ├── shippingAddress (TEXT JSON)
 * ├── status (TEXT) - confirmed, shipped, delivered
 * └── createdAt (DATETIME)
 * 
 * order_items
 * ├── id (INTEGER PRIMARY KEY)
 * ├── orderId (INTEGER FK)
 * ├── productId (INTEGER FK)
 * ├── size (TEXT)
 * ├── color (TEXT)
 * ├── quantity (INTEGER)
 * └── price (REAL) - price at order time
 * 
 * contact_messages
 * ├── id (INTEGER PRIMARY KEY)
 * ├── email (TEXT)
 * ├── message (TEXT)
 * └── createdAt (DATETIME)
 * 
 * KEY FEATURES:
 * - Email uniqueness in users table prevents duplicate accounts
 * - Foreign keys ensure referential integrity
 * - Stock is decremented on order creation (business requirement)
 * - Order items store price snapshot (prevents price changes in history)
 * 
 * ============================================================================
 * 6. API ENDPOINTS (RESTful Design)
 * ============================================================================
 * 
 * Reference: 05-ModernBackEnd.pdf & 06-Nodejs.pdf - RESTful API Design
 * 
 * BASE_URL: http://localhost:3000/api
 * 
 * AUTHENTICATION (Public)
 * POST   /auth/register      - Create new user account
 * POST   /auth/login         - Authenticate user
 * POST   /auth/logout        - Destroy session
 * GET    /auth/session       - Check authentication status
 * 
 * PRODUCTS (Public)
 * GET    /products           - Get all products
 * GET    /products/:id       - Get product by ID with stock info
 * 
 * CART (Protected - requires authentication)
 * GET    /cart               - Get user's cart items
 * POST   /cart               - Add item to cart
 * DELETE /cart/:id           - Remove item from cart
 * DELETE /cart               - Clear entire cart
 * 
 * ORDERS (Protected)
 * POST   /orders             - Create order from cart
 * GET    /orders             - Get user's orders
 * 
 * PROFILE (Protected)
 * GET    /profile            - Get authenticated user's profile
 * 
 * CONTACT (Public)
 * POST   /contact            - Submit contact form
 * 
 * HTTP Methods:
 * - GET: Retrieve data (safe, idempotent)
 * - POST: Create/Modify data (not idempotent)
 * - DELETE: Remove data (idempotent)
 * - PUT: Full replacement (idempotent)
 * 
 * Status Codes:
 * - 200: OK
 * - 201: Created
 * - 400: Bad Request (validation error)
 * - 401: Unauthorized (not authenticated)
 * - 403: Forbidden (not authorized)
 * - 404: Not Found
 * - 500: Server Error
 * 
 * ============================================================================
 * 7. KEY FEATURES IMPLEMENTED
 * ============================================================================
 * 
 * ✅ USER AUTHENTICATION
 *    - Secure password hashing with bcrypt (10 rounds)
 *    - Session-based authentication with express-session
 *    - Session cookies with secure flags (httpOnly, sameSite)
 *    - Login/Register validation
 *    - Logout with session destruction
 * 
 * ✅ SHOPPING CART
 *    - Add items with size/color selection
 *    - Remove specific items
 *    - Clear entire cart
 *    - Real-time cart synchronization with server
 *    - Cart totals computed client-side
 * 
 * ✅ ORDERS & STOCK MANAGEMENT
 *    - Stock verification before order creation
 *    - Stock automatic decrement on order completion
 *    - Order history for authenticated users
 *    - Shipping address capture
 *    - Order confirmation page
 * 
 * ✅ PRODUCT BROWSING
 *    - Browse products by category
 *    - View detailed product information
 *    - Display available sizes and colors
 *    - Search functionality
 * 
 * ✅ FORM VALIDATION
 *    - Password minimum 8 characters
 *    - Phone number format validation (international)
 *    - Email format validation
 *    - Required field validation
 *    - Validation messages displayed via alert()
 * 
 * ✅ USER PROFILE
 *    - View personal information
 *    - Order history
 *    - Profile management
 * 
 * ✅ CONTACT FORM
 *    - Submit inquiries/feedback
 *    - Email and message validation
 *    - Server-side message storage
 * 
 * ✅ ERROR HANDLING
 *    - Client-side validation with alert()
 *    - Server-side validation with error responses
 *    - Global error handler middleware
 *    - User-friendly error messages
 * 
 * ✅ RESPONSIVE DESIGN
 *    - Mobile-friendly layout
 *    - Flexible CSS with Arial/Helvetica typography
 *    - Professional design with black & white theme
 *    - Background imagery (Nanjing city)
 * 
 * ✅ INTERNATIONALIZATION
 *    - HTML lang="en" for English validation messages
 *    - All error messages in English
 *    - Form labels in English
 * 
 * ============================================================================
 * 8. INSTALLATION & RUNNING
 * ============================================================================
 * 
 * PREREQUISITES:
 * - Node.js 14+ and npm
 * - Git
 * 
 * INSTALLATION:
 * 
 * 1. Clone repository
 *    git clone <repository-url>
 *    cd clothing-shop-v2
 * 
 * 2. Install backend dependencies
 *    cd server
 *    npm install
 * 
 * 3. Install frontend dependencies
 *    cd ../client
 *    npm install
 * 
 * RUNNING:
 * 
 * Backend (Terminal 1):
 *    cd server
 *    npm start
 *    # Server runs on http://localhost:3000
 * 
 * Frontend (Terminal 2):
 *    cd client
 *    npm run serve
 *    # App runs on http://localhost:8080
 * 
 * Access the application:
 *    - Open browser to http://localhost:8080
 * 
 * STOPPING:
 *    - Press Ctrl+C in both terminals
 * 
 * ============================================================================
 * KEY ARCHITECTURAL DECISIONS
 * ============================================================================
 * 
 * 1. SESSION-BASED AUTHENTICATION (over JWT)
 *    - Simpler implementation
 *    - Server-side session management
 *    - Secure cookie-based authentication
 *    - Easier logout (destroy session)
 * 
 * 2. SERVICE LAYER PATTERN
 *    - Separates business logic from route handlers
 *    - Improves testability
 *    - Allows service reuse
 *    - Cleaner code organization
 * 
 * 3. COMPOSITION API (over Options API)
 *    - Modern Vue 3 pattern
 *    - Better code organization
 *    - Easier to share logic between components
 *    - Smaller bundle size
 * 
 * 4. COMPOSABLES FOR STATE MANAGEMENT (over Pinia)
 *    - Lightweight
 *    - No external dependency
 *    - Simple and understandable
 *    - Sufficient for project scope
 * 
 * 5. SQLITE DATABASE (over MySQL/PostgreSQL)
 *    - File-based, easy setup
 *    - No server configuration needed
 *    - Sufficient for project scope
 *    - Easy migrations
 * 
 * ============================================================================
 * CODE QUALITY STANDARDS
 * ============================================================================
 * 
 * ✅ READABILITY
 *    - Clear variable and function names
 *    - Consistent naming conventions (camelCase)
 *    - Comments explaining complex logic
 *    - JSDoc comments for functions
 * 
 * ✅ STRUCTURE
 *    - Organized folder structure
 *    - Separation of concerns
 *    - Single Responsibility Principle
 *    - DRY (Don't Repeat Yourself)
 * 
 * ✅ DOCUMENTATION
 *    - This file (architecture documentation)
 *    - JSDoc comments throughout codebase
 *    - Clear commit messages
 * 
 * ✅ ERROR HANDLING
 *    - Try-catch blocks in async functions
 *    - Meaningful error messages
 *    - Global error handler middleware
 *    - User-friendly error display
 * 
 * ============================================================================
 * REFERENCES TO COURSE MATERIALS
 * ============================================================================
 * 
 * 04-vue.pdf
 * - Composition API implementation
 * - Custom composables pattern
 * - Vue Router for SPAs
 * - Component communication (props, emit, slots)
 * 
 * 03-ModernFrontEnd.pdf
 * - Component-based architecture
 * - SPA (Single Page Application) pattern
 * - State management patterns
 * - Service layer for API communication
 * 
 * 06-Nodejs.pdf
 * - Express.js framework
 * - Middleware pattern
 * - Routing and HTTP methods
 * - Async/Promises
 * 
 * 05-ModernBackEnd.pdf
 * - MVC architecture pattern
 * - Service layer design
 * - API design principles
 * - Error handling
 * 
 * 07-Authentication and database.pdf
 * - Session-based authentication
 * - Password hashing with bcrypt
 * - SQLite database design
 * - Security best practices
 * 
 * ============================================================================
 * END OF DOCUMENTATION
 * ============================================================================
 */
