const db = require('../db');

// ✅ GET: Fetch all products
const getAllProducts = async (req, res) => {
  try {
    const [results] = await db.execute('SELECT * FROM products');
    res.json(results);
  } catch (err) {
    console.error('❌ Failed to fetch products:', err.message);
    res.status(500).json({ message: 'Error retrieving products' });
  }
};

// ✅ DELETE: Remove a product by ID
const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.execute('DELETE FROM products WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: '✅ Product deleted successfully' });
  } catch (err) {
    console.error('❌ Failed to delete product:', err.message);
    res.status(500).json({ message: 'Error deleting product' });
  }
};

// ✅ POST: Add a new product
const addProduct = async (req, res) => {
  console.log('📥 Incoming addProduct request:', req.body);
  const { name, price, category, image_url, description } = req.body;

  if (!name || !price || !category || !image_url || !description) {
    console.log('❗ Missing field');
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const sql = 'INSERT INTO products (name, price, category, image_url, description) VALUES (?, ?, ?, ?, ?)';
    const [result] = await db.execute(sql, [name, price, category, image_url, description]);

    console.log('✅ Product inserted into DB with ID:', result.insertId);
    res.status(201).json({ message: '✅ Product added successfully', productId: result.insertId });
  } catch (err) {
    console.error('❌ Failed to add product:', err.message);
    res.status(500).json({ message: 'Error adding product' });
  }
};

module.exports = {
  getAllProducts,
  deleteProduct,
  addProduct,
};