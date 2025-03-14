import express from 'express'
const app = express()
const port = process.env.PORT || 3000;

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*") //  Разрешить запросы с любого origin (для разработки)
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    next();
})

import { Pool } from 'pg'

require('dotenv').config()

const pool = new Pool({
    connectionString: process.env.DATABASE_URL //  Подключение к базе данных Heroku
    // ssl: {
    //   rejectUnauthorized: false //  Важно для Heroku Postgres
    // } 
})

app.use(express.static('public')) // Для обслуживания статических файлов (HTML, CSS, JS)

// ############################ Section of API ###############################

app.get('/', (req, res) => {
    res.sendStatus(201)
})

app.get('/products', async (req, res) => {
    try {
        const db = await pool.query('SELECT * FROM products') 
        res.json(db.rows)
    } catch (err) {
        console.error("Ошибка при получении товаров:", err)
        res.status(500).send("Ошибка сервера")
    }
})

app.get('/products/:id', async (req, res) => {
    try {
        const db = (await pool.query('SELECT * FROM products')).rows
        const findGood = db.find(g => g.id === +req.params.id)

        if(!findGood){
            res.sendStatus(404)
            return
        }

        res.json(findGood)
    } catch (err) {
        console.error("Ошибка при получении товаров:", err)
        res.status(500).send("Ошибка сервера")
    }
})


// ######################### End of API Section ############################

app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}`)
})