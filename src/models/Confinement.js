const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const ConfinementSchema = new Schema({
    name: { type: String, required: true },
    qtyBovine: { type: Number, required: true, default: 0 },
    qtyEquine: { type: Number, required: true, default: 0 },
    initConfinement: { type: Date, required: true, default: Date.now },
    endConfinement: { type: Date, required: true, default: Date.now },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = Confinement = mongoose.model('Confinement', ConfinementSchema);