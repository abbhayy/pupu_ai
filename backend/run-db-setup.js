const { Sequelize } = require("sequelize");
require("dotenv").config();

async function setupDatabase() {
  // Detect dialect from DATABASE_URL
  const dbUrl = process.env.DATABASE_URL || "";
  const low = dbUrl.toLowerCase();
  let dialect = "postgres";
  if (low.includes("mysql://") || low.includes("mysql")) {
    dialect = "mysql";
  } else if (low.includes("sqlite:")) {
    dialect = "sqlite";
  } else if (low.includes("postgres://") || low.includes("postgresql")) {
    dialect = "postgres";
  }

  const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect,
    logging: false,
  });

  try {
    await sequelize.authenticate();
    console.log("✅ Connected to database");

    // Create tables
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS languages (
        id SERIAL PRIMARY KEY,
        name VARCHAR(50) UNIQUE NOT NULL,
        extension VARCHAR(10) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS generations (
        id SERIAL PRIMARY KEY,
        prompt TEXT NOT NULL,
        language_id INTEGER NOT NULL REFERENCES languages(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        code TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create indexes in a dialect-compatible way
    if (dialect === "postgres") {
      await sequelize.query(
        `CREATE INDEX IF NOT EXISTS idx_generations_created_at ON generations(created_at DESC);`
      );
      await sequelize.query(
        `CREATE INDEX IF NOT EXISTS idx_generations_language_id ON generations(language_id);`
      );
    } else if (dialect === "mysql") {
      // MySQL: no IF NOT EXISTS for CREATE INDEX and DESC not allowed in index definition
      // Check information_schema for existing index before creating.
      const [[createdAtIdx]] = await sequelize.query(
        `SELECT COUNT(1) as cnt FROM information_schema.statistics WHERE table_schema = DATABASE() AND table_name = 'generations' AND index_name = 'idx_generations_created_at'`
      );
      if (createdAtIdx.cnt === 0) {
        await sequelize.query(
          `CREATE INDEX idx_generations_created_at ON generations (created_at)`
        );
      }

      const [[langIdx]] = await sequelize.query(
        `SELECT COUNT(1) as cnt FROM information_schema.statistics WHERE table_schema = DATABASE() AND table_name = 'generations' AND index_name = 'idx_generations_language_id'`
      );
      if (langIdx.cnt === 0) {
        await sequelize.query(
          `CREATE INDEX idx_generations_language_id ON generations (language_id)`
        );
      }
    } else {
      // Fallback: attempt to create indexes and ignore errors
      try {
        await sequelize.query(
          `CREATE INDEX idx_generations_created_at ON generations (created_at)`
        );
      } catch (e) {}
      try {
        await sequelize.query(
          `CREATE INDEX idx_generations_language_id ON generations (language_id)`
        );
      } catch (e) {}
    }

    // Insert languages (dialect-specific)
    if (dialect === "postgres") {
      await sequelize.query(`
        INSERT INTO languages (name, extension) VALUES
        ('Python', '.py'),
        ('JavaScript', '.js'),
        ('TypeScript', '.ts'),
        ('C++', '.cpp'),
        ('Java', '.java'),
        ('Go', '.go'),
        ('Rust', '.rs'),
        ('C#', '.cs'),
        ('PHP', '.php'),
        ('Ruby', '.rb')
        ON CONFLICT (name) DO NOTHING;
      `);
    } else if (dialect === "mysql") {
      // MySQL: use INSERT IGNORE to skip duplicate unique keys
      await sequelize.query(`
        INSERT IGNORE INTO languages (name, extension) VALUES
        ('Python', '.py'),
        ('JavaScript', '.js'),
        ('TypeScript', '.ts'),
        ('C++', '.cpp'),
        ('Java', '.java'),
        ('Go', '.go'),
        ('Rust', '.rs'),
        ('C#', '.cs'),
        ('PHP', '.php'),
        ('Ruby', '.rb');
      `);
    } else {
      // Fallback: try postgres style first, then ignore errors
      try {
        await sequelize.query(`
          INSERT INTO languages (name, extension) VALUES
          ('Python', '.py'),
          ('JavaScript', '.js'),
          ('TypeScript', '.ts'),
          ('C++', '.cpp'),
          ('Java', '.java'),
          ('Go', '.go'),
          ('Rust', '.rs'),
          ('C#', '.cs'),
          ('PHP', '.php'),
          ('Ruby', '.rb')
          ON CONFLICT (name) DO NOTHING;
        `);
      } catch (e) {
        // ignore
      }
    }

    console.log("✅ Database setup complete!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

setupDatabase();
