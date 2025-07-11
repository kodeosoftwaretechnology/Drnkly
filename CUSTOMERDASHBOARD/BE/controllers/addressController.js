const Address = require('../models/Address');
const axios = require('axios');

// 🔄 Reverse Geocoding & Save

exports.getAddressFromCoordinates = async (req, res) => {
  const { latitude, longitude, userId } = req.query;

  if (!latitude || !longitude || !userId) {
    return res.status(400).json({ message: 'Latitude, longitude, and userId are required' });
  }

  try {
    const geoRes = await axios.get('https://nominatim.openstreetmap.org/reverse', {
      params: {
        format: 'json',
        lat: latitude,
        lon: longitude,
        zoom: 18,
        addressdetails: 1,
      },
      headers: { 'User-Agent': 'PegHouse/1.0' }
    });

    const { display_name, address } = geoRes.data;
    const city = address.city || address.town || address.village || '';
    const pincode = address.postcode || '';

    // ✅ Check if this address already exists for the user
    const existingAddress = await Address.findOne({
      userId,
      address: display_name,
      city,
      pincode
    });

    if (existingAddress) {
      return res.status(200).json({
        message: 'Address already exists',
        address: display_name,
        city,
        pincode
      });
    }

    // ✅ Save as new address
    const newAddress = new Address({
      userId,
      address: display_name,
      city,
      pincode,
      latitude,
      longitude,
      type: 'Auto'
    });

    await newAddress.save();

    // ✅ Send response to frontend
    res.status(200).json({
      address: display_name,
      city,
      pincode
    });
  } catch (err) {
    console.error('🔻 Geocoding error:', err.message);
    res.status(500).json({ message: 'Failed to get address from coordinates.' });
  }
};




// 📄 Get all addresses for a user
exports.getUserAddresses = async (req, res) => {
  try {
    const userId = req.params.userId;
    const addresses = await Address.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(addresses);
  } catch (err) {
    console.error('❌ Error fetching addresses:', err.message);
    res.status(500).json({ message: 'Failed to fetch addresses' });
  }
};

// ➕ Manually add an address
// POST /api/addresses
exports.addManualAddress = async (req, res) => {
  const {
    userId,
    address,
    city = '',
    pincode = '',
    type = 'Manual',
    flatNo = '',
    buildingNo = '',
    fullAddress = '',
    landmark = '',
    additionalInfo = '',
    latitude = null,
    longitude = null
  } = req.body;

  if (!userId || !address) {
    return res.status(400).json({ message: 'User ID and address are required' });
  }

  try {
    const newAddress = new Address({
      userId,
      address,
      city,
      pincode,
      type,
      flatNo,
      buildingNo,
      fullAddress,
      landmark,
      additionalInfo,
      latitude,
      longitude
    });

    await newAddress.save();
    res.status(201).json({ message: 'Address added successfully', address: newAddress });
  } catch (err) {
    console.error('❌ Error saving manual address:', err.message);
    res.status(500).json({ message: 'Failed to add address' });
  }
};




// ✏️ Update address by ID
exports.updateAddress = async (req, res) => {
  const { addressId } = req.params;
  const { address, city, pincode, type } = req.body;

  try {
    const updated = await Address.findByIdAndUpdate(
      addressId,
      { address, city, pincode, type },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: 'Address not found' });

    res.status(200).json({ message: 'Address updated successfully', address: updated });
  } catch (err) {
    console.error('❌ Error updating address:', err.message);
    res.status(500).json({ message: 'Failed to update address' });
  }
};

// 🗑️ Delete address by ID
exports.deleteAddress = async (req, res) => {
  const { addressId } = req.params;

  try {
    const deleted = await Address.findByIdAndDelete(addressId);

    if (!deleted) return res.status(404).json({ message: 'Address not found' });

    res.status(200).json({ message: 'Address deleted successfully' });
  } catch (err) {
    console.error('❌ Error deleting address:', err.message);
    res.status(500).json({ message: 'Failed to delete address' });
  }
};
