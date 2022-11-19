const mongoose = require('mongoose');

const Vendedor = mongoose.model('vendedores',
  new mongoose.Schema({ identificacion: Number, nombre: String, email: String, totalcomision: Number })
);

const Venta = mongoose.model('ventas',
  new mongoose.Schema({ identificacion: String, zona: String, fecha: String, valorventa: Number })
);

module.exports = {
  Vendedor: Vendedor,
  Venta: Venta,
}

// Otra forma más corta:
// module.exports = {
//     Vendedor,
//     Venta
// }
