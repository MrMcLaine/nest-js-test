# 📚 Books CMS - NestJS GraphQL API

## 🚀 Introduction

Welcome to the **Books CMS** project! This service, built with **NestJS**, provides a GraphQL API for managing books,
user activity logs, and reviews. It integrates **PostgreSQL** for relational data, **DynamoDB** for NoSQL storage, and *
*Redis** for caching to enhance performance.

## 🛠 Features

- ✅ **CRUD Operations**: Manage book entries (Create, Read, Update, Delete).
- ✅ **Advanced Search**: Filter books by **title, author, and publication year**.
- ✅ **Sorting & Pagination**: Efficient navigation of large datasets.
- ✅ **Authentication & Authorization**: JWT-based authentication with **ACLs** (Access Control Lists).
- ✅ **User Activity Logs & Book Reviews**: Stored in **DynamoDB** for scalability.
- ✅ **Rate Limiting**: Prevents system abuse.
- ✅ **Caching**: Uses **Redis** for fast responses.
- ✅ **Scalability & Performance**: Optimized query design and database indexing.
- ✅ **Security**: Implements protection against **SQL Injection, XSS, CSRF, and other vulnerabilities**.
- ✅ **Testing**: Unit and integration tests ensure reliability.

---

## 🏗 Architecture Overview

### **Tech Stack**

- **Backend:** [NestJS](https://nestjs.com/)
- **API:** GraphQL with Apollo Server
- **Database:** PostgreSQL (Relational), DynamoDB (NoSQL)
- **Cache:** Redis
- **Authentication:** JWT & Passport
- **Validation:** Class-validator & Class-transformer
- **Security:** Helmet, Bcrypt, Rate Limiting
- **Testing:** Jest, Supertest

### **System Overview**

- **Books Management** → Stored in **PostgreSQL** (Relational DB)
- **User Activity Logs & Reviews** → Stored in **DynamoDB** (NoSQL DB)
- **Caching Layer** → **Redis**
- **GraphQL API** → Query, Mutations & Subscriptions
- **Authentication & Authorization** → Secure access control with JWT & ACL

---

## 🔧 Installation & Setup

### **1️⃣ Prerequisites**

Make sure you have the following installed:

- **Node.js** (>= 16.x)
- **Docker & Docker Compose** (for PostgreSQL, Redis, and DynamoDB Local)

### **2️⃣ Clone the Repository**

```sh
git clone https://github.com/your-repo/books-cms.git
cd books-cms
````

### **3️⃣ Install Dependencies**

```sh
npm install
```

### **4️⃣ Environment Variables**

- **Rename the `.env.example` file to `.env`**
- **For local development you don't need to update the environment variables in the `.env` file**

### **5️⃣ Run the Application using Docker**

```sh
docker-compose build
```
```sh
docker-compose up -d
```

This will run:
* PostgreSQL on localhost:5432
* DynamoDB Local on localhost:8000
* Redis on localhost:6379
* NestJS App on localhost:5000

#### 🖥️ The server will run at http://localhost:5000/graphql by default.

---

#### 🚀 For production mode (NODE_ENV=production):
#### ❌ Apollo Sandbox will be disabled, and the GraphQL Playground will not be accessible.

---

### ✅ Testing

### **6️⃣ Run Tests**

```sh
npm run test
```

### **7️⃣ Test Coverage**

```sh
npm run test:coverage
```

### **8️⃣ 📖 Documentation**

- **API Documentation: Auto-generated in GraphQL Playground**

### **9️⃣ 📌 Deployment**

1. Build the project

```sh
npm run build
```

2. Run in Production Mode

```sh
docker-compose -f docker-compose.prod.yml up -d
```

### 🛡 Security Measures

- ✅ JWT Authentication (Secure API access)
- ✅ Helmet (Prevents common security threats)
- ✅ Rate Limiting (Prevents brute force attacks)
- ✅ SQL Injection & XSS Protection
- ✅ Environment Variables (Secrets stored securely)

### 📡 API Endpoints

1. Run the magidoc CLI preview

```sh
npx @magidoc/cli@latest preview
```

2. Click from your terminal to link for redirect to the webSite with the documentation
By default -> Server listening on http://localhost:4000

3. For update docs run the app and also run that script 
```sh
npx @magidoc/cli@latest generate
```
