const sinon = require('sinon');
const chai = require('chai');
const dirtyChai = require('dirty-chai');
const chaiAsPromised = require('chai-as-promised');
const sinonChai = require('sinon-chai');

const kmonads = require('../lib/kmonads');

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
    it('expect to output an Array, for anything passed to.', () => {
      expect(typeof kmonads.unit(undefined)).to.be.equal(typeof []);
      expect(typeof kmonads.unit([])).to.be.equal(typeof []);
      expect(typeof kmonads.unit('')).to.be.equal(typeof []);
      expect(typeof kmonads.unit(6)).to.be.equal(typeof []);
      expect(typeof kmonads.unit(null)).to.be.equal(typeof []);
    });
  });
});
