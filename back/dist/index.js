"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); //  Разрешить запросы с любого origin (для разработки)
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
const pg_1 = require("pg");
require('dotenv').config();
const pool = new pg_1.Pool({
    connectionString: process.env.DATABASE_URL //  Подключение к базе данных Heroku
    // ssl: {
    //   rejectUnauthorized: false //  Важно для Heroku Postgres
    // } 
});
app.use(express_1.default.static('public')); // Для обслуживания статических файлов (HTML, CSS, JS)
// ############################ Section of API ###############################
app.get('/', (req, res) => {
    res.sendStatus(201);
});
app.get('/products', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const db = yield pool.query('SELECT * FROM products');
        res.json(db.rows);
    }
    catch (err) {
        console.error("Ошибка при получении товаров:", err);
        res.status(500).send("Ошибка сервера");
    }
}));
app.get('/products/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const db = (yield pool.query('SELECT * FROM products')).rows;
        const findGood = db.find(g => g.id === +req.params.id);
        if (!findGood) {
            res.sendStatus(404);
            return;
        }
        res.json(findGood);
    }
    catch (err) {
        console.error("Ошибка при получении товаров:", err);
        res.status(500).send("Ошибка сервера");
    }
}));
// ######################### End of API Section ############################
app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}`);
});
