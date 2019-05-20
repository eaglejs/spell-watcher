// lib/app.ts
import express from 'express';
import axios from 'axios';
import cheerio from 'cheerio';
import cors from 'cors';
import { parse } from 'node-html-parser'
import bodyParser from 'body-parser';
import Product from './models/product';


function getPagesDetails(product: Product): void {
  console.log(product);
  axios.get(product.url)
    .then(function (html: any) {
      let $ = cheerio.load(html.data);

      console.log($('form[action="/cart/add"] label'));
    })
    .catch(function (error: any) {
      console.log(error);
    });
}


// Create a new express application instance
const app: express.Application = express();

app.use(cors());
app.use(bodyParser.json()); // support json encoded bodies

app.post('/get-product', function (req, res) {
  getPagesDetails(req.body);
  res.send({
    "test": "test"
  });
});

app.listen(5000, function () {
  console.log('Example app listening on port 5000!');
});