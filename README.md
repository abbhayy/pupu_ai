# Code Generation Copilot

A fully modern, AI-powered, full-stack application designed to turn natural language prompts into production-ready code. Built with React, Node.js, and MySQL/PostgreSQL, this system supports 10+ languages, provides clean syntax-highlighted output, and maintains a complete history of generated snippets.

## 🚀 Live Demo

⚠️ **Note:** Backend may experience cold starts if deployed on free tier services. Please allow 30-60 seconds for initial load.


## 📚 API Documentation

**Interactive API Documentation:** [![API Documentation](./docs/screenshots/api-docs.png)](http://localhost:5000/api-docs)

Complete API documentation with interactive examples is available at `/api-docs` after starting the server.

🔗 **Make sure your server is running locally at** `http://localhost:5000`

## 🛠️ Tech Stack

### Frontend
- **React 18** with **Vite**
- **TailwindCSS**
- **Prism.js** (Syntax Highlighting)
- **Axios**
- **React Icons**

### Backend
- **Node.js** with **Express.js**
- **Sequelize ORM**
- **MySQL** / **PostgreSQL**
- **OpenAI API** (GPT-3.5-turbo)
- **Express Validator**
- **Swagger UI** (API Documentation)
- **CORS**

## 📁 Project Structure

```
Code-Copilot/
├── backend/
│   ├── src/
│   │   ├── config/           
│   │   ├── controllers/      
│   │   ├── middleware/       
│   │   ├── migrations/       
│   │   ├── models/           
│   │   ├── routes/           
│   │   └── services/         
│   ├── server.js             
│   ├── package.json          
│   └── .env                  
├── frontend/
│   ├── src/
│   │   ├── components/       
│   │   │   ├── CodeDisplay.jsx
│   │   │   ├── CodeGenerator.jsx
│   │   │   ├── HistoryList.jsx
│   │   │   └── Pagination.jsx
│   │   ├── services/         
│   │   ├── App.jsx           
│   │   └── main.jsx          
│   ├── package.json          
│   └── vite.config.js        
├── README.md                 
├── API_DOCUMENTATION.md      
├── DEPLOYMENT.md             
└── SETUP.md                  
```

## 🗄️ Database Schema

The application uses MySQL with Sequelize ORM. The database consists of the following main entities:

**Database Schema Diagram:** Complete database schema showing relationships between entities

![Database Schema Diagram](./docs/screenshots/db-schema-diagram.png)
### Core Entities

#### **users** - User authentication and profiles
- `id` (Primary Key, Auto-increment)
- `username` (Unique, Not Null)
- `email` (Unique, Not Null)
- `created_at` (Timestamp)

#### **languages** - Programming language reference
- `id` (Primary Key, Auto-increment)
- `name` (Unique, e.g., "Python", "JavaScript")
- `extension` (e.g., ".py", ".js")
- `created_at` (Timestamp)

#### **generations** - Code generation records
- `id` (Primary Key, Auto-increment)
- `prompt` (Text, Not Null)
- `language_id` (Foreign Key → languages.id)
- `user_id` (Foreign Key → users.id, Nullable)
- `code` (Text, Not Null)
- `created_at` (Timestamp, Indexed)

### Key Relationships

- **Users** can have multiple **Generations**
- **Languages** are used in multiple **Generations**
- **Generations** belong to one **Language** and optionally one **User**

### Database Design Decisions

**Normalization (3NF):**
- Languages stored separately to avoid redundancy
- Each generation references language via foreign key
- Reduces storage and ensures data consistency

**Foreign Keys:**
- `language_id` → CASCADE delete (removes generations if language deleted)
- `user_id` → SET NULL delete (preserves generations if user deleted)

**Indexes:**
- `created_at` DESC for fast pagination
- `language_id` for efficient JOINs
- Primary keys for O(1) lookups

## ⚡ Complexity Analysis

### Paginated Retrieval Time Complexity

**Query:** `SELECT * FROM generations ORDER BY created_at DESC LIMIT 10 OFFSET 20`

- **Without Index:** O(n log n) where n = total rows (due to sorting)
- **With Index on `created_at`:** O(log n + k) where k = page size
  - Index lookup: O(log n)
  - Fetching k rows: O(k)
  - OFFSET performance degrades with large offsets: O(offset + k)

**Optimization Strategy:**
- Created index on `created_at` column
- For very large datasets (>1M rows), cursor-based pagination would be better (using `WHERE created_at < last_timestamp`)

### Schema Impact on Performance

**Positive Impacts:**
- **Join Performance:** Normalized schema with proper indexes allows efficient JOINs
- **Storage Efficiency:** Languages table reduces redundant string storage by ~90%
- **Cache Friendly:** Small languages table fits in memory
- **Flexibility:** Easy to add language metadata without touching generations table

**Potential Bottlenecks:**
- Each query requires a JOIN with languages table (mitigated by DB query optimizer)
- Deep pagination with OFFSET becomes slower (use cursor-based for >10K rows)

### Indexes Created

1. **`generations.created_at` (DESC):** 
   - Speeds up ORDER BY in history queries
   - Critical for pagination performance
   
2. **`generations.language_id`:**
   - Optimizes JOINs with languages table
   - Enables fast filtering by language
   
3. **`languages.name` (UNIQUE):**
   - Enforces uniqueness constraint
   - Speeds up language lookup by name

4. **Primary Keys (Clustered Indexes):**
   - Auto-indexed on all `id` columns
   - Enables O(1) lookups

**When are indexes useful?**
- Columns used in WHERE clauses
- Columns used in ORDER BY
- Foreign key columns used in JOINs
- Columns used frequently in queries

**Trade-offs:**
- Indexes speed up reads but slow down writes
- Each index uses additional storage
- Too many indexes can confuse query optimizer

## 🚀 Local Development Setup

### Prerequisites

Make sure you have the following installed on your system:

- **Node.js** (version 18 or higher)
- **npm** or **yarn** package manager
- **MySQL** 8.0+ or **PostgreSQL** 14+

### Step 1: Clone the Repository

```bash
git clone https://github.com/your-user-name/Code-Copilot.git
cd Code-Copilot
```

### Step 2: Backend Setup

**Navigate to backend directory:**

```bash
cd backend
```

**Install dependencies:**

```bash
npm install
```

**Create environment file:**

```bash
cp .env.example .env
```

**Configure environment variables in `.env`:**

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database (MySQL)
DATABASE_URL=mysql://root:password@localhost:3306/code_copilot

# Database (PostgreSQL alternative)
# DATABASE_URL=postgresql://username:password@localhost:5432/code_copilot

# GEMINI API
GEMINI_API_KEY=your_gemini_api_key_here

# CORS
CORS_ORIGIN=http://localhost:5173
```

**Create database:**

```sql
-- For MySQL
CREATE DATABASE code_copilot;

-- For PostgreSQL
CREATE DATABASE code_copilot;
```

**Run database migrations:**

```bash
npm run migrate
```

**Generate Prisma client (if using Prisma):**

```bash
npx prisma generate
```

**Start the backend server:**

```bash
npm run dev
```

The backend API will be available at `http://localhost:5000`

### Step 3: Frontend Setup

**Open a new terminal and navigate to frontend directory:**

```bash
cd frontend
```

**Install dependencies:**

```bash
npm install
```

**Create environment file:**

```bash
cp .env.example .env
```

**Configure environment variables in `.env`:**

```env
VITE_API_URL=http://localhost:5000
```

**Start the development server:**

```bash
npm run dev
```

The frontend application will be available at `http://localhost:5173`

### Step 4: Verify Installation

1. Open your browser and go to `http://localhost:5173`
2. Check backend health: `http://localhost:5000/api/health`
3. View API documentation: `http://localhost:5000/api-docs`


## ✨ Key Features

### User Features

- **Natural Language to Code** - Convert plain English descriptions into working code
- **Multi-Language Support** - Python, JavaScript, TypeScript, C++, Java, Go, Rust, C#, PHP, Ruby
- **Interactive Code Display** - Beautiful syntax highlighting with Prism.js
- **One-Click Copy** - Instantly copy generated code to clipboard
- **Generation History** - View and manage all past generations with pagination
- **Responsive Design** - Optimized for desktop, tablet, and mobile devices
- **Real-time Feedback** - Loading states and error handling for better UX

### Technical Features

- **RESTful API** - Well-documented API endpoints with Swagger UI
- **JWT Authentication** - Secure user authentication (optional)
- **Database Normalization** - 3NF compliant schema design
- **Input Validation** - Comprehensive validation with Express Validator
- **Error Handling** - Global error handling middleware
- **Pagination** - Efficient paginated queries with metadata
- **AI Integration** - OpenAI GPT-3.5-turbo for intelligent code generation

### Supported Languages

Python • JavaScript • TypeScript • C++ • Java • Go • Rust • C# • PHP • Ruby



## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

**Built by Arvind Kumar**

- GitHub: [@akcthecpder200](https://github.com/akcthecoder200)
- Repository: [Code-Copilot](https://github.com/akcthecoder200/Code-Copilot)

---

**Last updated:** November 2025

**Need Help?** Open an issue on GitHub or contact the repository owner.
