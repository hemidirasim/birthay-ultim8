const fs = require('fs');
const path = require('path');

// In-memory storage for Vercel (since file system is read-only)
let birthdaysData = [
  { "id": 1, "name": "Günay Hacıyeva", "birthday": "07.09.1999" },
  { "id": 2, "name": "Aytan Nazarova", "birthday": "13.02.1998" },
  { "id": 3, "name": "Günel Hüseynzade", "birthday": "12.01.2001" },
  { "id": 4, "name": "Aysel Şərkerli", "birthday": "12.12.1997" },
  { "id": 5, "name": "Narmin Asadova", "birthday": "15.09.1993" },
  { "id": 6, "name": "Parvana", "birthday": "20.06.1988" },
  { "id": 7, "name": "Aysel Qarayeva", "birthday": "" },
  { "id": 8, "name": "Rasim Ağazade", "birthday": "12.11.1985" },
  { "id": 9, "name": "Baba Ağayev", "birthday": "03.11.1989" },
  { "id": 10, "name": "Rasim Həmidi", "birthday": "19.02.1994" },
  { "id": 11, "name": "Kenan Dadaşov", "birthday": "" },
  { "id": 12, "name": "Nicat", "birthday": "" },
  { "id": 13, "name": "Elnur", "birthday": "" },
  { "id": 14, "name": "Emin", "birthday": "" },
  { "id": 15, "name": "Aytac", "birthday": "" }
];

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    switch (req.method) {
      case 'GET':
        // GET /birthdays - Get all birthdays
        res.status(200).json(birthdaysData);
        break;

      case 'POST':
        // POST /birthdays - Add new birthday
        const newEntry = { 
          id: Date.now(), 
          ...req.body 
        };
        birthdaysData.push(newEntry);
        res.status(201).json(newEntry);
        break;

      case 'PUT':
        // PUT /birthdays/:id - Update birthday
        const id = req.query.id || req.url.split('/').pop();
        birthdaysData = birthdaysData.map(b => 
          b.id == id ? { ...b, ...req.body } : b
        );
        res.status(200).json({ success: true });
        break;

      case 'DELETE':
        // DELETE /birthdays/:id - Delete birthday
        const deleteId = req.query.id || req.url.split('/').pop();
        birthdaysData = birthdaysData.filter(b => b.id != deleteId);
        res.status(200).json({ success: true });
        break;

      default:
        res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
