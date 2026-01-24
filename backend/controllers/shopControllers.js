import Shop from "../models/shop.js"
import uploadOnCloudinary from "../utils/cloudinary.js"

export const createEditShop = async (req, res) => {
  try {
    const { name, city, state, address } = req.body;

    let shop = await Shop.findOne({ owner: req.userId });

    // EDIT
    if (shop) {
      shop.name = name;
      shop.city = city;
      shop.state = state;
      shop.address = address;

      // If new image uploaded, update; else keep old image
      if (req.file) {
        const uploaded = await uploadOnCloudinary(req.file.path);
        shop.image = uploaded;
      }

      await shop.save();
    } else {
      // CREATE
      if (!req.file) {
        return res.status(400).json({ message: "Image is required for creating shop." });
      }

      const uploaded = await uploadOnCloudinary(req.file.path);

      shop = await Shop.create({
        name,
        city,
        state,
        address,
        image: uploaded,
        owner: req.userId,
      });
    }

    await shop.populate("owner item");
    return res.status(200).json(shop);
  } catch (error) {
    return res.status(500).json({ message: `create shop err ${error}` });
  }
};

export const getMyShop = async (req, res) => {
    try {
        const shop = await Shop.findOne({ owner: req.userId }).populate("owner").populate({
            path: "item",
            options: { sort: { updatedAt: -1 } }
        })
        if (!shop) {
           return res.status(200).json(null);
        }
        return res.status(200).json(shop)
    } catch (error) {
        return res.status(500).json({ message: `getMyshop err ${error}` })
    }
}

export const getShopByCity = async(req,res) => {
  try {
    const {city} = req.params
    const shops = await Shop.find({
      city:{$regex:new RegExp(`^${city}$`,"i")}
    }).populate("item")
    if(!shops){
      return res.status(400).json({message:" shop not found"})
    }
    return res.status(200).json(shops)
  } catch (error) {
    return res.status(500).json({ message: `getShopByCity err ${error}` })
  }
}



