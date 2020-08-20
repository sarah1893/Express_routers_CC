# Code Challenge

Code Challenge

## Instructions

1. The current API has public data that should be accessible to anybody, and private data that should be only accessed by admin users. Currently, users can access any data, but the ``isAdmin`` middleware function should be able to help. Use this function in any route that accesses the ``secretData`` object.

> Hint
```javascript
app.use(['/:userId/phone-numbers', '/:userId/fav-sites'], isAdmin);

// Or:

app.get('/:userId/phone-numbers', isAdmin, (req, res, next) => {
  res.send(secretData.coolPhoneNumbers);
});

app.get('/:userId/fav-sites', isAdmin, (req, res, next) => {
  res.send(secretData.favSites);
});
```