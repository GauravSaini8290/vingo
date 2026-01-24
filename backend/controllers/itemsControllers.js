import Shop from "../models/shop.js";
import Item from "../models/items.js";
import uploadOnCloudinary from "../utils/cloudinary.js";

export const addItem = async (req, res) => {
    try {
        const { name, category, foodType, price } = req.body;
        let image;

        if (req.file) {
            image = await uploadOnCloudinary(req.file.path);
        }

        const shop = await Shop.findOne({ owner: req.userId })
        if (!shop) {
            return res.status(400).json({ message: "Shop not found" });
        }

        const item = await Item.create({
            name,
            category,
            foodType,
            price,
            image,
            shop: shop._id
        });
        shop.item.push(item._id)
        await shop.save()
        await shop.populate([
            { path: "owner" },
            {
                path: "item",
                options: { sort: { updatedAt: -1 } }
            }
        ]);

        return res.status(201).json(shop);
    } catch (error) {
        return res.status(500).json({ message: `Add item error: ${error}` });
    }
};

export const editItem = async (req, res) => {
    try {
        const { itemId } = req.params; // fixed typo
        const { name, category, foodType, price } = req.body;
        let updateData = { name, category, foodType, price };

        if (req.file) {
            const image = await uploadOnCloudinary(req.file.path);
            updateData.image = image; // only update if new image exists
        }

        const item = await Item.findByIdAndUpdate(itemId, updateData, { new: true });

        if (!item) {
            return res.status(400).json({ message: "Item not found" });
        }
        const shop = await Shop.findOne({ owner: req.userId }).populate({
            path: "item",
            options: { sort: { updatedAt: -1 } }
        })

        return res.status(200).json(shop);
    } catch (error) {
        return res.status(500).json({ message: `Edit item error: ${error}` });
    }
};
export const getItemByEdit = async (req, res) => {
    try {
        const itemId = req.params.itemId
        const item = await Item.findById(itemId)
        if (!item) {
            return res.status(400).json({ message: "item not found" })
        }
        return res.status(200).json(item)
    } catch (error) {
        return res.status(500).json({ message: `get item error: ${error}` });
    }
}
export const deleteItem = async (req, res) => {
    try {
        const { itemId } = req.params;

        const item = await Item.findById(itemId);
        if (!item) {
            return res.status(400).json({ message: "Item not found" });
        }

        const shop = await Shop.findOne({ owner: req.userId });
        if (!shop) {
            return res.status(400).json({ message: "Shop not found" });
        }

        // remove item id from shop
        shop.item = shop.item.filter(
            (i) => i.toString() !== itemId
        );
        await shop.save();

        // delete item document
        await Item.findByIdAndDelete(itemId);

        await shop.populate({
            path: "item",
            options: { sort: { updatedAt: -1 } }
        });

        return res.status(200).json(shop);
    } catch (error) {
        return res.status(500).json({
            message: `delete item error: ${error.message}`
        });
    }
};

export const getItemByCity = async (req, res) => {
    try {
        const { city } = req.params
        if (!city) {
            return res.status(400).json({ message: " city is required" })
        }
        const shops = await Shop.find({
            city: { $regex: new RegExp(`^${city}$`, "i") }
        }).populate("item")
        if (!shops) {
            return res.status(400).json({ message: " shop not found" })
        }
        const shopIds = shops.map((shop) => shop._id)
        const items = await Item.find({ shop: { $in: shopIds } })

        return res.status(200).json(items);
    } catch (error) {
        return res.status(500).json({
            message: `getItemByCity error: ${error.message}`
        });
    }
}

