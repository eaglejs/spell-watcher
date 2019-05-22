// lib/app.ts
import express from 'express';
import axios from 'axios';
import cors from 'cors';
import bodyParser from 'body-parser';


import Product from './models/product';
import ProductResults from './models/product-results';
import { reject } from 'bluebird';

const parse = require('node-html-parser');

function getPagesDetails(product: Product): Promise<any> {
  let productResults: ProductResults = {
    available: false,
    imgUrl: '',
    price: '',
    size: '',
    title: '',
    url: ''
  };
  let promise = new Promise(resolve => {
    axios.get(product.url)
      .then(function (html: any) {
        const document = parse.parse(html.data);
        const title = document.querySelector('h2').innerHTML;
        const sizes = document.querySelectorAll('.size-swatches label');
        const price = document.querySelector('#product-form .price .money').innerHTML;
        const imgUrl = document.querySelector('#main-product-image').attributes.style;

        productResults.price = price;
        productResults.title = title;
        productResults.imgUrl = imgUrl;
        productResults.url = product.url;

        for (let i = 0; i < sizes.length ; i++ ) {
          if (sizes[i].text === product.size) {
            productResults.size = product.size;
            productResults.available = sizes[i].attributes.class === 'not-available' ? false : true;
            break;
          } else {
            productResults.size = 'N/A';
            productResults.available = false;
          }
        }

        resolve(productResults);
      })
      .catch(function (error: any) {
        console.log(error);
        reject(error);
      });
  });

  return promise;
}

// Create a new express application instance
const app: express.Application = express();

app.use(cors());
app.use(bodyParser.json()); // support json encoded bodies

app.post('/get-product', function (req, res) {
  getPagesDetails(req.body).then((productResults: ProductResults) => {
    res.send(productResults);
  }).catch(error => {
    res.status(500).send(error);
  });
});

app.listen(5000, function () {
  console.log('Example app listening on port 5000!');
});