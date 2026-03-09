const mongoose = require('mongoose');

const EarningSchema = new mongoose.Schema({
    source: { type: String, required: true }, // Kahan se paise aaye (e.g. Fiverr, Local Client)
    amount: { type: Number, required: true }, // Kitne paise aaye
    description: { type: String },            // Kaam kya tha?
    date: { type: Date, default: Date.now }    // Kab aaye
});

module.exports = mongoose.model('Earning', EarningSchema);