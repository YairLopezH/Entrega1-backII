import { Router } from 'express';
import Product from '../models/product.model.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    let { limit = 10, page = 1, sort, query } = req.query;

    limit = parseInt(limit);
    page = parseInt(page);

    if (isNaN(limit) || limit <= 0) limit = 10;
    if (isNaN(page) || page <= 0) page = 1;

    const filter = {};

    if (query) {
      if (query.toLowerCase() === 'disponible') {
        filter.status = true;
      } else {
        filter.category = query;
      }
    }

    const options = {
      page,
      limit,
      lean: true,
    };

    if (sort === 'asc') {
      options.sort = { price: 1 };
    } else if (sort === 'desc') {
      options.sort = { price: -1 };
    }

    const result = await Product.paginate(filter, options);

    
    const baseUrl = `/api/products?limit=${limit}${sort ? `&sort=${sort}` : ''}${query ? `&query=${query}` : ''}`;
    const prevLink = result.hasPrevPage ? `${baseUrl}&page=${result.prevPage}` : null;
    const nextLink = result.hasNextPage ? `${baseUrl}&page=${result.nextPage}` : null;

    res.json({
      status: 'success',
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink,
      nextLink,
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

export default router;
