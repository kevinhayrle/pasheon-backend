// controllers/productController.js

const db = require('../db');

// ➕ Add new product
exports.addProduct = async (req, res) => {
  const { name, description, price, image_url, category } = req.body;

  if (!name || !price || !image_url) {
    return res.status(400).json({ error: 'Name, price, and image are required.' });
  }

  try {
    await db.query(
      'INSERT INTO products (name, description, price, image_url, category, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
      [name, description, price, image_url, category]
    );
    res.status(201).json({ message: 'Product added successfully.' });
  } catch (err) {
    console.error('Error adding product:', err);
    res.status(500).json({ error: 'Server error while adding product.' });
  }
};

// 📦 Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM products ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching products:', err.message);
    res.status(500).json({ error: 'server error.' });
  }
};

// 🔍 Get single product by ID (with extra images)
exports.getProductById = async (req, res) => {
  const { id } = req.params;

  try {
    // 1. Get the main product
    const [rows] = await db.query('SELECT * FROM products WHERE product_id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    const product = rows[0];

    // 2. Get all extra images for this product
    const [imageRows] = await db.query(
      'SELECT image_url FROM product_images WHERE product_id = ?',
      [id]
    );

    // 3. Format the result to include extra images
    product.extra_images = imageRows.map(row => row.image_url);

    res.json(product);
  } catch (err) {
    console.error('Error fetching product by ID:', err);
    res.status(500).json({ error: 'Server error.' });
  }
};

// ✏ Update product
exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, image_url, category } = req.body;

  try {
    await db.query(
      'UPDATE products SET name = ?, description = ?, price = ?, image_url = ?, category = ? WHERE product_id = ?',
      [name, description, price, image_url, category, id]
    );
    res.json({ message: 'Product updated successfully.' });
  } catch (err) {
    console.error('Error updating product:', err);
    res.status(500).json({ error: 'Server error during product update.' });
  }
};

// ❌ Delete product
exports.deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    await db.query('DELETE FROM products WHERE product_id = ?', [id]);
    res.json({ message: 'Product deleted successfully.' });
  } catch (err) {
    console.error('Error deleting product:', err);
    res.status(500).json({ error: 'Failed to delete product.' });
  }
};