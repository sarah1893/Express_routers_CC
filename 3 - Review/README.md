# Review

``router.param`` is a powerful tool that we can use to keep our code from repeating core functionality through routes. This is a pattern we want to frequently follow: identify multiple pieces of code that accomplish the same goal, put it into a single component, let that component do that thing (and update it when we want the thing it does to change — in a single place).

Let’s try applying that knowledge again, to another codebase. If you look at the workspace you’ll find the same problem of data-lookup happening, based on a URL parameter, multiple times in different places. Try combining that logic in a single place using ``router.param``.

## Instructions

1. Refactor the current application to use an ``app.param`` to handle all routes with ``snackId``. It should set the ``req.snackIndex`` if it exists and send the proper 404 response if not. Make sure to fix all routes to use the ``req.snackIndex`` and remove duplicate code.

> Hint
Review the previous exercise if you want to remember the steps to refactor a route to use ``app.param``.