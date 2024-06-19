const express = require('express');
const auth = require("../middleware/auth");
const generateImageUrl = require("../helpers/randomImage");
const Restaurant = require("../db/schemas/restaurant");
const router = express.Router();

router.post('/', auth, async (req, res) => {
    const randomFoodUrl = await generateImageUrl('food');
    const {name, location, cuisine} = req.body;
    let menu = req.body.menu ? req.body.menu : [];
    const updatedMenuItems = [];
    for (const item of menu) {
        const url = await generateImageUrl( item.name, 'FOOD');
        updatedMenuItems.push({...item, image: url});
    }
    const restaurant = new Restaurant({name, location, cuisine, image: randomFoodUrl, menu: updatedMenuItems});
    const response = await restaurant.save();
    res.json(response);
});

router.get('/:id', auth,async (req, res) => {
    const docs = await Restaurant.findOne({_id: req.params.id});
    res.status(200).json(docs);
});

router.delete('/:id', auth, async (req, res) => {
    const docs = await Restaurant.deleteOne({_id: req.params.id});
    res.status(200).json(docs);
});

router.get('/', auth, async (req, res) => {
    const { name, location, cuisine, minRating, sortBy, order, isVeg, page = 1, limit = 10 } = req.query;

    // Convert page and limit to numbers
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);

    const skip = (pageNumber - 1) * limitNumber;


    // Create a filter object for the search
    const filter = {};

    if (name) {
        filter.name = { $regex: name, $options: 'i' }; // Case-insensitive search
    }
    if (location) {
        filter.location = { $regex: location, $options: 'i' }; // Case-insensitive search
    }
    if (cuisine) {
        filter.cuisine = { $regex: cuisine, $options: 'i' }; // Case-insensitive search
    }
    if (minRating) {
        filter.rating = { $gte: parseFloat(minRating) }; // Minimum rating filter
    }
    if (isVeg) {
        if (isVeg === 'true') {
            filter.isVeg = true; // Filter for vegetarian items
        } else if (isVeg === 'false') {
            filter.isVeg = false; // Filter for non-vegetarian items
        }
    }

    const sort = {};
    if (sortBy) {
        sort[sortBy] = order === 'desc' ? -1 : 1; // Descending or ascending order
    }

    // Find restaurants based on the filter
    const restaurants = await Restaurant.find(filter).skip(skip).limit(limit);

    res.send(restaurants);
})

router.put('/:id', auth, async (req, res) => {
    const updatedDocs = await Restaurant.findByIdAndUpdate(req.params.id, req.body, {new: true});
    if (!updatedDocs) {
        return res.status(404).send('User not found');
    }
    res.status(200).json(updatedDocs);
});

router.put('/:restaurantId/menu/:menuItemId', auth, async (req, res) => {
    const { restaurantId, menuItemId } = req.params;
    const { name, price, isVeg, image, description } = req.body;
    // Find the restaurant by ID
    const restaurant = await Restaurant.findById(restaurantId);

    if (!restaurant) {
        return res.status(404).send('Restaurant not found');
    }

    // Find the menu item by ID
    const menuItem = restaurant.menu.id(menuItemId);

    if (!menuItem) {
        return res.status(404).send('Menu item not found');
    }

    // Update the menu item fields
    if (name !== undefined) menuItem.name = name;
    if (price !== undefined) menuItem.price = price;
    if (isVeg !== undefined) menuItem.isVeg = isVeg;
    if (image !== undefined) menuItem.image = image;
    if (description !== undefined) menuItem.description = description;

    // Save the restaurant document with the updated menu item
    await restaurant.save();

    res.send(restaurant);
});

router.delete('/:restaurantId/menu/:menuItemId', auth, async (req, res) => {
    const { restaurantId, menuItemId } = req.params;
    // Find the restaurant by ID
    const restaurant = await Restaurant.findById(restaurantId);

    if (!restaurant) {
        return res.status(404).send('Restaurant not found');
    }

    const menuItemIndex = restaurant.menu.findIndex(item => item._id.toString() === menuItemId);

    if (menuItemIndex === -1) {
        return res.status(404).send('Menu item not found');
    }
    // Remove the menu item from the array
    restaurant.menu.splice(menuItemIndex, 1);
    // Save the restaurant document with the updated menu item
    await restaurant.save();

    res.send(restaurant);
});

router.post('/:restaurantId/menu', auth, async (req, res) => {
    const { restaurantId, menuItemId } = req.params;
    const { name, price, isVeg, image, description } = req.body;

    // Find the restaurant by ID
    const restaurant = await Restaurant.findById(restaurantId);

    if (!restaurant) {
        return res.status(404).send('Restaurant not found');
    }

    const newMenuItem = {
        name,
        price,
        isVeg,
        image,
        description
    };

    // Add the new menu item to the restaurant's menu array
    restaurant.menu.push(newMenuItem);
    await restaurant.save();
    res.send(restaurant);
})

module.exports = router;
