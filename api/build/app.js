"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// lib/app.ts
var express_1 = __importDefault(require("express"));
var axios_1 = __importDefault(require("axios"));
var cheerio_1 = __importDefault(require("cheerio"));
var cors_1 = __importDefault(require("cors"));
var body_parser_1 = __importDefault(require("body-parser"));
function getPagesDetails(product) {
    console.log(product);
    axios_1.default.get(product.url)
        .then(function (html) {
        var $ = cheerio_1.default.load(html.data);
        console.log($('form[action="/cart/add"] label'));
    })
        .catch(function (error) {
        console.log(error);
    });
}
// Create a new express application instance
var app = express_1.default();
app.use(cors_1.default());
app.use(body_parser_1.default.json()); // support json encoded bodies
app.post('/get-product', function (req, res) {
    getPagesDetails(req.body);
    res.send({
        "test": "test"
    });
});
app.listen(5000, function () {
    console.log('Example app listening on port 5000!');
});
//# sourceMappingURL=app.js.map