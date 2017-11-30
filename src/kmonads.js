const VALUE = 0;
const DEBUG = 1;
const ERROR = 2;

/**
 * Return the real type of something
 *
 * @param {any} x - anything to analyse
 *
 * @return {string} the type name
 */
function typeOf(x) {
  return /^\[object (.+)\]$/
    .exec(Object.prototype.toString.apply(x))[1];
}

/**
 * Wraps a value in the type accepted by the composable functions.
 *
 * @param {Any}    x    - anything
 *
 * @return {Array} a triplet
 */
function unit(x) { return [[x], [''], [undefined]]; }

/**
 * compose two function.
 *
 * @param {Function} f - first function to compose
 * @param {Function} g - second function to compose
 *
 * @return {Array} a triplet
 */
function compose(f, g) { return x => f(g(x)); }

/**
 * Transforms any function so that accepts the same type as it returns.
 *
 * @param {function} f - to convert
 *
 * @return {function} the triplet outputed
 */
function bind(f) {
  return function binded([x, s, t]) {
    const [y, u, v] = f(x[x.length - 1]);
    return [x.concat(y), s.concat(u), t.concat(v)];
  };
}

/**
 * Convert a simple function into a composable debugging one.
 *
 * @param {Function} f    - to convert
 * @param {string}   name - The name
 *
 * @return {Array} the triplet outputed
 */
function lift(f, name) {
  return (x) => {
    const out = [[undefined], [name], [undefined]];
    try {
      out[VALUE] = [f(x)];
      if (typeOf(out[VALUE][0]) === 'Number') {
        if (Number.isNaN(out[VALUE][0])) {
          out[VALUE][0] = undefined;
          out[ERROR][0] = new Error('Is not a number');
        }
        if (out[VALUE][0] === Infinity) {
          out[VALUE][0] = undefined;
          out[ERROR][0] = new Error('Is Infinity');
        }
      }
    } catch (err) {
      out[ERROR] = [err];
    }
    return out;
  };
}

function pipe(x, functions) {
  let w = x;
  for (let i = 0, len = functions.length; i < len; i++) {
    w = bind(functions[i])(w);
  }
  return w;
}

module.exports = {
  CONSTS: {
    VALUE,
    DEBUG,
    ERROR,
  },
  typeOf,
  unit,
  compose,
  bind,
  lift,
  pipe,
};
