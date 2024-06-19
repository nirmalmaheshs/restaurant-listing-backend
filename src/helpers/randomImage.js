const axios = require('axios');
const CustomError = require("../models/CustomError");

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

const getFoodImage = async (query) => {
    try {
        const response = await axios.get('https://api.unsplash.com/search/photos', {
            params: {
                query: query,
                client_id: UNSPLASH_ACCESS_KEY,
                per_page: 1
            }
        });
        return response.data.results[0].urls.regular;
    } catch (e) {
        console.error('Failed to get specific food. Selecting random images.', e);
        return await getRandomFoodImage(query);
    }
}

const getRandomFoodImage = async (query) => {
    const response = await axios.get('https://api.unsplash.com/photos/random', {
        params: {
            query: 'food',
            client_id: UNSPLASH_ACCESS_KEY
        }
    });
    return response.data.urls.regular;
}

const generateImageUrl = async (query, category = 'RANDOM') => {
    try {

        switch (category) {
            case 'RANDOM':
                return await getRandomFoodImage(query);
            default:
                return await getFoodImage(query);

        }
    } catch (error) {
        console.error('Error fetching random food image:', error);
        throw new CustomError(500, 'Could not fetch random food image');
    }
};

module.exports = generateImageUrl;
