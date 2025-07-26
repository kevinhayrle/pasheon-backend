const db = require('../db');

// 🟢 Get all products (admin)
const getAllProducts = async (req, res) => {
  try {
    const [products] = await db.query('SELECT * FROM products ORDER BY created_at DESC');

    const productsWithExtras = await Promise.all(
      products.map(async (product) => {
        const [images] = await db.query('SELECT image_url FROM product_images WHERE product_id = ?', [product.id]);

        return {
          ...product,
          extra_images: images.map(img => img.image_url),
          sizes: product.sizes ? JSON.parse(product.sizes) : [], // sizes from TEXT column (JSON)
        };
      })
    );

    res.status(200).json(productsWithExtras);
  } catch (err) {
    console.error('💥 Failed to fetch products:', err.message);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

// 🔴 Delete product by ID
const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    await db.query('DELETE FROM product_images WHERE product_id = ?', [id]);
    const [result] = await db.query('DELETE FROM products WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.status(200).json({ message: '✅ Product and images deleted' });
  } catch (err) {
    console.error('💥 Failed to delete product:', err.message);
    res.status(500).json({ error: 'Failed to delete product' });
  }
};

// ➕ Add product (main image + extra images + sizes)
const addProduct = async (req, res) => {
  const { name, description, price, image_url, extra_images = [], category, sizes = [] } = req.body;

  if (!name || !description || !price || !image_url || !category) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const [result] = await db.query(
      'INSERT INTO products (name, description, price, image_url, category, sizes, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())',
      [name, description, price, image_url, category, JSON.stringify(sizes)]
    );

    const productId = result.insertId;

    // Insert extra images
    if (Array.isArray(extra_images) && extra_images.length > 0) {
      const imageValues = extra_images.map(url => [productId, url]);
      await db.query('INSERT INTO product_images (product_id, image_url) VALUES ?', [imageValues]);
    }

    res.status(201).json({ message: '✅ Product added', productId });
  } catch (err) {
    console.error('💥 Error adding product:', err.message);
    res.status(500).json({ error: 'Failed to add product' });
  }
};

// ✏ Update product (with images & sizes)
const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, price, category, image_url, description, extra_images = [], sizes = [] } = req.body;

  if (!name || !price || !category || !image_url || !description) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const [result] = await db.query(
      `UPDATE products 
       SET name = ?, price = ?, category = ?, image_url = ?, description = ?, sizes = ?
       WHERE id = ?`,
      [name, price, category, image_url, description, JSON.stringify(sizes), id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Replace extra images
    await db.query('DELETE FROM product_images WHERE product_id = ?', [id]);

    if (Array.isArray(extra_images) && extra_images.length > 0) {
      const imageValues = extra_images.map(url => [id, url]);
      await db.query('INSERT INTO product_images (product_id, image_url) VALUES ?', [imageValues]);
    }

    res.json({ message: '✅ Product updated successfully' });
  } catch (err) {
    console.error('💥 Error updating product:', err.message);
    res.status(500).json({ error: 'Failed to update product' });
  }
};

module.exports = {
  getAllProducts,
  deleteProduct,
  addProduct,
  updateProduct,
};