import {CrawlerInterface} from './CrawlerInterface';
import cheerio from 'cheerio';
import {Product} from '../Model/Product';
import {Logger} from '../Logger';
import axios from 'axios';

export class NvidiaDe implements CrawlerInterface {
  private products: Product[] = [
    {
      name: 'nVidia GeForce RTX 3080 FE',
      url: 'https://www.nvidia.com/de-de/geforce/graphics-cards/30-series/rtx-3080/',
      retailer: 'nVidia Shop DE'
    },
    {
      name: 'nVidia GeForce RTX 3080 FE',
      url: 'https://www.nvidia.com/en-us/geforce/graphics-cards/30-series/rtx-3080/',
      retailer: 'nVidia Shop US'
    },
  ];

  async acquireStock(logger: Logger) {
    const products: Product[] = [];
    for await (const product of this.products) {
      try {
        const response = await axios.get(product.url);
        if (response.status !== 200) {
          continue;
        }
        const $          = cheerio.load(response.data);
        product.stock    = $('.oos-btn').first().text().trim();
        logger.debug(`Acquired stock from ${product.retailer}`, product);
        products.push(product);
      } catch (e) {
        logger.error(e.message, { url: product.url });
      }
    }
    return products;
  }
}
