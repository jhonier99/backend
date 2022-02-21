const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 3050;
const app = express();
const cors = require('cors');
app.use(cors());
app.use(bodyParser.json());

//conexión de Mysql
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'login'
});

//rutas
app.get('/', (req, res) => {
    res.send('funciona');
});

//listar usuarios 
app.get('/usuarios', (req, res) => {
    const sql = 'SELECT * FROM usuarios';
    connection.query(sql, (error, results) => {
        if (error) throw error;
        if (results.length > 0) {
            res.json(results);
        } else {
            res.send('No se encontraron resultados');
        }
    });
});
//Añadir usuarios más validación para no repetir usuarios
app.post("/add", (req, res) => {
    const sql = "INSERT INTO usuarios SET ?";
    const customerObj = {
        Nombre: req.body.Nombre,
        Usuario: req.body.Usuario,
        Contrasena: req.body.Contrasena,
    };
    try {
        if (
            customerObj.Nombre == "" ||
            customerObj.Usuario == "" ||
            customerObj.Contrasena == ""
        ) {
            res.send();
        } else {
            connection.query(sql, customerObj, (error) => {
                if (error) {
                    res.send(false);
                } else {
                    res.send(true);
                }
            });
        }
    } catch (error) {
        res.send(error);
    }
});

//login

app.post('/login', (req, res) => {
    const { Usuario, Contrasena } = req.body;

    const sql = `SELECT * FROM usuarios WHERE Usuario = '${Usuario}' AND Contrasena = '${Contrasena}'`;
    connection.query(sql, (error, result) => {
        if (result.length > 0) {
            res.send(true);
        } else {
            res.send(false);
        }

    });


});


//chek base de datos
connection.connect(error => {
    if (error) throw error;
    console.log('La base de datos está funcionando correctamente');
});

app.listen(PORT, () => console.log(`El servidor está corriendo en el puerto: ${PORT}`));