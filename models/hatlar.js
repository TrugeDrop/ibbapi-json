const mongoose = require("mongoose");
const schema = new mongoose.Schema({
    hatKodu: {
        type: Object,
        required: true,
        unique: true
    },
    hat_bilgisi: Object
}, { timestamps: true });

module.exports = mongoose.model("Hatlar", schema);