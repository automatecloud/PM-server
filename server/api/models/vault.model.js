const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let vaultSchema = new Schema({
    key: { type: String, required: true, unique:true },
    description: String,
    value : { type: String, required: true },
});

vaultSchema.set('toJSON', {
    transform: function (doc, ret, options) {
        ret.id = ret._id;
    }
});

let Vault = mongoose.model('Vault', vaultSchema, 'vaults');


module.exports = Vault;