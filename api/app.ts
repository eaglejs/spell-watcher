// lib/app.ts
import express from 'express';
import axios from 'axios';
import cors from 'cors';
import bodyParser from 'body-parser';
import nodemailer from 'nodemailer';

import Product from './models/product';
import ProductResults from './models/product-results';
import { reject } from 'bluebird';

const parse = require('node-html-parser');
const config = require('./config.json');

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

        for (let i = 0; i < sizes.length; i++) {
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

function sendEmailNotification(product: Product, productResults: ProductResults): void {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: config
  });

  const mailOptions = {
    from: 'spell.watcher.app@gmail.com',
    to: product.email,
    subject: `${productResults.title} (${product.size}) NOW AVAILABLE!`,
    text: `${productResults.title} in the size of (${product.size}) is now Available for ${productResults.price}`
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

// Create a new express application instance
const app: express.Application = express();

app.use(cors());
app.use(bodyParser.json()); // support json encoded bodies

app.post('/get-product', function (req, res) {
  getPagesDetails(req.body).then((productResults: ProductResults) => {
    if (productResults.available) {
      sendEmailNotification(req.body, productResults);
    }
    res.send(productResults);
  }).catch(error => {
    res.status(500).send(error);
  });
});

app.listen(5000, function () {
  console.log('Example app listening on port 5000!');
});