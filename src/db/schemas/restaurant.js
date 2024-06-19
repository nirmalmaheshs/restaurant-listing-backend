const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    isVeg: {
        type: Boolean,
        default: false,
    },
    image: {
        type: String,
        required: false
    },
    description: String
});

const restaurantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    cuisine: {
        type: String,
        required: true,
    },
    image: {
      type: String,
      required: true
    },
    menu: {
        type: [menuItemSchema],
        required: false
    }
}, {
    timestamps: true
});

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

module.exports = Restaurant;
