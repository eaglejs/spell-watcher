// lib/app.ts
import express from 'express';
import requestPromise from 'request-promise';
import Products from './models/products';
import Product from './models/product';


function getEachPagesDetails(products: Products): void {
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
const app: express.Application = express();

app.post('/get-products', function (req, res) {
  res.send(req.body);
});

app.listen(5000, function () {
  console.log('Example app listening on port 5000!');
});