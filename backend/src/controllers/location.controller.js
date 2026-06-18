import { LocationCache } from "../db/mongodb/models/location.model.js";

const API_KEY = process.env.COUNTRY_STATE_CITY_API_KEY;
const BASE_URL = "https://api.countrystatecity.in/v1";
const CACHE_DAYS = 10;
const CACHE_MS = CACHE_DAYS * 24 * 60 * 60 * 1000;

const fetchFromAPI = async (endpoint) => {
    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            headers: { "X-CSCAPI-KEY": API_KEY }
        });
        if (!response.ok) throw new Error(`API request failed with status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("fetchFromAPI Error:", error);
        return [];
    }
};

const getCachedOrFetch = async (key, endpoint) => {
    try {
        const cache = await LocationCache.findOne({ key });
        const now = new Date();
        
        // 10 day cache check
        if (cache && (now - cache.updatedAt) < CACHE_MS) {
            return cache.data;
        }
        
        const data = await fetchFromAPI(endpoint);
        
        if (data && Array.isArray(data) && data.length > 0) {
            await LocationCache.findOneAndUpdate(
                { key },
                { key, data },
                { upsert: true, new: true, setDefaultsOnInsert: true }
            );
        }
        
        return data || [];
    } catch (err) {
        console.error("getCachedOrFetch error:", err);
        return [];
    }
}

const getCountries = async (req, res) => {
    const data = await getCachedOrFetch('countries', '/countries');
    res.status(200).json({ success: true, data });
};

const getStates = async (req, res) => {
    const { ciso } = req.params;
    const data = await getCachedOrFetch(`states_${ciso}`, `/countries/${ciso}/states`);
    res.status(200).json({ success: true, data });
};

const getCities = async (req, res) => {
    const { ciso, siso } = req.params;
    const data = await getCachedOrFetch(`cities_${ciso}_${siso}`, `/countries/${ciso}/states/${siso}/cities`);
    res.status(200).json({ success: true, data });
};

// Handlers grouped by HTTP method (see shared controller convention).
const locationController = {
    get: {
        getCountries,
        getStates,
        getCities,
    },
};

export default locationController;
