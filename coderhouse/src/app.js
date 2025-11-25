const express = require('express');
const productsRouter = require('./routes/products.router');
const cartsRouter = require('./routes/carts.router');

const app = express();
const PORT = 8080;

// Middleware para entender JSON y datos por URL
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Definimos las rutas base
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Ruta de prueba para ver si el servidor funciona
app.get('/', (req, res) => {
    res.send('¡Servidor funcionando correctamente!');
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});