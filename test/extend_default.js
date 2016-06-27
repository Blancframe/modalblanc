var should = require('chai').should(),
    extendDefault = require('../lib/extend_default');

describe('#extend_default', function() {
    var extend = extendDefault,
        defaults = {
            animation: 'fade-in-out',
            closeButton: true,
            content: '',
            slider: null,
            sideTwo: {
                content: null,
                animation: null,
                button: null,
                buttonBack: null
            },
        },
        options = extend(defaults, arguments[0]);

    it('verified that defaults is same object as options', function() {
        var extD = defaults === options;
        extD.should.equal(true);
    });
});