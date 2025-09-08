const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const multer = require('multer');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static('.'));

// Multer for file uploads
const upload = multer({ dest: 'uploads/' });

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

app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const fileContent = await fs.readFile(filePath, 'utf8');
    const data = JSON.parse(fileContent);

    // Save to data.json
    await fs.writeFile('data.json', JSON.stringify(data, null, 2));

    // Clean up uploaded file
    await fs.unlink(filePath);

    res.json({ status: 'success', message: 'File uploaded and data saved' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
