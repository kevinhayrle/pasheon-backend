const db = require('../db');

// ➕ Add new product
exports.addProduct = async (req, res) => {
  const { name, description, price, image_url, category, sizes = [], extra_images = [] } = req.body;

  if (!name || !price || !image_url) {
    return res.status(400).json({ error: 'Name, price, and image are required.' });
  }

  try {
    const [result] = await db.query(
      'INSERT INTO products (name, description, price, image_url, category, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
      [name, description, price, image_url, category]
    );

    const productId = result.insertId;

    // Insert sizes
    if (sizes.length > 0) {
      const sizeValues = sizes.map(size => [productId, size]);
      await db.query('INSERT INTO product_sizes (product_id, size) VALUES ?', [sizeValues]);
    }

    // Insert extra images
    if (extra_images.length > 0) {
      const imageValues = extra_images.map(url => [productId, url]);
      await db.query('INSERT INTO product_images (product_id, image_url) VALUES ?', [imageValues]);
    }

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
    res.status(500).json({ error: 'Server error.' });
  }
};

// 🔍 Get single product by ID (with extra images and sizes)
exports.getProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    const product = rows[0];

    const [imageRows] = await db.query(
      'SELECT image_url FROM product_images WHERE product_id = ?',
      [id]
    );
    product.extra_images = imageRows.map(row => row.image_url);

    const [sizeRows] = await db.query(
      'SELECT size FROM product_sizes WHERE product_id = ?',
      [id]
    );
    product.sizes = sizeRows.map(row => row.size);

    res.json(product);
  } catch (err) {
    console.error('Error fetching product by ID:', err);
    res.status(500).json({ error: 'Server error.' });
  }
};

// ✏ Update product (including sizes and extra images)
exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, image_url, category, sizes = [], extra_images = [] } = req.body;

  try {
    await db.query(
      'UPDATE products SET name = ?, description = ?, price = ?, image_url = ?, category = ? WHERE id = ?',
      [name, description, price, image_url, category, id]
    );

    // Replace sizes
    await db.query('DELETE FROM product_sizes WHERE product_id = ?', [id]);
    if (sizes.length > 0) {
      const sizeInsertValues = sizes.map(size => [id, size]);
      await db.query('INSERT INTO product_sizes (product_id, size) VALUES ?', [sizeInsertValues]);
    }

    // Replace extra images
    await db.query('DELETE FROM product_images WHERE product_id = ?', [id]);
    if (extra_images.length > 0) {
      const imageInsertValues = extra_images.map(url => [id, url]);
      await db.query('INSERT INTO product_images (product_id, image_url) VALUES ?', [imageInsertValues]);
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
    await db.query('DELETE FROM products WHERE id = ?', [id]);
    await db.query('DELETE FROM product_images WHERE id = ?', [id]);
    await db.query('DELETE FROM sizes WHERE id = ?', [id]);

    res.json({ message: 'Product deleted successfully.' });
  } catch (err) {
    console.error('Error deleting product:', err);
    res.status(500).json({ error: 'Failed to delete product.' });
  }
};