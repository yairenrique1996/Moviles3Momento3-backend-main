const { Vendedor, Venta } = require("./models.js");

// ------- VENDEDORES
exports.readVendedores = (req, res) =>
    Vendedor.find({}, (err, data) => {
        if (err) res.json({ error: err });
        else     res.json(data);
    });

exports.readVendedor = (req, res) =>
    Vendedor.findOne({ identificacion: req.params.id }, (err, data) => {
        if (err) res.json({ error: err });
        else     res.json(data);
    });

exports.deleteVendedor = (req, res) =>
    Vendedor.findOneAndRemove({ _id: req.params.id }, (err, data) => {
        if (err) res.json({ error: err });
        else     res.json(data);
    });

exports.createVendedor = async (req, res) => {
    const { identificacion, nombre, email } = req.body

    // validar que la identificacion solo deben ser numerica
    if ( !/^\d+$/.test(identificacion) ) {
        res.status(400).json({ error: 'error identificacion' });
        return
    }

    // validar que el nombre solo deben ser letras y espacios
    if ( !/^[A-Za-zÁÉÍÓÚáéíóúñÑ ]+$/g.test(nombre) ) {
        res.status(400).json({ error: 'error nombre' });
        return
    }

    // validar que el email debe ser valido
    if ( !/^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/.test(email) ) {
        res.status(400).json({ error: 'error email' });
        return
    }

    const vendedor = await Vendedor.findOne({ identificacion });
    if (vendedor) {
        res.status(400).json({ error: `Vendedor con la identificacion ${identificacion}, ya existe.` })
        return
    }

    new Vendedor({ identificacion, nombre, email })
        .save((err, data) => {
            if (err) res.status(400).json({ error: err });
            else     res.json(data);
        });
}

exports.updateVendedor = async (req, res) => {
    const id = req.params.id
    const { identificacion, nombre, email } = req.body

    // validar que la identificacion solo deben ser numerica
    if ( !/^\d+$/.test(identificacion) ) {
        res.status(400).json({ error: 'error identificacion' });
        return
    }

    // validar que el nombre solo deben ser letras y espacios
    if ( !/^[a-zA-Z\s]*$/.test(nombre) ) {
        res.status(400).json({ error: 'error nombre' });
        return
    }

    // validar que el email debe ser valido
    if ( !/^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/.test(email) ) {
        res.status(400).json({ error: 'error email' });
        return
    }

    const vendedor = await Vendedor.findOne({ identificacion });
    if (vendedor && !vendedor._id.equals(id)) {
        res.status(400).json({ error: `Vendedor con la identificacion ${identificacion}, ya existe.` })
        return
    }

    Vendedor.findOneAndUpdate(
        { _id: id },
        { $set: { identificacion, nombre, email } }, 
        (err, data) => {
            if (err) res.status(400).json({ error: err });
            else     res.json(data);
        }
    );
}

// Ventas

exports.readVentas = (req, res) => 
    Venta.find({}, (err, data) => {
        if (err) res.json({ error: err });
        else     res.json(data);
    });

exports.readVenta = (req, res) => 
Venta.findOne({ _id: req.params.id }, (err, data) => {
        if (err) res.json({ error: err });
        else     res.json(data);
    });

exports.createVenta = async (req, res) => {
    const { identificacion, zona, valorventa } = req.body
    try {
        const vendedor = await Vendedor.findOne({ identificacion });

        if (!vendedor) {
            res.status(400).json({ error: `Vendedor con identificacion: ${identificacion} no existe!.` })
            return
        }

        if ( zona !== 'sur' && zona !== 'norte') {
            res.status(400).json({ error: `Zona incorrecta: ${zona}` })
            return
        }

        if ( valorventa < 2000000) {
            res.status(400).json({ error: `Valor de la venta debe ser mayor a $2.000.000: ${valorventa}` })
            return
        }

        let totalcomision = vendedor.totalcomision || 0
        totalcomision += zona === 'sur' ? valorventa * 0.03 : valorventa * 0.02;

        Vendedor.findOneAndUpdate(
            { _id: vendedor._id },
            { $set: { totalcomision } }, 
            (err, data) => {
                if (err) res.status(400).json({ error: err });
            }
        );

        new Venta({ identificacion, zona, valorventa, fecha: new Date() })
            .save((err, data) => {
                if (err) res.status(400).json({ error: err });
                else     res.json(data);
            });

    } catch (error) {
        res.status(400).json({ error, ok: 'ok' })
    }
}
