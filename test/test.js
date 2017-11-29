const sinon = require('sinon');
const chai = require('chai');
const dirtyChai = require('dirty-chai');
const chaiAsPromised = require('chai-as-promised');
const sinonChai = require('sinon-chai');

const kmonads = require('../src/kmonads');

chai.use(dirtyChai);
chai.use(chaiAsPromised);
chai.use(sinonChai);

const { expect } = chai;
const sandbox = sinon.sandbox.create();

describe('kmonads', () => {
  beforeEach(() => {
    sandbox.spy(Array.prototype, 'indexOf');
  });

  afterEach(() => sandbox.restore());

  describe('#unit wraps a value in the type accepted by the composable functions (triplet)', () => {
    it('is expected to process any type of value', () => {
      expect(kmonads.unit(undefined)).to.be.deep.equal([[undefined], [''], [undefined]]);
      expect(kmonads.unit([])).to.be.deep.equal([[[]], [''], [undefined]]);
      expect(kmonads.unit('')).to.be.deep.equal([[''], [''], [undefined]]);
      expect(kmonads.unit(6)).to.be.deep.equal([[6], [''], [undefined]]);
      expect(kmonads.unit(null)).to.be.deep.equal([[null], [''], [undefined]]);
    });
  });

  describe('#compose take two function as parameter and "compose" them', () => {
    it('is expected to call consecutively the two functions', () => {
      const f = sandbox.stub().callsFake(x => x + x);
      const g = sandbox.stub().callsFake(x => x ** x);
      const out1 = kmonads.compose(f, g)(2);
      const out2 = kmonads.compose(g, f)(2);
      expect(out1).to.equal(8);
      expect(out2).to.equal(256);
      expect(out1).to.not.equal(out2);
    });
  });

  describe('#bind transforms any function so that accepts the same type as it returns (triplet)', () => {
    it('is expected to process a triplet', () => {
      const f = sandbox.stub().callsFake(x => [x ** x, '']);

      const out = kmonads.bind(f)(kmonads.unit(2));
      expect(out).to.deep.equal([[2, 4], ['', ''], [undefined, undefined]]);
    });
  });

  describe('#lift convert a simple function into a composable debugging one', () => {
    it('is expected to attribute the good name in the debug queue', () => {
      const f = sandbox.stub().callsFake(x => x ** x);
      expect(kmonads.lift(f, 'power')(2)).to.deep.equal([[4], ['power'], [undefined]]);
    });
    it('catch the errors and inject them in the error queue', () => {
      const unrecoverableError = new Error('Armaggedon');
      const f = sandbox.stub().throws(() => unrecoverableError);
      const out = kmonads.lift(f, 'crash')(0);
      expect(out).to.deep.equal([[undefined], ['crash'], [unrecoverableError]]);
    });
  });

  describe('Some meaningful exemples', () => {
    it('is expected to allow to show you some nice composition', () => {
      const {
        lift, bind, unit, pipe, compose,
      } = kmonads;

      const sine = lift(Math.sin, 'sine');
      const cube = lift(x => x ** 3, 'cube');

      const cubeSineOutput = [
        [3, 27, 0.956375928404503],
        ['', 'cube', 'sine'],
        [undefined, undefined, undefined],
      ];

      expect(bind(sine)(bind(cube)(unit(3)))).to.be.deep.equal(cubeSineOutput);

      const cubeSined = compose(bind(sine), bind(cube));
      expect(cubeSined(unit(3))).to.be.deep.equal(cubeSineOutput);

      expect(pipe(unit(3), [cube, sine])).to.be.deep.equal(cubeSineOutput);

      const z = pipe(unit(7), [
        lift(x => x + 1, 'inc.'),
        lift(x => 2 * x, 'double.'),
        lift(x => x - 1, 'dec.'),
      ]);

      expect(z).to.be.deep.equal([[7, 8, 16, 15],
        ['', 'inc.', 'double.', 'dec.'],
        [undefined, undefined, undefined, undefined]]);
    });
  });
});
