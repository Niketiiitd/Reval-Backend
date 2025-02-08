import axios from 'axios';
import asyncHandler from '../utils/asyncHandler.js';

const getRecommendations = asyncHandler(async (req, res) => {
    const { product_id, top_n } = req.body;

    try {
        const response = await axios.post('https://recommendation-system-hacktu.onrender.com/recommend/', {
            product_id,
            top_n
        });

        const recommendations = response.data.recommendations;
        res.status(200).json({ recommendations });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export { getRecommendations };