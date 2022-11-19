const cors       = require('cors')
const express    = require("express");
const controller = require("./controllers.js");


const router = express.Router();


// --------------- API REST CRUD

router.get    ("/vendedores",      cors(), controller.readVendedores);   // Read All
router.get    ("/vendedores/:id",  cors(), controller.readVendedor);    // Read
router.delete ("/vendedores/:id",  cors(), controller.deleteVendedor);  // Delete
router.put    ("/vendedores/:id",  cors(), controller.updateVendedor);  // Update
router.post   ("/vendedores",      cors(), controller.createVendedor);  // Create

router.get    ("/ventas",      cors(), controller.readVentas);   // Read All
router.get    ("/ventas/:id",  cors(), controller.readVenta);    // Read
router.post   ("/ventas",      cors(), controller.createVenta);  // Create

module.exports = router;
