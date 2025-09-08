const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(".")); // index.html-i göstərmək üçün

// Doğum günlərini oxumaq
app.get("/birthdays", (req, res) => {
  const data = JSON.parse(fs.readFileSync("birthdays.json", "utf8"));
  res.json(data);
});

// Yeni əlavə etmək
app.post("/birthdays", (req, res) => {
  const data = JSON.parse(fs.readFileSync("birthdays.json", "utf8"));
  const newEntry = { id: Date.now(), ...req.body };
  data.push(newEntry);
  fs.writeFileSync("birthdays.json", JSON.stringify(data, null, 2));
  res.json(newEntry);
});

// Redaktə etmək
app.put("/birthdays/:id", (req, res) => {
  try {
    let data = JSON.parse(fs.readFileSync("birthdays.json", "utf8"));
    data = data.map(b => b.id == req.params.id ? { ...b, ...req.body } : b);
    fs.writeFileSync("birthdays.json", JSON.stringify(data, null, 2));
    res.json({ success: true });
  } catch (error) {
    console.error('Edit error:', error);
    res.status(500).json({ error: 'Edit failed' });
  }
});

// Silmək
app.delete("/birthdays/:id", (req, res) => {
  try {
    let data = JSON.parse(fs.readFileSync("birthdays.json", "utf8"));
    data = data.filter(b => b.id != req.params.id);
    fs.writeFileSync("birthdays.json", JSON.stringify(data, null, 2));
    res.json({ success: true });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: 'Delete failed' });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server http://localhost:${PORT} ünvanında işlədi`);
  console.log(`Network access: http://[YOUR_IP]:${PORT}`);
});
