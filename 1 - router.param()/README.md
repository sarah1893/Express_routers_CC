# router.param()

Express, luckily, is mindful of the pain-point of replicated parameter-matching code and has a method specifically for this issue. When a specific parameter is present in a route, we can write a function that will perform the necessary lookup and attach it to the ``req`` object in subsequent middleware that is run.

```javascript
app.param('spellId', (req, res, next, id) => {
  let spellId = Number(id);
    try {
      const found = SpellBook.find((spell) => {
        return spellId === spell.id;
      })
      if (found) {
        req.spell = found;
        next();
      } else {
        next(new Error('Your magic spell was not found in any of our tomes'));
      };
    } catch (err) {
      next(err)
    }
});
```

In the code above we intercept any request to a route handler with the ``:spellId`` parameter. Note that in the ``app.param`` function signature, ``'spellId'`` does not have the leading ``:``. The actual ID will be passed in as the fourth argument, ``id`` in this case, to the ``app.param`` callback function when a request arrives.

We look up the spell in our ``SpellBook`` array using the ``.find()`` method. If ``SpellBook`` does not exist, or some other error is thrown in this process, we pass the error to the following middleware (hopefully we’ve written some error-handling middleware, or included some externally-sourced error-handling middleware). If the ``spell`` exists in SpellBook, the ``.find()`` method will store the spell in ``found``, and we attach it as a property of the request object (so future routes can reference it via ``req.spell``). If the requested ``spell`` does not exist, ``.find()`` will store ``undefined`` in ``found``, and we let future middlewares know there was an error with the request by creating a new ``Error`` object and passing it to ``next()``.

Note that inside an ``app.param`` callback, you should use the fourth argument as the parameter’s value, not a key from the ``req.params`` object.

## Instructions

1. Let’s refactor this code to use ``app.param`` for all ``/spices/:spiceId`` routes.

First, start your code with a call to ``app.param``. Write functionality that will look for the ``spiceIndex`` and attach it to the ``req`` object as ``req.spiceIndex`` if it exists. Call ``next`` after that. If it does not exist, send a ``404`` error response and do not call ``next``.

2. Now, refactor your current code to get rid of any index-checking logic in ``/spices/:spiceId`` routes. Use ``req.spiceIndex`` to do any necessary operations on the ``spiceRack`` object. You should also get rid of anything that would send an error response, as non-existent ids will already have been handled by ``router.param``.