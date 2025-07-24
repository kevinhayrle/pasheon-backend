const adminLogin = async (req, res) => {
  const { email, password } = req.body;
  console.log('📩 Login request received:', email);

  try {
    const [rows] = await db.query('SELECT * FROM admin_users WHERE email = ?', [email]);
    console.log('📄 DB Query Result:', rows);

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const admin = rows[0];
    console.log('🔐 Comparing password...');
    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    console.log('🔓 Password matched, creating token...');
    const token = jwt.sign(
      { adminId: admin.id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    console.log('✅ Token created successfully');
    res.json({ token });
  } catch (error) {
    console.error('❌ Admin login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};