const { Language, User } = require('../models');

/**
 * Seed initial data
 */
async function seed() {
  try {
    console.log('🌱 Seeding database...');

    // Seed languages
    const languages = [
      { name: 'Python', extension: '.py' },
      { name: 'JavaScript', extension: '.js' },
      { name: 'TypeScript', extension: '.ts' },
      { name: 'C++', extension: '.cpp' },
      { name: 'Java', extension: '.java' },
      { name: 'Go', extension: '.go' },
      { name: 'Rust', extension: '.rs' },
      { name: 'C#', extension: '.cs' },
      { name: 'PHP', extension: '.php' },
      { name: 'Ruby', extension: '.rb' }
    ];

    for (const lang of languages) {
      await Language.findOrCreate({
        where: { name: lang.name },
        defaults: lang
      });
    }

    console.log('✅ Languages seeded');


    if (created) {
      console.log('✅ Demo user created');
    } else {
      console.log('ℹ️  Demo user already exists');
    }

    console.log('✅ Database seeding completed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seed();
