const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function initDatabase() {
  try {
    console.log('Connecting to database...');
    
    // Test connection
    await prisma.$connect();
    console.log('Database connected successfully!');
    
    // Create table if not exists (manual SQL)
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "Birthday" (
        "id" SERIAL PRIMARY KEY,
        "name" TEXT NOT NULL,
        "birthday" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL
      );
    `;
    
    console.log('Table created successfully!');
    
    // Insert initial data
    const initialData = [
      {"name":"Günay Hacıyeva","birthday":"07.09.1999"},
      {"name":"Aytan Nazarova","birthday":"13.02.1998"},
      {"name":"Günel Hüseynzade","birthday":"12.01.2001"},
      {"name":"Aysel Sərkərli","birthday":"12.12.1997"},
      {"name":"Narmin Asadova","birthday":"15.09.1993"},
      {"name":"Parvana","birthday":"20.06.1988"},
      {"name":"Aysel Qarayeva","birthday":""},
      {"name":"Rasim Ağazade","birthday":"12.11.1985"},
      {"name":"Baba Ağayev","birthday":"03.11.1989"},
      {"name":"Rasim Həmidi","birthday":"19.02.1994"},
      {"name":"Kənan Dadaşov","birthday":"01.06.1995"},
      {"name":"Nicat","birthday":""},
      {"name":"Elnur","birthday":"19.10.1994"},
      {"name":"Emin","birthday":""},
      {"name":"Aytac","birthday":"08.03.2000"},
      {"name":"Nərgiz","birthday":"05.05.1995"}
    ];
    
    for (const data of initialData) {
      await prisma.birthday.upsert({
        where: { name: data.name },
        update: {},
        create: data
      });
    }
    
    console.log('Initial data inserted successfully!');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

initDatabase();
