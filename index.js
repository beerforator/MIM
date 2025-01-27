const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); //  Разрешить запросы с любого origin (для разработки)
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL //  Подключение к базе данных Heroku
    // ssl: {
    //   rejectUnauthorized: false //  Важно для Heroku Postgres
    // }
});

app.use(express.static('public')); // Для обслуживания статических файлов (HTML, CSS, JS)

app.get('/products', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM products');
        res.json(result.rows);
    } catch (err) {
        console.error("Ошибка при получении товаров:", err);
        res.status(500).send("Ошибка сервера");
    }
});

app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}`);
});