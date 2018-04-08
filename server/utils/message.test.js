const expect = require('expect');
const {generateMessage} = require('./message');

describe('generateMessage', () => {
  it('shoud be generate Message', () => {
    var from = 'barkin'
    var text = 'hello world'
    // test function
    var message = generateMessage(from,text)

    expect(typeof message.createdAt).toBe('number');
    expect(message).toInclude({from,text});

  })
})
