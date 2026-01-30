import Order from "../models/order.model.js"
import Shop from "../models/shop.js"
import User from "../models/user.model.js"
import DeliveryAssignment from "../models/deliveryAssignment.js"
import deliveryAssignment from "../models/deliveryAssignment.js"
export const placeOrder = async (req, res) => {
    try {
        const { cartItems, paymentMethod, deliveryAddress, totalAmount } = req.body

        // ✅ Cart validation
        if (!cartItems || cartItems.length === 0) {
            return res.status(400).json({ message: "Cart is empty" })
        }

        // ✅ Delivery address validation
        if (
            !deliveryAddress ||
            !deliveryAddress.text ||
            !deliveryAddress.latitude ||
            !deliveryAddress.longitude
        ) {
            return res
                .status(400)
                .json({ message: "Send complete delivery address" })
        }

        // ✅ Group cart items shop-wise
        const groupItemsByShop = {}

        cartItems.forEach((item) => {
            const shopId = item.shop.toString()
            if (!groupItemsByShop[shopId]) {
                groupItemsByShop[shopId] = []
            }
            groupItemsByShop[shopId].push(item)
        })

        // ✅ Create shop orders
        const shopOrders = await Promise.all(
            Object.keys(groupItemsByShop).map(async (shopId) => {
                const shop = await Shop.findById(shopId).populate("owner")
                if (!shop) {
                    throw new Error("Shop not found")
                }

                const items = groupItemsByShop[shopId]

                const subTotal = items.reduce(
                    (sum, i) => sum + Number(i.price) * Number(i.quantity),
                    0
                )

                return {
                    shop: shop._id,
                    owner: shop.owner._id,
                    subTotal,
                    shopOrderItems: items.map((i) => ({
                        item: i.id,
                        name: i.name,
                        price: i.price,
                        quantity: i.quantity,
                    })),
                }
            })
        )

        // ✅ Create final order
        const newOrder = await Order.create({
            user: req.userId,
            paymentMethod,
            deliveryAddress,
            totalAmount,
            shopOrders,
        })
        await newOrder.populate("shopOrders.shopOrderItems.item", "name image price")
        await newOrder.populate("shopOrders.shop", "name")
        return res.status(201).json({
            message: "Order placed successfully",
            order: newOrder,
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: error.message })
    }
}
export const getMyOrder = async (req, res) => {
    try {
        const user = await User.findById(req.userId)
        if (user.role === "user") {
            const orders = await Order.find({ user: req.userId }).sort({ createAt: -1 }).populate("shopOrders.shop", "name").populate("shopOrders.owner", "name email mobile").populate("shopOrders.shopOrderItems.item", "name image price")
            return res.status(200).json(orders)
        } else {
            if (user.role === "owner") {
                const orders = await Order.find({ "shopOrders.owner": req.userId }).sort({ createAt: -1 }).populate("shopOrders.shop", "name").populate("user").populate("shopOrders.shopOrderItems.item", "name image  price").populate("shopOrders.assignedDeliveryBoy", "fullName mobile")
                const filterOrder = orders.map((order => ({
                    _id: order._id,
                    paymentMethod: order.paymentMethod,
                    user: order.user,
                    shopOrders: order.shopOrders.find(o => o.owner._id == req.userId),
                    createdAt: order.createdAt,
                    deliveryAddress: order.deliveryAddress
                })))
                return res.status(200).json(filterOrder)
            }
        }

    } catch (error) {
        return res.status(500).json({ message: `get user order error ${error}` })
    }
}

export const updateOrderStatus = async (req, res) => {
    try {
        const { orderId, shopId } = req.params
        const { status } = req.body
        const order = await Order.findById(orderId)
        const shopOrder = order.shopOrders.find(
            (o) => o.shop.toString() === shopId
        )
        if (!shopOrder) {
            return res.status(400).json({ message: "shop order not found" })
        }
        shopOrder.status = status
        let deliveryBoyPayload = []

        if (status === "out of delivery" && !shopOrder.assignment) {
            const { longitude, latitude } = order.deliveryAddress
            const nearByDeliveryBoys = await User.find({
                role: "deliveryBoy",
                location: {
                    $near: {
                        $geometry: { type: "Point", coordinates: [Number(longitude), Number(latitude)] },
                        $maxDistance: 5000
                    }
                }
            })
            const nearByIds = nearByDeliveryBoys.map((b) => b._id)
            const busyIds = await DeliveryAssignment.find({
                assignedTo: { $in: nearByIds },
                status: { $nin: ["brodcasted", "completed"] }
            }).distinct("assignedTo")

            const busyIdSet = new Set(busyIds.map(id => String(id)))
            const availableBoys = nearByDeliveryBoys.filter(b => !busyIdSet.has(b._id))
            const candidates = availableBoys.map(b => b._id)
            if (candidates.length == 0) {
                await order.save()
                return res.json({
                    message: "there is no delivery boy avalible"
                })
            }
            const deliveryAssignment = await DeliveryAssignment.create({
                order: order._id,
                shop: shopOrder.shop,
                shopOrderId: shopOrder._id,
                brodcastedTo: candidates,
                status: "brodcasted"
            })
            shopOrder.assignedDeliveryBoy = deliveryAssignment.assignedTo
            shopOrder.assignment = deliveryAssignment._id
            deliveryBoyPayload = availableBoys.map(b => ({
                id: b._id,
                fullName: b.fullName,
                longitude: b.location?.coordinates?.[0],
                latitude: b.location?.coordinates?.[1],
                mobile: b.mobile
            }))
        }

        await order.save()
        const updatedShopOrder = order.shopOrders.find(
            (o) => o.shop.toString() === shopId
        )
        await order.populate("shopOrders.shop", "name")
        await order.populate("shopOrders.assignedDeliveryBoy", "fullName email mobile")


        return res.status(200).json({
            shopOrder: updatedShopOrder,
            assignedDeliveryBoy: updatedShopOrder?.assignedDeliveryBoy,
            availableBoys: deliveryBoyPayload,
            assignment: updatedShopOrder?.assignment._id
        })
    } catch (error) {
        return res.status(500).json({ message: ` order starus error  ${error}` })
    }
}

export const getDeliveryBoyAssignment = async (req, res) => {
    try {
        const deliveryBoyId = req.userId
        const assingnment = await DeliveryAssignment.find({
            brodcastedTo: deliveryBoyId,
            status: "brodcasted"
        })
            .populate("order")
            .populate("shop")
        const formated = assingnment.map(a => ({
            assignmentId: a._id,
            orderId: a.order._id,
            shopName: a.shop.name,
            deliveryAddress: a.order.deliveryAddress,
            items: a.order.shopOrders.find(so => so._id.equals(a.shopOrderId)),
            subTotal: a.order.shopOrders.find(so => so._id.equals(a.shopOrderId))?.subTotal
        }))
        return res.status(200).json(formated)

    } catch (error) {
        return res.status(500).json({ message: `get-Assignment error  ${error}` })
    }
}

export const acceptOrder = async (req, res) => {
    try {
        const { assignmentId } = req.params
        const assignment = await DeliveryAssignment.findById(assignmentId)
        if (!assignmentId) {
            return res.status(400).json({ message: `assignment not found` })
        }
        if (assignment.status !== "brodcasted") {
            return res.status(400).json({ message: `assignment is expired` })
        }
        const alreadyAssigned = await DeliveryAssignment.findOne({
            assignedTo: req.userId,
            status: { $nin: ["brodcasted", "completed"] }
        })
        if (alreadyAssigned) {
            return res.status(400).json({ message: `you are already assigned to another order` })
        }
        assignment.assignedTo = req.userId
        assignment.status = "assigned"
        assignment.acceptedAt = new Date()
        await assignment.save()
        const order = await Order.findById(assignment.order)
        if (!order) {
            return res.status(400).json({ message: `order not found` })
        }
        const shopOrder = order.shopOrders.id(assignment.shopOrderId)
        shopOrder.assignedDeliveryBoy = req.userId
        await order.save()
        return res.status(200).json({ message: `order accepted` })

    } catch (error) {
        return res.status(500).json({ message: `accept order error ` })
    }
}


export const getCurrentOrder = async (req, res) => {
    try {
        const assignment = await DeliveryAssignment.findOne({
            assignedTo: req.userId,
            status: "assigned"
        })
            .populate("shop", "name")
            .populate("assignedTo", "fullName location email mobile")
            .populate({
                path: "order",
                populate: [{ path: "user", select: "fullName location email mobile" },
                { path: "shopOrders.shop", select: "name" }
                ]
            })
        if (!assignment) {
            return res.status(400).json({ message: `assignment not found ` })
        }
        if (!assignment.order) {
            return res.status(400).json({ message: `order not found ` })
        }
        const shopOrder = assignment.order.shopOrders.find(so => String(so._id) == String(assignment.shopOrderId))
        if (!shopOrder) {
            return res.status(400).json({ message: `shopOrder not found ` })
        }
        let deliveryBoyLocation = { lat: null, lon: null }
        if (assignment.assignedTo.location.coordinates.length == 2) {
            deliveryBoyLocation.lat = assignment.assignedTo.location.coordinates[1]
            deliveryBoyLocation.lon = assignment.assignedTo.location.coordinates[0]
        }
        let customerLocation = { lat: null, lon: null }
        if (assignment.order.deliveryAddress) {
            customerLocation.lat = assignment.order.deliveryAddress.latitude
            customerLocation.lon = assignment.order.deliveryAddress.longitude

        }
        return res.status(200).json({
            id: assignment.order._id,
            user: assignment.order.user,
            shopOrder,
            deliveryAssignment: assignment.order.deliveryAddress,
            deliveryBoyLocation,
            customerLocation
        })
    } catch (error) {
        return res.status(500).json({ message: `current order error ` })
    }
}