const bcrypt = require('bcryptjs');

// Cambia esta por tu nueva contraseña
const nuevaContraseña = 'tu-nueva-contraseña-segura';

// Generar hash
const saltRounds = 12;
const hash = bcrypt.hashSync(nuevaContraseña, saltRounds);

console.log('=================================');
console.log('NUEVA CONTRASEÑA HASHEADA:');
console.log('=================================');
console.log('Contraseña:', nuevaContraseña);
console.log('Hash:', hash);
console.log('=================================');
console.log('');
console.log('QUERY PARA SUPABASE:');
console.log(`UPDATE admin SET password_hash = '${hash}' WHERE id = 1;`);
console.log('=================================');

// Verificar que funciona
const esValida = bcrypt.compareSync(nuevaContraseña, hash);
console.log('Verificación:', esValida ? '✅ CORRECTA' : '❌ ERROR');