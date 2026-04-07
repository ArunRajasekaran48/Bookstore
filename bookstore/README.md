# 📚 BookHaven — Online Bookstore with Smart Inventory

> Full-stack application built with **Spring Boot** (backend) + **React + TailwindCSS** (frontend) + **MySQL** (database)

---

## 🗂️ Project Structure

```
bookstore/
├── server/                          # Spring Boot Backend
│   ├── pom.xml
│   └── src/main/java/com/bookstore/
│       ├── BookstoreApplication.java
│       ├── config/
│       │   └── SecurityConfig.java
│       ├── controller/
│       │   ├── AuthController.java
│       │   ├── BookController.java
│       │   ├── CategoryController.java
│       │   ├── CartController.java
│       │   ├── OrderController.java
│       │   └── InventoryController.java
│       ├── dto/
│       │   ├── ApiResponse.java
│       │   ├── AuthDTOs.java
│       │   ├── BookDTOs.java
│       │   ├── CategoryDTOs.java
│       │   └── CartOrderDTOs.java
│       ├── entity/
│       │   ├── User.java
│       │   ├── Category.java
│       │   ├── Book.java
│       │   ├── Inventory.java
│       │   ├── Cart.java
│       │   ├── CartItem.java
│       │   ├── Order.java
│       │   ├── OrderItem.java
│       │   └── LowStockAlert.java
│       ├── exception/
│       │   ├── GlobalExceptionHandler.java
│       │   ├── ResourceNotFoundException.java
│       │   ├── BadRequestException.java
│       │   └── InsufficientStockException.java
│       ├── repository/
│       │   ├── UserRepository.java
│       │   ├── CategoryRepository.java
│       │   ├── BookRepository.java
│       │   ├── InventoryRepository.java
│       │   ├── CartRepository.java
│       │   ├── CartItemRepository.java
│       │   ├── OrderRepository.java
│       │   └── LowStockAlertRepository.java
│       ├── security/
│       │   ├── AuthTokenFilter.java
│       │   ├── JwtUtils.java
│       │   ├── UserDetailsImpl.java
│       │   └── UserDetailsServiceImpl.java
│       ├── service/
│       │   ├── AuthService.java
│       │   ├── BookService.java
│       │   ├── CategoryService.java
│       │   ├── CartService.java
│       │   ├── OrderService.java
│       │   ├── InventoryService.java
│       │   └── impl/
│       │       ├── AuthServiceImpl.java
│       │       ├── BookServiceImpl.java
│       │       ├── CategoryServiceImpl.java
│       │       ├── CartServiceImpl.java
│       │       ├── OrderServiceImpl.java
│       │       └── InventoryServiceImpl.java
│       └── util/
│           ├── DataSeeder.java
│           └── InventoryScheduler.java
│
└── client/                          # React Frontend
    ├── .env
    ├── package.json
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── public/index.html
    └── src/
        ├── App.js
        ├── index.js
        ├── index.css
        ├── assets/
        ├── components/
        │   ├── common/
        │   │   ├── Navbar.jsx
        │   │   ├── ProtectedRoute.jsx
        │   │   └── UI.jsx
        │   ├── student/
        │   │   └── BookCard.jsx
        │   └── admin/
        ├── context/
        │   ├── AuthContext.js
        │   └── CartContext.js
        ├── hooks/
        │   └── useData.js
        ├── pages/
        │   ├── auth/
        │   │   ├── LoginPage.jsx
        │   │   └── RegisterPage.jsx
        │   ├── student/
        │   │   ├── BookCatalogPage.jsx
        │   │   ├── BookDetailPage.jsx
        │   │   ├── CartPage.jsx
        │   │   ├── CheckoutPage.jsx
        │   │   └── StudentOrdersPage.jsx
        │   └── admin/
        │       ├── AdminDashboard.jsx
        │       ├── AdminBooksPage.jsx
        │       ├── AdminCategoriesPage.jsx
        │       ├── AdminOrdersPage.jsx
        │       └── AdminInventoryPage.jsx
        ├── services/
        │   ├── api.js
        │   ├── authService.js
        │   ├── bookService.js
        │   └── otherServices.js
        └── utils/
            └── helpers.js
```

---

## 🚀 Setup Instructions

### Prerequisites
- Java 17+
- Maven 3.8+
- Node.js 18+ & npm
- MySQL 8.0+

---

### 1. Database Setup

MySQL will be auto-configured. Just make sure MySQL is running:

```bash
mysql -u root -p
# password: sece@123

# The database `bookstore_db` is created automatically on first startup.
```

---

### 2. Backend Setup

```bash
cd bookstore/server

# Run the Spring Boot application
mvn spring-boot:run
```

Backend starts on **http://localhost:8080**

On first startup, `DataSeeder` automatically creates:
- **Admin account:** `admin` / `admin123`
- **Student account:** `student1` / `student123`
- **6 categories** + **12 books** with inventory

---

### 3. Frontend Setup

```bash
cd bookstore/client

# Install dependencies
npm install

# Start development server
npm start
```

Frontend starts on **http://localhost:3000**

---

## 🔑 Demo Accounts

| Role    | Username   | Password     |
|---------|-----------|--------------|
| Admin   | `admin`   | `admin123`   |
| Student | `student1`| `student123` |

---

## 🌐 API Endpoints

### Auth
| Method | Endpoint             | Description         |
|--------|----------------------|---------------------|
| POST   | `/api/auth/register` | Register user       |
| POST   | `/api/auth/login`    | Login & get JWT     |

### Books (Public GET, Admin write)
| Method | Endpoint                  | Description          |
|--------|---------------------------|----------------------|
| GET    | `/api/books`              | List all books       |
| GET    | `/api/books/{id}`         | Book detail          |
| GET    | `/api/books/search?keyword=` | Search books      |
| GET    | `/api/books/category/{id}` | By category         |
| GET    | `/api/books/low-stock`    | Admin: low stock     |
| POST   | `/api/books`              | Admin: create        |
| PUT    | `/api/books/{id}`         | Admin: update        |
| DELETE | `/api/books/{id}`         | Admin: soft-delete   |
| PATCH  | `/api/books/{id}/stock`   | Admin: update stock  |

### Categories
| Method | Endpoint               | Description      |
|--------|------------------------|------------------|
| GET    | `/api/categories`      | List all         |
| POST   | `/api/categories`      | Admin: create    |
| PUT    | `/api/categories/{id}` | Admin: update    |
| DELETE | `/api/categories/{id}` | Admin: delete    |

### Cart (Student)
| Method | Endpoint                  | Description       |
|--------|---------------------------|-------------------|
| GET    | `/api/cart`               | Get cart          |
| POST   | `/api/cart/add`           | Add item          |
| PUT    | `/api/cart/items/{id}`    | Update quantity   |
| DELETE | `/api/cart/items/{id}`    | Remove item       |
| DELETE | `/api/cart/clear`         | Clear cart        |

### Orders
| Method | Endpoint                        | Description             |
|--------|---------------------------------|-------------------------|
| POST   | `/api/orders/place`             | Place order             |
| POST   | `/api/orders/{id}/payment`      | Process mock payment    |
| GET    | `/api/orders/my-orders`         | Student: my orders      |
| GET    | `/api/orders`                   | Admin: all orders       |
| PATCH  | `/api/orders/{id}/status`       | Admin: update status    |

### Inventory (Admin)
| Method | Endpoint                               | Description         |
|--------|----------------------------------------|---------------------|
| GET    | `/api/inventory/alerts`               | Active alerts        |
| GET    | `/api/inventory/alerts/all`           | All alerts           |
| PATCH  | `/api/inventory/alerts/{id}/acknowledge` | Acknowledge alert  |
| PATCH  | `/api/inventory/alerts/{id}/resolve`  | Resolve alert        |
| POST   | `/api/inventory/sync`                 | Trigger manual sync  |

---

## 💳 Mock Payment Testing

| Test Scenario       | How to trigger                              |
|---------------------|---------------------------------------------|
| Payment **success** | Any card number NOT ending in `0000`        |
| Payment **failure** | Use card ending in `0000` (e.g. `4111111111110000`) |
| Auto success 90%    | Random — 9 out of 10 payments succeed       |

---

## 🔔 Low-Stock Alert System

- Threshold is configurable per book (default: **5 copies**)
- Alerts are triggered **automatically** after each order that reduces stock below threshold
- A **scheduled job** (every hour) also scans all inventory and creates alerts
- Admins can **Acknowledge** or **Resolve** alerts from the Inventory page
- Trigger a manual sync from the Inventory page using **"Sync Now"**

---

## ⚙️ Environment Configuration

### Backend (`application.properties`)
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/bookstore_db?createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=sece@123
app.jwt.secret=BookstoreSmartInventorySecretKey2024VeryLongSecretKeyForSecurity
app.jwt.expiration=86400000
app.inventory.low-stock-threshold=5
```

### Frontend (`.env`)
```env
REACT_APP_API_BASE_URL=http://localhost:8080/api
REACT_APP_NAME=Online Bookstore
```

---

## 🛡️ Security

- **BCrypt** password hashing
- **JWT** stateless authentication (24-hour expiry)
- Role-based access control: `ROLE_ADMIN` / `ROLE_STUDENT`
- CORS configured for `http://localhost:3000`
- Method-level security with `@PreAuthorize`

---

## 🧪 Test Scenarios (ST Scope)

| Scenario                        | Steps                                                   |
|---------------------------------|---------------------------------------------------------|
| ✅ Add to cart                  | Login as student → Browse → Add book → Check cart       |
| ✅ Stock deducted after order   | Place order → Pay → Check book stock reduced            |
| ❌ Payment failure              | Use card `4111111111110000` → Payment fails             |
| ✅ Low stock alert triggered    | Reduce stock to ≤ 5 → Alert appears in Admin > Inventory |
| ✅ Out of stock blocked         | Book with 0 stock → "Unavailable" button shown          |
| ✅ Admin CRUD books             | Admin login → Books page → Add/Edit/Delete              |
| ✅ E-Bill generation            | My Orders → Click "E-Bill" on any successful order      |
| ✅ Role-based access            | Try `/admin/dashboard` as student → Redirected          |

---

## 📦 Tech Stack Summary

| Layer       | Technology                               |
|-------------|------------------------------------------|
| Backend     | Spring Boot 3.2, Spring Security, JPA   |
| Auth        | JWT (jjwt 0.11.5), BCrypt               |
| Database    | MySQL 8, Hibernate ORM                   |
| Frontend    | React 18, React Router 6                |
| State Mgmt  | React Context API                        |
| HTTP Client | Axios                                    |
| Styling     | TailwindCSS 3                            |
| Scheduling  | Spring `@Scheduled`                      |
| Build       | Maven (backend), Create React App (frontend) |
