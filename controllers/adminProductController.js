const db = require('../config/db');

// Get all products
const getAllProducts = (req, res) => {
  db.query('SELECT * FROM products ORDER BY created_at DESC', (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch products' });
    }
    res.status(200).json(results);
  });
};

// Delete product by ID
const deleteProduct = (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM products WHERE id = ?', [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to delete product' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(200).json({ message: 'Product deleted successfully' });
  });
};

// Add new product
const addProduct = (req, res) => {
  const { name, description, price, image_url, category } = req.body;

  if (!name || !description || !price || !image_url || !category) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const query = 'INSERT INTO products (name, description, price, image_url, category, created_at) VALUES (?, ?, ?, ?, ?, NOW())';
  const values = [name, description, price, image_url, category];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('Error adding product:', err.message);
      return res.status(500).json({ error: 'Failed to add product' });
    }
    res.status(201).json({ message: 'Product added successfully', productId: result.insertId });
  });
};

// ✅ Update product by ID
const updateProduct = (req, res) => {
  const { id } = req.params;
  const { name, price, category, image_url, description } = req.body;

  if (!name || !price || !category || !image_url || !description) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const sql = `
    UPDATE products 
    SET name = ?, price = ?, category = ?, image_url = ?, description = ? 
    WHERE id = ?
  `;

  db.query(sql, [name, price, category, image_url, description, id], (err, result) => {
    if (err) {
      console.error('Failed to update product:', err.message);
      return res.status(500).json({ message: 'Error updating product' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: '✅ Product updated successfully' });
  });
};

module.exports = {
  getAllProducts,
  deleteProduct,
  addProduct,
  updateProduct, // ✅ added here
};