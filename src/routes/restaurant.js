const express = require('express');
const auth = require("src/middleware/auth");
const generateImageUrl = require("src/helpers/randomImage");
const Restaurant = require("src/db/schemas/restaurant");
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

router.get('/',auth, async (req, res) => {
    const docs = await Restaurant.find({});
    res.status(200).json(docs);
});

router.get('/:id', auth,async (req, res) => {
    const docs = await Restaurant.findOne({_id: req.params.id});
    res.status(200).json(docs);
})

router.post('/', auth,async (req, res) => {

});

module.exports = router;
