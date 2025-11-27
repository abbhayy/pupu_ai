# Project Setup Instructions

Quick setup guide for running the Code Generation Copilot locally.

## Prerequisites

Ensure you have the following installed:
- **Node.js** 18+ ([Download](https://nodejs.org/))
- **PostgreSQL** 14+ ([Download](https://www.postgresql.org/download/))
  - Alternative: Use SQLite for development
- **Git** ([Download](https://git-scm.com/))
- **OpenAI API Key** ([Get one here](https://platform.openai.com/api-keys))

## Quick Start (5 minutes)

### 1. Clone or Download the Project

```bash
cd c:\Users\91766\Downloads\AutomationEdge_Assignment
```

### 2. Setup Backend

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create .env file
copy .env.example .env

# Edit .env file with your credentials
# - Add your OpenAI API key
# - Configure database URL

# Run migrations
npm run migrate

# Seed initial data
npm run seed

# Start server
npm run dev
```

Backend will run at: **http://localhost:5000**

### 3. Setup Frontend (New Terminal)

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Create .env file
copy .env.example .env

# Edit .env to point to backend (default: http://localhost:5000)

# Start development server
npm run dev
```

Frontend will run at: **http://localhost:5173**

### 4. Test the Application

1. Open browser: http://localhost:5173
2. Enter a prompt: "Write a Python function to sort a list"
3. Select language: Python
4. Click "Generate Code"
5. View generated code
6. Check History tab

## Database Setup Options

### Option A: PostgreSQL (Recommended)

```bash
# Create database
createdb code_copilot

# Update .env
DATABASE_URL=postgresql://username:password@localhost:5432/code_copilot
```

### Option B: SQLite (Development Only)

```bash
# Update .env
DATABASE_URL=sqlite:./database.sqlite
```

## Environment Variables

### Backend (.env)

```env
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://username:password@localhost:5432/code_copilot
GEMINI_API_KEY=sk-proj-your-key-here
CORS_ORIGIN=http://localhost:5173
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:5000
```

## Troubleshooting

### "Cannot connect to database"
- Ensure PostgreSQL is running
- Check DATABASE_URL credentials
- Try: `psql -U username -d code_copilot` to test connection

### "OpenAI API Error"
- Verify API key is correct
- Check you have credits: https://platform.openai.com/usage
- Ensure no typos in .env file

### "CORS Error"
- Ensure backend is running
- Check CORS_ORIGIN in backend .env matches frontend URL
- Restart backend after changing .env

### "Port already in use"
- Backend: Change PORT in backend/.env
- Frontend: Change port in vite.config.js

## Scripts

### Backend
```bash
npm run dev      # Start development server
npm start        # Start production server
npm run migrate  # Run database migrations
npm run seed     # Seed initial data
```

### Frontend
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

## Next Steps

1. ✅ Setup complete - Start coding!
2. 📖 Read [README.md](./README.md) for full documentation
3. 🚀 Deploy using [DEPLOYMENT.md](./DEPLOYMENT.md)
4. 🎥 Record demo using [VIDEO_SCRIPT.md](./VIDEO_SCRIPT.md)

## Need Help?

- Check [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for API details
- Review [ER_DIAGRAM.md](./ER_DIAGRAM.md) for database schema
- Open an issue on GitHub

---

**Happy Coding! 🚀**
