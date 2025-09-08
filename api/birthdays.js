import { PrismaClient } from '@prisma/client';

// Initialize Prisma client with error handling
let prisma;
try {
  prisma = new PrismaClient();
} catch (error) {
  console.error('Prisma initialization error:', error);
}

// Fallback in-memory storage
let birthdays = [
  {"id":1,"name":"Günay Hacıyeva","birthday":"07.09.1999"},
  {"id":2,"name":"Aytan Nazarova","birthday":"13.02.1998"},
  {"id":3,"name":"Günel Hüseynzade","birthday":"12.01.2001"},
  {"id":4,"name":"Aysel Sərkərli","birthday":"12.12.1997"},
  {"id":5,"name":"Narmin Asadova","birthday":"15.09.1993"},
  {"id":6,"name":"Parvana","birthday":"20.06.1988"},
  {"id":7,"name":"Aysel Qarayeva","birthday":""},
  {"id":8,"name":"Rasim Ağazade","birthday":"12.11.1985"},
  {"id":9,"name":"Baba Ağayev","birthday":"03.11.1989"},
  {"id":10,"name":"Rasim Həmidi","birthday":"19.02.1994"},
  {"id":11,"name":"Kənan Dadaşov","birthday":"01.06.1995"},
  {"id":12,"name":"Nicat","birthday":""},
  {"id":13,"name":"Elnur","birthday":"19.10.1994"},
  {"id":14,"name":"Emin","birthday":""},
  {"id":15,"name":"Aytac","birthday":"08.03.2000"},
  {"id":1757329798171,"name":"Nərgiz","birthday":"05.05.1995"}
];

export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Debug logging
  console.log('Request method:', req.method);
  console.log('Request URL:', req.url);
  console.log('Request body:', req.body);

  try {
    if (req.method === 'GET') {
      // Try database first, fallback to in-memory
      if (prisma) {
        try {
          const dbBirthdays = await prisma.birthday.findMany({
            orderBy: { id: 'asc' }
          });
          res.status(200).json(dbBirthdays);
          return;
        } catch (dbError) {
          console.log('Database error, using fallback:', dbError.message);
        }
      }
      
      // Fallback to in-memory storage
      res.status(200).json(birthdays);
    } 
    else if (req.method === 'POST') {
      const { name, birthday } = req.body;
      if (!name) {
        return res.status(400).json({ error: 'Name is required' });
      }
      
      // Try database first, fallback to in-memory
      if (prisma) {
        try {
          const newBirthday = await prisma.birthday.create({
            data: { name, birthday: birthday || '' }
          });
          res.status(201).json(newBirthday);
          return;
        } catch (dbError) {
          console.log('Database error, using fallback:', dbError.message);
        }
      }
      
      // Fallback to in-memory storage
      const newBirthday = {
        id: Date.now(),
        name,
        birthday: birthday || ''
      };
      birthdays.push(newBirthday);
      res.status(201).json(newBirthday);
    } 
    else if (req.method === 'PUT') {
      const urlParts = req.url.split('/');
      const id = parseInt(urlParts[urlParts.length - 1]);
      const { name, birthday } = req.body;
      
      if (!id || isNaN(id)) {
        return res.status(400).json({ error: 'Valid ID is required' });
      }
      
      // Try database first, fallback to in-memory
      if (prisma) {
        try {
          const updatedBirthday = await prisma.birthday.update({
            where: { id },
            data: { name, birthday: birthday || '' }
          });
          res.status(200).json(updatedBirthday);
          return;
        } catch (dbError) {
          console.log('Database error, using fallback:', dbError.message);
        }
      }
      
      // Fallback to in-memory storage
      const index = birthdays.findIndex(b => b.id === id);
      if (index === -1) {
        return res.status(404).json({ error: 'Birthday not found' });
      }
      
      birthdays[index] = { ...birthdays[index], name, birthday: birthday || '' };
      res.status(200).json(birthdays[index]);
    } 
    else if (req.method === 'DELETE') {
      const urlParts = req.url.split('/');
      const id = parseInt(urlParts[urlParts.length - 1]);
      
      if (!id || isNaN(id)) {
        return res.status(400).json({ error: 'Valid ID is required' });
      }
      
      // Try database first, fallback to in-memory
      if (prisma) {
        try {
          await prisma.birthday.delete({
            where: { id }
          });
          res.status(200).json({ message: 'Birthday deleted' });
          return;
        } catch (dbError) {
          console.log('Database error, using fallback:', dbError.message);
        }
      }
      
      // Fallback to in-memory storage
      const index = birthdays.findIndex(b => b.id === id);
      if (index === -1) {
        return res.status(404).json({ error: 'Birthday not found' });
      }
      
      birthdays.splice(index, 1);
      res.status(200).json({ message: 'Birthday deleted' });
    } 
    else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal server error: ' + error.message });
  } finally {
    if (prisma) {
      try {
        await prisma.$disconnect();
      } catch (disconnectError) {
        console.log('Disconnect error:', disconnectError.message);
      }
    }
  }
}