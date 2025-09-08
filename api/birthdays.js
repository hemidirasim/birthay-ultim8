const fs = require('fs');
const path = require('path');

// In-memory storage for Vercel (since file system is read-only)
let birthdays = [
  { id: 1, name: "Midiya", birthday: "15.03.1995" },
  { id: 2, name: "Azer", birthday: "20.07.1990" },
  { id: 3, name: "Test", birthday: "01.01.2000" }
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

  try {
    if (req.method === 'GET') {
      // Return all birthdays
      res.status(200).json(birthdays);
    } 
    else if (req.method === 'POST') {
      // Add new birthday
      const { name, birthday } = req.body;
      if (!name || !birthday) {
        return res.status(400).json({ error: 'Name and birthday are required' });
      }
      
      const newBirthday = {
        id: Date.now(),
        name,
        birthday
      };
      
      birthdays.push(newBirthday);
      res.status(201).json(newBirthday);
    } 
    else if (req.method === 'PUT') {
      // Update birthday
      const { id } = req.query;
      const { name, birthday } = req.body;
      
      const index = birthdays.findIndex(b => b.id == id);
      if (index === -1) {
        return res.status(404).json({ error: 'Birthday not found' });
      }
      
      birthdays[index] = { ...birthdays[index], name, birthday };
      res.status(200).json(birthdays[index]);
    } 
    else if (req.method === 'DELETE') {
      // Delete birthday
      const { id } = req.query;
      
      const index = birthdays.findIndex(b => b.id == id);
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
    res.status(500).json({ error: 'Internal server error' });
  }
}