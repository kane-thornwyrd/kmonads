/**
 * Return the real type of something
 *
 * @param      {any}  x       anything to analyse
 * @return     {string}  { description_of_the_return_value }
 */
function typeOf(x) { return /^\[object (.+)\]$/.exec(Object.prototype.toString.apply(x))[1]; }

/**
 * Convert a value to a triplet.
 *
 * @param      {Any}  x       anything
 * @return     {Array}  a triplet
 */
function unit(x) { return [[x], ['Unit'], []]; }

/**
 * compose two function.
 *
 * @param      {Function}  f       a function to compose
 * @param      {Function}  g       a function to compose
 * @return     {Array}    a triplet
 */
function compose(f, g) {
  return (w) => {
    let x = w[0];
    const [y, s, t] = g(x[x.length - 1]);
    x = x.concat(y);
    const [z, u, v] = f(x[x.length - 1]);
    x = x.concat(z);
    return [x, w[1].concat(s, u), w[2].concat(t, v)];
  };
}

/**
 * Allow triplets to be glued together.
 *
 * @param      {function}  f       { parameter_description }
 * @return     {function}  { description_of_the_return_value }
 */
function bind(f) {
  return (triplet) => {
    let output = [];
    for (let i = 0, n = triplet[0].length; i < n; i += 1) {
      output = output.concat(f(triplet[0][i]));
    }
    return output;
  };
}

/**
 * Convert a function into a triplet outputing one.
 *
 * @param      {Function}  f       the function to convert
 * @return     {Array}     a triplet
 */
function lift(f) {
  return (x) => {
    let out;
    try {
      out = f(x);
    } catch (err) {
      return [out, [], [err]];
    }
    return unit(out);
  };
}

module.exports = {
  typeOf,
  unit,
  compose,
  bind,
  lift,
};
