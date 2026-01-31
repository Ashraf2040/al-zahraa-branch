
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  try {
    // Check if classes already exist
    const existingClasses = await prisma.class.findMany();
    if (existingClasses.length === 0) {
      await prisma.class.createMany({
        data: [
          { name: 'Class 1A' },
          { name: 'Class 1B' },
          { name: 'Class 2A' },
        ],
      });
      console.log('Classes seeded successfully');
    } else {
      console.log('Classes already exist, skipping seeding');
    }

    // Check if subjects already exist
    const existingSubjects = await prisma.subject.findMany();
    if (existingSubjects.length === 0) {
      await prisma.subject.createMany({
        data: [
          { name: 'Math' },
          { name: 'Science' },
          { name: 'English' },
        ],
      });
      console.log('Subjects seeded successfully');
    } else {
      console.log('Subjects already exist, skipping seeding');
    }

    // Check if admin user already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { username: 'admin' },
    });
    if (!existingAdmin) {
      const hashedPassword = bcrypt.hashSync('admin123', 10);
      await prisma.user.create({
        data: {
          username: 'admin',
          name: 'Admin User',
          password: hashedPassword,
          role: 'ADMIN',
        },
      });
      console.log('Admin user seeded successfully');
    } else {
      console.log('Admin user already exists, skipping seeding');
    }
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
