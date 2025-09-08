const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static('.'));

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/data.json', async (req, res) => {
  try {
    const data = await fs.readFile('data.json', 'utf8');
    res.json(JSON.parse(data));
  } catch (error) {
    res.status(404).json({ error: 'Data file not found' });
  }
});

app.post('/save', async (req, res) => {
  try {
    const data = req.body;
    await fs.writeFile('data.json', JSON.stringify(data, null, 2));
    res.json({ status: 'success', message: 'Data saved successfully' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
