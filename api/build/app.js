"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// lib/app.ts
var express_1 = __importDefault(require("express"));
function getEachPagesDetails(products) {
    console.log(products);
    // products.forEach((product: any) => {
    //   requestPromise(product.url)
    //     .then(function (html: any) {
    //       //success!
    //       console.log(html);
    //     })
    //     .catch(function (error: any) {
    //       console.log(error);
    //     });
    // });
}
// Create a new express application instance
var app = express_1.default();
app.post('/get-products', function (req, res) {
    res.send(req.body);
});
app.listen(5000, function () {
    console.log('Example app listening on port 5000!');
});
