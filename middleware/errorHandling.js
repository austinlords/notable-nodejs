// error handling for async/await
function asyncWrap(fn) {
  return function(req, res, next) {
    return fn(req, res, next).catch(next);
  };
}

function catchErrors(err, req, res, next) {
  console.log(err);
  if (err) return res.json({ message: err.message });
}

module.exports = { asyncWrap, catchErrors };
