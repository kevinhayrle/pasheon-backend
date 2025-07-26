const db = require('../db');

// ➕ Add new product
exports.addProduct = async (req, res) => {
  const { name, description, price, image_url, category, sizes, extra_images } = req.body;

  if (!name || !price || !image_url) {
    return res.status(400).json({ error: 'Name, price, and image are required.' });
  }

  try {
    // Insert product
    const [result] = await db.query(
      'INSERT INTO products (name, description, price, image_url, category, sizes, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())',
      [name, description, price, image_url, category, JSON.stringify(sizes || [])]
    );

    const productId = result.insertId;

    // Insert extra images if any
    if (Array.isArray(extra_images)) {
      for (const img of extra_images) {
        await db.query(
          'INSERT INTO product_images (product_id, image_url) VALUES (?, ?)',
          [productId, img]
        );
      }
    }

    res.status(201).json({ message: 'Product added successfully.', productId });
  } catch (err) {
    console.error('Error adding product:', err);
    res.status(500).json({ error: 'Server error while adding product.' });
  }
};

// 📦 Get all products (no extra images here)
exports.getAllProducts = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM products ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching products:', err.message);
    res.status(500).json({ error: 'Server error while fetching products.' });
  }
};

// 🔍 Get single product by ID (includes sizes + extra images)
exports.getProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const [productRows] = await db.query('SELECT * FROM products WHERE id = ?', [id]);

    if (productRows.length === 0) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    const product = productRows[0];

    // Parse sizes
    try {
      product.sizes = JSON.parse(product.sizes || '[]');
    } catch {
      product.sizes = [];
    }

    // Fetch extra images
    const [imageRows] = await db.query(
      'SELECT image_url FROM product_images WHERE product_id = ?',
      [id]
    );
    product.extra_images = imageRows.map(img => img.image_url);

    res.json(product);
  } catch (err) {
    console.error('Error fetching product by ID:', err);
    res.status(500).json({ error: 'Server error.' });
  }
};

// ✏ Update product
exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, image_url, category, sizes, extra_images } = req.body;

  try {
    await db.query(
      'UPDATE products SET name = ?, description = ?, price = ?, image_url = ?, category = ?, sizes = ? WHERE id = ?',
      [name, description, price, image_url, category, JSON.stringify(sizes || []), id]
    );

    // Optional: Delete existing extra images and insert new ones
    await db.query('DELETE FROM product_images WHERE product_id = ?', [id]);

    if (Array.isArray(extra_images)) {
      for (const img of extra_images) {
        await db.query(
          'INSERT INTO product_images (product_id, image_url) VALUES (?, ?)',
          [id, img]
        );
      }
    }

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
    // First delete from product_images
    await db.query('DELETE FROM product_images WHERE product_id = ?', [id]);

    // Then delete the product
    await db.query('DELETE FROM products WHERE id = ?', [id]);

    res.json({ message: 'Product deleted successfully.' });
  } catch (err) {
    console.error('Error deleting product:', err);
    res.status(500).json({ error: 'Failed to delete product.' });
  }
};

// 📂 Get all unique product categories
exports.getCategories = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT DISTINCT category FROM products WHERE category IS NOT NULL AND category != ""');
    const categories = rows.map(row => row.category);
    res.json(categories);
  } catch (err) {
    console.error('Error fetching categories:', err.message);
    res.status(500).json({ error: 'Server error while fetching categories.' });
  }
};

// Get all unique product categories
const getAllCategories = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT DISTINCT category FROM products");
    const categories = rows.map(row => row.category);
    res.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  // existing exports...
  getAllCategories, // 👈 Add this
};