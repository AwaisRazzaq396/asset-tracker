const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();


app.use(cors());
app.use(express.json());


const Earning = require('./models/Earning');

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected..."))
  .catch(err => console.log(err));


app.use('/api/auth', require('./routes/auth'));

app.get('/get-earnings', async (req, res) => {
    const earnings = await Earning.find().sort({ date: -1 });
    res.json(earnings);
});

app.post('/add-earning', async (req, res) => {
    const newEarning = new Earning(req.body);
    await newEarning.save();
    res.json(newEarning);
});

app.delete('/delete-earning/:id', async (req, res) => {
    try {
        await Earning.findByIdAndDelete(req.params.id);
        res.json({ message: "Deleted Successfully" });
    } catch (err) {
        res.status(500).json({ error: "Delete failed" });
    }
});

// Login Route (Password check karne ke liye)
app.post('/login', (req, res) => {
    const { password } = req.body;
    // Yahan check karen ke password wahi hai jo aap frontend par dal rahe hain
    if (password === "dreamcar2026") { 
        res.json({ success: true });
    } else {
        res.status(401).json({ success: false, message: "Wrong Password!" });
    }
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));