const Store = require('../models/Store');

exports.createStore = async (req, res) => {
    try {
        const store = await Store.create(req.body);
        res.status(201).json(store);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllStores = async (req, res) => {
    try {
        const stores = await Store.findAll();
        res.json(stores);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
