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

// app.post('/add', (req, res) => {
//     const Usuario = req.body.Usuario
//     const sql2 = `SELECT * FRPM usuarios WHERE Uusario = '${Usuario}'`;
//     connection.query(sql2, (error, result) => {
//         if (result.length > 0) {
//             const sql = 'INSERT INTO usuarios SET ?';
//             const usuariosObj = {
//                 Nombre: req.body.Nombre,
//                 Usuario: req.body.Usuario,
//                 Contrasena: req.body.Contrasena
//             }
//             connection.query(sql, usuariosObj, (error) => {
//                 if (!error) {
//                     res.send(true);
//                 } else {
//                     res.send(false)
//                 }
//             });
//         } else {
//             res.send();
//         }

//     });

//     //res.send('Crear nuevo usuario');
// });
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

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));