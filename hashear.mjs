import bcrypt from 'bcrypt';

const password = '12345678';
const hash = await bcrypt.hash(password, 10);

console.log('Contraseña:', password);
console.log('Hash:', hash);
