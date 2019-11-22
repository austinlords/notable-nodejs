// error handling for async/await
function asyncWrap(fn) {
  return function(req, res, next) {
    return fn(req, res, next).catch();
  };
}

module.exports = { asyncWrap };
