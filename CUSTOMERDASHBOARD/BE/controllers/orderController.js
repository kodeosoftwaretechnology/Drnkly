const Order = require('../models/Order');
const path = require('path');

exports.placeOrder = async (req, res) => {
  try {
    const { userId, items, address, totalAmount } = req.body;

    const newOrder = new Order({
      userId,
      items,
      deliveryAddress: address,
      totalAmount
    });

    await newOrder.save();
    res.status(201).json({ message: 'Order placed successfully', order: newOrder });
  } catch (error) {
    console.error('Order Error:', error);
    res.status(500).json({ error: 'Failed to place order' });
  }
};
exports.updatePaymentStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: 'Payment proof is required' });
    }

    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
    
    const updated = await Order.findByIdAndUpdate(
      orderId,
      {
        paymentStatus: 'paid',
        paymentProof: fileUrl,
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({ message: 'Payment successful', order: updated });
  } catch (error) {
    console.error('Error updating payment status:', error);
    res.status(500).json({ message: 'Error updating payment status', error: error.message });
  }
};



exports.getOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Ensure userId is valid
    if (!userId) {
      return res.status(400).json({ error: 'Invalid userId' });
    }

    // Fetch orders based on userId and sort them by creation date in descending order
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json({ orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};



// Fetch specific order details by order ID
exports.getOrderDetails = async (req, res) => {
  const { orderId } = req.params; // Get order ID from URL

  try {
    const order = await Order.findById(orderId)
      .populate('items.productId'); // Populate product details

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json(order); // Return the full order details
  } catch (error) {
    console.error('Error fetching order details:', error);
    res.status(500).json({ message: 'Error fetching order details', error: error.message });
  }
};







