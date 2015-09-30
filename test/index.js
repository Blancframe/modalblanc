var should = require('chai').should(),
    modalBlanc = require('../index');

describe('#equals', function() {
    var modal = new modalBlanc({
            content: '<p>Jhon</p>'
        });

    it('verfied if animation property is fade-in-out', function() {
        var animation = modal.options.animation;

        animation.should.equal('fade-in-out')
    });

    it('verified that there is a close button', function() {
        var button = modal.options.closeButton;

        button.should.equal(true);
    });
});