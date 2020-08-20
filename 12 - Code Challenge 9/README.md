# Code Challenge

Code Challenge

## Instructions

1. Use Router.param to DRY this ``appleRouter``. Attach the apple ``variety`` to the request body if it exists, send a 404 response if it does not. In each individual route, send the appropriate property from that apple object.

> Hint
```javascript
appleRouter.param('variety', (req, res, next, variety) => {
  if (!apples[variety]) {
    res.status(404).send();
  } else {
    req.variety = apples[variety];
    next();
  }
});

appleRouter.get('/:variety/description', (req, res, next) => {
  res.send(req.variety.description);
});

appleRouter.get('/:variety/price-range', (req, res, next) => {
  res.send(req.variety.priceRange);
});

appleRouter.get('/:variety/color', (req, res, next) => {
  res.send(req.variety.color);
});
```