'use strict';
/* jshint node: true */

var ExtendDefault = require('./extend_default');
var StringAsNode = require('./string_as_node');

var ImageSlider = function() {
    if (!(this instanceof ImageSlider)) {
        return new ImageSlider();
    }

    var defaults = {
        selector: '.slides',
        transition: 'fade-slide',
        autoPlay: false
    };

    if (arguments[0] && typeof arguments[0] === 'object') {
        this.options = ExtendDefault(defaults, arguments[0]);
    }

    this._init();
};

ImageSlider.prototype._init = function() {
    this.createSlides();
};

ImageSlider.prototype.createSlides = function() {
    this.slides = [];

    var slides = document.querySelectorAll(this.options.selector + ' img'),
        parentEl = document.querySelector(this.options.parent),
        container = document.createElement('div'),
        slideImg,
        sliderElm,
        imgElm;

    container.className = 'image-slider-holder';

    for (var i = 0; i < slides.length; i++) {
        // hide al
        // slides[i].style.display = 'none';
        slideImg = slides[i].src;

        this.slides.push({
            index: i,
            el: slides[i],
            images: slideImg
        });

        sliderElm = document.createElement('div');
        sliderElm.className = 'image-slider';

        imgElm = document.createElement('img');
        imgElm.src = slideImg;

        sliderElm.appendChild(imgElm);
        container.appendChild(sliderElm);
        parentEl.appendChild(container);
    }
};

module.exports = ImageSlider;