// Run: npm run hash "yourpassword"
// Copy the printed hash into ADMIN_PASSWORD_HASH in your .env file
const bcrypt = require('bcryptjs');

const password = process.argv[2];
if (!password) {
  console.log('Usage: npm run hash "yourpassword"');
  process.exit(1);
}

const hash = bcrypt.hashSync(password, 10);
console.log('\nAdd this to your .env as ADMIN_PASSWORD_HASH:\n');
console.log(hash);
console.log('');
