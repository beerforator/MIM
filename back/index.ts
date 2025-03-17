import express from 'express'
const app = express()
const path = require('path')
const port = process.env.PORT || 3000;

app.use((req, res, next) => {
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



// ############################ Section of API ###############################

app.get('/', (req, res) => {
    res.sendStatus(201)
})

app.get('/products', async (req, res) => {
    try {
        const db = await pool.query('SELECT * FROM products') 
        res.json(db.rows)

        // const filePath = path.join(__dirname, '../../front/home.html') //  __dirname - текущая директория
        // res.sendFile(filePath)
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



const publicDirectoryPath = path.join(__dirname, '../../front');

app.use(express.static(publicDirectoryPath));
// app.use(express.static('public')) // Для обслуживания статических файлов (HTML, CSS, JS)

app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}`)
})