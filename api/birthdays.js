import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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
      // Return all birthdays from database
      const birthdays = await prisma.birthday.findMany({
        orderBy: { id: 'asc' }
      });
      res.status(200).json(birthdays);
    } 
    else if (req.method === 'POST') {
      // Add new birthday to database
      const { name, birthday } = req.body;
      if (!name) {
        return res.status(400).json({ error: 'Name is required' });
      }
      
      const newBirthday = await prisma.birthday.create({
        data: { name, birthday: birthday || '' }
      });
      
      res.status(201).json(newBirthday);
    } 
    else if (req.method === 'PUT') {
      // Update birthday in database
      const urlParts = req.url.split('/');
      const id = parseInt(urlParts[urlParts.length - 1]);
      const { name, birthday } = req.body;
      
      if (!id || isNaN(id)) {
        return res.status(400).json({ error: 'Valid ID is required' });
      }
      
      const updatedBirthday = await prisma.birthday.update({
        where: { id },
        data: { name, birthday: birthday || '' }
      });
      
      res.status(200).json(updatedBirthday);
    } 
    else if (req.method === 'DELETE') {
      // Delete birthday from database
      const urlParts = req.url.split('/');
      const id = parseInt(urlParts[urlParts.length - 1]);
      
      if (!id || isNaN(id)) {
        return res.status(400).json({ error: 'Valid ID is required' });
      }
      
      await prisma.birthday.delete({
        where: { id }
      });
      
      res.status(200).json({ message: 'Birthday deleted' });
    } 
    else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal server error: ' + error.message });
  } finally {
    await prisma.$disconnect();
  }
}