const bcrypt = require('bcryptjs');

// Your plain password
const plainPassword = 'pasheon135';

// Your hashed password from DB
const hashedPassword = '$2a$10$kH9ec8Faa03OIjY1X5JQPezy/9gh02vpiqXRr9FbK3ZVtY0PyUSLC';

(async () => {
  const match = await bcrypt.compare(plainPassword, hashedPassword);
  console.log('✅ Password Match:', match);
})();