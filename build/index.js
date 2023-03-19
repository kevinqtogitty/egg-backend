"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const express_1 = __importStar(require("express"));
const csv_parser_1 = __importDefault(require("csv-parser"));
const cheerio_1 = __importDefault(require("cheerio"));
const axios_1 = __importDefault(require("axios"));
const cors_1 = __importDefault(require("cors"));
const fs_1 = __importDefault(require("fs"));
const app = express_1.default();
app.use(cors_1.default());
app.use(express_1.json());
const url = 'https://www.globalproductprices.com/rankings/egg_prices/';
app.get('/', (req, res) => {
    res.json({ message: 'Please Like the Video!' });
});
app.get('/csv', (req, res) => {
    const result = [];
    fs_1.default.createReadStream('./public/docs/eggs.csv')
        .pipe(csv_parser_1.default())
        .on('data', (data) => {
        result.push({
            date: data.DATE,
            price: Number(data.APU0000708111).toFixed(2)
        });
    })
        .on('end', () => {
        res.json(result);
    });
});
app.get('/eggs', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { data } = yield axios_1.default.get(url);
        const $ = cheerio_1.default.load(data);
        const countries = [];
        $('tr', data).each((_, item) => {
            const country = $(item).find('a').text();
            const price = Number($(item).find('td:nth-child(2)').text().slice(0, 4));
            if (country)
                countries.push({ country: country, price: price });
        });
        res.json(countries);
    }
    catch (error) {
        console.log(error);
    }
}));
app.listen('3001', () => {
    console.log('Server Running!');
});
