const db = require('../db');

// 🟢 Get all products
const getAllProducts = async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM products ORDER BY created_at DESC');
    res.status(200).json(results);
  } catch (err) {
    console.error('💥 Failed to fetch products:', err.message);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

// 🔴 Delete product by ID (also delete from product_images)
const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    await db.query('DELETE FROM product_images WHERE product_id = ?', [id]);
    const [result] = await db.query('DELETE FROM products WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.status(200).json({ message: 'Product and associated images deleted successfully' });
  } catch (err) {
    console.error('💥 Failed to delete product:', err.message);
    res.status(500).json({ error: 'Failed to delete product' });
  }
};

// 🟡 Add new product (including 2 extra images)
const addProduct = async (req, res) => {
  const { name, description, price, image_url, extra_images = [], category } = req.body;

  if (!name || !description || !price || !image_url || !category) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const [result] = await db.query(
      'INSERT INTO products (name, description, price, image_url, category, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
      [name, description, price, image_url, category]
    );

    const productId = result.insertId;

    // Insert extra images if provided
    if (Array.isArray(extra_images) && extra_images.length > 0) {
      const values = extra_images.map((url) => [productId, url]);
      await db.query('INSERT INTO product_images (product_id, image_url) VALUES ?', [values]);
    }

    res.status(201).json({ message: 'Product added successfully', productId });
  } catch (err) {
    console.error('💥 Error adding product:', err.message);
    res.status(500).json({ error: 'Failed to add product' });
  }
};

// 🟢 Update product info (NOT extra images)
// 🟢 Update product info + extra images
const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, price, category, image_url, description, extra_images = [] } = req.body;

  if (!name || !price || !category || !image_url || !description) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Update main product details
    const [result] = await db.query(
      `UPDATE products 
       SET name = ?, price = ?, category = ?, image_url = ?, description = ? 
       WHERE id = ?`,
      [name, price, category, image_url, description, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // 🔁 Replace existing extra images
    await db.query('DELETE FROM product_images WHERE product_id = ?', [id]);

    if (Array.isArray(extra_images) && extra_images.length > 0) {
      const values = extra_images.map((url) => [id, url]);
      await db.query('INSERT INTO product_images (product_id, image_url) VALUES ?', [values]);
    }

    res.json({ message: '✅ Product updated successfully (with images)' });
  } catch (err) {
    console.error('💥 Failed to update product:', err.message);
    res.status(500).json({ message: 'Error updating product' });
  }
};
module.exports = {
  getAllProducts,
  deleteProduct,
  addProduct,
  updateProduct,
};