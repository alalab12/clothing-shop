# 👗 Clothing Shop - E-Commerce Web Application

A modern, full-stack e-commerce application built with Vue 3 and Express.js.

## 📋 Project Overview

Clothing Shop is a professional e-commerce platform that allows users to:
- ✅ Browse products across multiple clothing categories
- ✅ Create secure user accounts with password hashing
- ✅ Manage shopping cart with size/color selection
- ✅ Place orders with automatic stock decrement
- ✅ View order history and profile information
- ✅ Contact the store with inquiries

## 🏗️ Architecture

### Modern Stack
- **Frontend**: Vue 3 with Composition API
- **Backend**: Node.js + Express.js
- **Database**: SQLite3
- **Authentication**: Session-based (express-session)
- **Security**: bcrypt password hashing

### Design Patterns
- **Backend**: MVC with Service Layer
- **Frontend**: Component-based with Composables
- **API**: RESTful design
- **State Management**: Global composables

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed documentation.

## 📁 Project Structure

```
clothing-shop-v2/
├── server/                          # Backend API
│   ├── middleware/                  # Express middleware
│   ├── routes/                      # API routes
│   ├── controllers/                 # Request handlers
│   ├── services/                    # Business logic
│   ├── validators/                  # Data validation
│   ├── server.js                    # Entry point
│   └── database.js                  # DB setup
│
├── client/                          # Frontend Vue 3 App
│   ├── src/
│   │   ├── components/              # Vue components
│   │   ├── composables/             # Reusable logic (useAuth, useCart, etc)
│   │   ├── services/                # API client (api.js)
│   │   ├── router/                  # Vue Router config
│   │   ├── App.vue                  # Root component
│   │   └── main.js                  # App initialization
│   └── public/
│       └── index.html               # HTML entry point
│
└── ARCHITECTURE.md                  # Detailed architecture documentation
```

## 🚀 Quick Start

### Prerequisites
- Node.js 14+
- npm or yarn

### Installation

1. **Clone the repository**
```bash
cd clothing-shop-v2
```

2. **Install backend dependencies**
```bash
cd server
npm install
```

3. **Install frontend dependencies**
```bash
cd ../client
npm install
cd ..
```

### Running the Application

**Terminal 1 - Start Backend:**
```bash
cd server
npm start
```
Backend will run on `http://localhost:3000`

**Terminal 2 - Start Frontend:**
```bash
cd client
npm run serve
```
Frontend will run on `http://localhost:8080`

### Access the App
Open your browser and navigate to: **http://localhost:8080**

## 🔑 Key Features

### 👤 Authentication
- Secure user registration and login
- Password validation (minimum 8 characters)
- bcrypt hashing with 10 salt rounds
- Session-based authentication with secure cookies
- Logout with session destruction

### 🛒 Shopping Cart
- Add items with size and color selection
- View cart with item details and prices
- Remove items or clear entire cart
- Real-time cart synchronization
- Cart totals calculation

### 📦 Orders
- Stock verification before order creation
- Automatic stock decrement on order placement
- Order history for authenticated users
- Shipping address capture
- Order confirmation with order ID

### 📱 Product Browsing
- Browse products by category (Dresses, Jeans, T-Shirts, Jackets, Skirts, Suiting, Accessories)
- View detailed product information
- Display available sizes and colors
- Search functionality

### ✉️ Contact Form
- Submit inquiries and feedback
- Email validation
- Message storage

### 🎨 User Interface
- Responsive design for all devices
- Professional black & white theme
- Background imagery (Nanjing city, grayscale)
- Arial/Helvetica typography with letter-spacing
- English language support

## 🔐 Security Features

- **Password Security**: bcrypt hashing with 10 salt rounds
- **Session Security**: 
  - httpOnly cookies (prevent XSS)
  - sameSite: 'lax' (prevent CSRF)
  - Secure flag (HTTPS in production)
- **Input Validation**: Server-side validation for all inputs
- **CORS Configuration**: Restricted to localhost origins

## 📊 API Endpoints

### Authentication (Public)
```
POST   /api/auth/register    - Register new user
POST   /api/auth/login       - Login user
POST   /api/auth/logout      - Logout (destroy session)
GET    /api/auth/session     - Check authentication status
```

### Products (Public)
```
GET    /api/products         - Get all products
GET    /api/products/:id     - Get product by ID
```

### Cart (Protected)
```
GET    /api/cart             - Get user's cart
POST   /api/cart             - Add item to cart
DELETE /api/cart/:id         - Remove item
DELETE /api/cart             - Clear cart
```

### Orders (Protected)
```
POST   /api/orders           - Create order
GET    /api/orders           - Get user's orders
```

### Profile (Protected)
```
GET    /api/profile          - Get user profile
```

### Contact (Public)
```
POST   /api/contact          - Submit contact message
```

## 📚 Frontend Composables

The frontend uses Vue 3 Composition API composables for state management:

### `useAuth()`
Manages user authentication state and operations.
```javascript
const { user, isAuthenticated, login, register, logout } = useAuth()
```

### `useCart()`
Manages shopping cart state and operations.
```javascript
const { items, cartTotal, cartCount, addItem, removeItem } = useCart()
```

### `useProducts()`
Manages product fetching and filtering.
```javascript
const { products, fetchAll, fetchById, search } = useProducts()
```

### `useOrders()`
Manages order creation and retrieval.
```javascript
const { orders, createOrder, fetchOrders } = useOrders()
```

### `useContact()`
Manages contact form operations.
```javascript
const { sendMessage, loading, successMessage } = useContact()
```

## 🗄️ Database Schema

### Tables
- **users**: User accounts with email, hashed password, profile info
- **products**: Product catalog with name, price, category, image
- **stock**: Inventory with product ID, size, color, quantity
- **cart_items**: User shopping cart items
- **orders**: Order records with total, shipping address, status
- **order_items**: Order line items with product details and price snapshot
- **contact_messages**: Contact form submissions

## 🧪 Testing

### Manual Testing Checklist
1. **Registration**: Create new user account
   - Test password validation (< 8 chars)
   - Test email uniqueness
   - Test phone format validation

2. **Login/Logout**: Authenticate and destroy session

3. **Product Browsing**: Browse and search products

4. **Shopping**: Add items to cart with size/color selection

5. **Orders**: Create order and verify stock decrement

6. **Order History**: View past orders

7. **Contact Form**: Submit contact message

## 📝 Code Quality

### Standards Implemented
- **Clear naming**: CamelCase for variables/functions
- **Comments**: JSDoc comments on all functions
- **Structure**: Logical folder organization with separation of concerns
- **Validation**: Input validation at both client and server
- **Error Handling**: Try-catch blocks, meaningful error messages
- **Readability**: Consistent code style throughout

## 🎓 Learning References

This project implements patterns from the course materials:

- **04-vue.pdf**: Composition API, Custom Composables, Vue Router
- **03-ModernFrontEnd.pdf**: Component Architecture, SPAs, State Management
- **06-Nodejs.pdf**: Express.js, Middleware, Routing
- **05-ModernBackEnd.pdf**: MVC Pattern, Service Layer, API Design
- **07-Authentication and database.pdf**: Session Auth, Password Hashing, SQLite

## 📅 Project Information

- **Course**: Advanced Web Programming
- **Project Type**: E-Commerce Application
- **Deadline**: 2025.12.17 23:59
- **Presentation**: During final week of course

## 💡 Key Design Decisions

1. **Session-based Authentication**: Simpler than JWT, better for server-side session management
2. **Service Layer**: Separates business logic from routes, improves testability
3. **Composition API**: Modern Vue 3 pattern with better code organization
4. **Composables for State**: Lightweight alternative to external state management libraries
5. **SQLite Database**: File-based, easy setup, sufficient for project scope

## 🚦 Getting Help

If you encounter issues:

1. Ensure Node.js and npm are installed
2. Check that both backend and frontend are running
3. Verify port 3000 (backend) and 8080 (frontend) are available
4. Clear browser cache if styles look incorrect
5. Check console logs for error messages

## 📄 License

This project is for educational purposes.

---

**Happy Shopping! 👕👖👗**
