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


  describe('#unit', () => {
    it('expect to output an triplet, for anything passed to.', () => {
      expect(kmonads.unit(undefined)).to.be.deep.equal([[undefined], ['Unit'], []]);
      expect(kmonads.unit([])).to.be.deep.equal([[[]], ['Unit'], []]);
      expect(kmonads.unit('')).to.be.deep.equal([[''], ['Unit'], []]);
      expect(kmonads.unit(6)).to.be.deep.equal([[6], ['Unit'], []]);
      expect(kmonads.unit(null)).to.be.deep.equal([[null], ['Unit'], []]);
    });
  });

  describe('#compose', () => {
    it('expect to take two function as parameter and "compose" them.', () => {
      const f = sandbox.stub().callsFake(x => [[5 + x], ['F'], ['F error']]);
      const g = sandbox.stub().callsFake(x => [[7 + x], ['G'], ['G error']]);
      const out = kmonads.compose(f, g)([[1], ['start'], ['init error']]);
      expect(out).to.deep.equal([
        [1, 8, 13],
        ['start', 'G', 'F'],
        ['init error', 'G error', 'F error'],
      ]);
    });
  });
});
