// lib/app.ts
import express from 'express';
import axios from 'axios';
import cors from 'cors';
import bodyParser from 'body-parser';
import nodemailer from 'nodemailer';

import Product from './models/product';
import ProductResults from './models/product-results';
import config from './config.json';

const parse = require('node-html-parser');

async function getPagesDetails(product: Product) {
  let html;
  let productResults: ProductResults = {
    available: false,
    imgUrl: '',
    price: '',
    size: '',
    title: '',
    url: ''
  };
  let document;
  let title;
  let sizes;
  let price;
  let imgUrl;

  try {
    html = await axios.get(product.url);
  } catch(error) {
    return error;
  };


  try {
    document = parse.parse(html.data);
  } catch (error) {
    throw error;
  }

  try {
    title = document.querySelector('h2');
    title = title ? title.innerHTML : '';
  } catch (error) {
    throw error;
  }

  try {
    sizes = document.querySelectorAll('.size-swatches label') || '';
  } catch (error) {
    throw error;
  }

  try {
    price = document.querySelector('#product-form .price .money');
    price = price ? price.innerHTML : 'Sold Out';
  } catch (error) {
    throw error;
  }

  try {
    imgUrl = document.querySelector('#main-product-image');
    imgUrl = imgUrl ? imgUrl.attributes.style : '';
  } catch (error) {
    throw error;
  }

  productResults.price = price;
  productResults.title = title;
  productResults.imgUrl = imgUrl;
  productResults.url = product.url;

  for (let i = 0; i < sizes.length; i++) {
    if (sizes[i].text === product.size) {
      productResults.size = product.size;
      productResults.available = sizes[i].attributes.class === 'not-available' ? false : true;
      // productResults.available = true; used to test a successful result
      break;
    } else {
      productResults.size = 'N/A';
      productResults.available = false;
      // productResults.available = true; used to test a successful result
    }
  }

  return productResults;

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

app.post('/get-product', async function (req, res) {
  const productResults = await getPagesDetails(req.body)

  if (productResults['message']) {
    res.status(productResults.response.status).send();
    return;
  }

  if (productResults.available) {
    sendEmailNotification(req.body, productResults);
  }

  if (productResults.size === 'N/A') {
    res.status(500).send({message: 'This size is not available. :('})
  }

  res.send(productResults);

});

app.listen(5000, function () {
  console.log('Example app listening on port 5000!');
});