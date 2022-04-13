const Product = require("../db/models/Product.models");
const User = require("../db/models/User.models");
const Cart = require("../db/models/Cart.models");
const Order = require("../db/models/Order.models");
const Address = require("../db/models/Address.models");

const addItemToCart = async (req, res, next) => {
  const productId = req.body.orderItem.product;
  const objProduct = req.body.orderItem;
  // find product
  const product = await Product.findById(productId);
  if (!product)
    return res
      .status(500)
      .json({ error: { status: false, message: "product not found" } });

  objProduct.price = product.price;
  console.log(product);
  // add Order
  const order = new Order({ auth: product.auth, item: objProduct });
  if (!order)
    return res
      .status(500)
      .json({ error: { status: false, message: "order not made" } });

  // // check status order
  // if (order.status === "inActive")
  //   return res
  //     .status(500)
  //     .json({ error: { status: false, message: "order not active" } });

  // cart
  const findUserInCart = await Cart.findOne({ user: req.user.id }).populate(
    "orders"
  );
  // check user in cart
  if (findUserInCart) {
    const isOrderAdd = findUserInCart.orders.find(
      (i) => i.item.product.toString() === productId.toString()
    );
    // check Duplicate product
    if (isOrderAdd) {
      return res.status(500).json({
        error: { status: false, message: "There is this cart" },
      });
    } else {
      const addOrderToCart = await Cart.findByIdAndUpdate(
        findUserInCart.id,
        { $push: { orders: order.id } },
        { new: true }
      );
      if (!addOrderToCart)
        return res.status(500).json({
          error: { status: false, message: "not add product to cart" },
        });
      order.save();

      return res.json({
        status: true,
        message: "add product to cart",
        data: addOrderToCart,
      });
    }
  } else {
    const cart = await Cart.create({
      user: req.user.id,
      orders: [order.id],
      totalPrice: order.item.price,
      totalDeliveryCost: order.deliveryCost,
    });
    order.save();
    return res
      .status(200)
      .json({ status: true, message: "cart created", data: cart });
  }
};

const getCartUser = async (req, res, next) => {
  const userId = req.user.id;
  try {
    const cart = await Cart.findOne({ user: userId }).populate("orders");
    if (!cart)
      return res
        .status(500)
        .json({ error: { status: false, message: "not found cart" } });
    // update product
    const update = await updateAnyCart(cart);
    if (!update.length > 0)
      return res
        .status(500)
        .json({ error: { status: false, message: "not update list" } });

    // refresh cart
    const refreshCart = await Cart.findOne({ user: userId }).populate("orders");
    return res.status(200).json({
      status: true,
      message: "get cart",
      data: refreshCart.itemCartModel(),
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ error: { status: false, message: e } });
  }
};

const getAllCart = async (req, res, next) => {
  try {
    const listCart = await Cart.find().populate("orders");
    if (!listCart)
      return res
        .status(500)
        .json({ error: { status: false, message: "not found cart" } });

    for (var i = 0; i < listCart.length; i++) {
      const cart = listCart[i];
      const update = await updateAnyCart(cart);
      if (!update)
        return res
          .status(500)
          .json({ error: { status: false, message: "not update" } });
    }
    // refresh cart
    const refreshCart = await Cart.find().populate("orders");
    cartItem = refreshCart.map((cart) => cart.itemCartModel());

    return res.status(200).json({
      status: true,
      message: "get cart admin",
      data: cartItem,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ error: { status: false, message: e } });
  }
};

const addAddressToCart = async (req, res, next) => {
  try {
    const address = await Address.findById(req.body.address);
    if (!address)
      return res
        .status(500)
        .json({ error: { status: false, message: "not found address" } });

    const cartAddress = await Cart.findOneAndUpdate(
      { user: req.user.id },
      { $set: { deliveryAddress: address } },
      { new: true }
    );
    if (!cartAddress)
      res
        .status(500)
        .json({ error: { status: false, message: "not update cart address" } });

    return res
      .status(200)
      .json({ status: true, message: "update address", data: cartAddress });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ error: { status: false, message: e } });
  }
};

const removeItemInCart = async (req, res) => {
  try {
    const orderId = req.body.orderId;
    const order = await Order.findById(orderId);
    if (!order)
      return res
        .status(500)
        .json({ error: { status: false, message: "not found order" } });

    const cart = await Cart.findOneAndUpdate(
      { user: req.user.id },
      { $pull: { orders: orderId } },
      { new: true }
    );
    if (!cart)
      return res
        .status(500)
        .json({ error: { status: false, message: "not delete order" } });

    order.remove({ id: order.id });

    if (!cart.orders.length > 0) {
      cart.remove({ id: cart.id });
      return res
        .status(200)
        .json({ status: true, message: "remove cart", });
    }

    return res
      .status(200)
      .json({ status: true, message: "remove item cart", data: cart });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ error: { status: false, message: "not delete" } });
  }
};

/* *********** SELLER ************* */
const getOrderStatusSeller = async (req, res) => {
  // status : "pending" "order" "posted" "received" "returned"
  try {
    const orderStatus = await Order.find({
      auth: req.user.id,
      status: req.body.orderStatus,
    });
    if (!orderStatus.length > 0)
      return res
        .status(500)
        .json({ error: { status: false, message: "not found order status" } });

    return res.status(200).json({
      status: true,
      message: "get cart",
      data: { orderStatus },
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ error: { status: false, message: e } });
  }
};

/* ******************** NOT EXPORTS *********************** */
const updateAnyCart = async (cart) => {
  const update = [];
  for (var i = 0; i < cart.orders.length; i++) {
    const product = await Product.findById(cart.orders[i].item.product);
    if (!product)
      return res
        .status(500)
        .json({ error: { status: false, message: "not found product" } });
    // console.log(cart.orders[i].id);
    const updatePrice = await Order.findByIdAndUpdate(
      cart.orders[i].id,
      { "item.price": product.price },
      { new: true }
    );
    update.push(updatePrice);
  }
  return update;
};

module.exports = {
  getCartUser,
  addItemToCart,
  getAllCart,
  addAddressToCart,
  getOrderStatusSeller,
  removeItemInCart,
};
