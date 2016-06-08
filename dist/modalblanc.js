(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Modalblanc = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';
/* jshint node: true */

var ExtendDefault = require('./lib/extend_default');
var ImageSlider = require('./lib/image_slider');
var StringAsNode = require('./lib/string_as_node');


var Modalblanc = function () {
    if (!(this instanceof Modalblanc)) {
      return new Modalblanc();
    }

    this.closeButton = null;
    this.overlay = null;

    var defaults = {
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
      };

    this.settings = {};

    if (arguments[0] && typeof arguments[0] === 'object') {
        this.options = ExtendDefault(defaults, arguments[0]);
    }

};

Modalblanc.prototype.open = function() {
    if (this.settings.modalOpen) return;

    build.call(this);
    setEvents.call(this);
};

Modalblanc.prototype.close = function() {
    if (!this.settings.modalOpen) return;

    var overlay = document.getElementById('overlay-modal-blanc'),
        _this = this;

    overlay.classList.remove('is-active');
    overlay.classList.add('is-inactive');

    var transPrefix = transitionPrefix(overlay);

    overlay.addEventListener(transPrefix.end, function() {
        this.remove();
        _this.settings.modalOpen = false;
    }, false);
};

Modalblanc.prototype.sliderInit = function() {
    if (this.options.slider !== null) {
        this.settings.slider = true;
    }

    if (this.settings.slider) {
        this.open();
        var slider = new ImageSlider({
            selector: this.options.slider,
            parent: '#front-card'
        });
    }
};

Modalblanc.prototype._contentNext = function() {
    var card = document.getElementById('card'),
        customClass = this.options.sideTwo.animation;

    card.classList.remove(typeOfAnimation(customClass, 2));
    card.classList.add(typeOfAnimation(customClass));
};

Modalblanc.prototype._contentPrevious = function() {
    var card = document.getElementById('card'),
        customClass = this.options.sideTwo.animation;

    card.classList.remove(typeOfAnimation(customClass));
    card.classList.add(typeOfAnimation(customClass, 2));
};

Modalblanc.prototype.classEventListener = function(elm, callback) {
    var _this = this;

    for (var i = 0; i < elm.length; i++) {
        elm[i].addEventListener('click', function() {
            callback();
        });
    }
};

function typeOfAnimation(type, typeClass) {
    var animationTypes = {
            'slide': ['slide-next', 'slide-back'],
            'scale': ['scale-next', 'scale-back']
        },
        animationClass = animationTypes[type];

        if (type === undefined) {
            if (typeClass === 2) {
                return animationTypes.slide[1];
            } else {
                return animationTypes.slide[0];
            }
        } else if (typeClass === 2) {
            return animationClass[1];
        } else {
            return animationClass[0];
        }
}

function transitionPrefix(elm) {
    var transEndEventNames = {
        'WebkitTransition' : 'webkitTransitionEnd',
        'MozTransition'    : 'transitionend',
        'OTransition'      : 'oTransitionEnd otransitionend',
        'transition'       : 'transitionend'
    };

    for (var name in transEndEventNames) {
      if (elm.style[name] !== undefined) {
        return {
            end: transEndEventNames[name]
        };
      }
    }
}

function setEvents() {
    var nextButton = document.getElementById('modal-button-next'),
        prevButton = document.getElementById('modal-button-prev'),
        closed = document.getElementsByClassName('modal-fullscreen-close'),
        _this = this;

    this.classEventListener(closed, function() {
        _this.close();
    });

    if (this.options.sideTwo.content === null) return;

    nextButton.addEventListener('click', this._contentNext.bind(this));
    prevButton.addEventListener('click', this._contentPrevious.bind(this));
}

function build() {
    if (this.options.closeButton === true) {
        this.closeButton = '<span class="modal-fullscreen-close">X</span>';
    } else {
        this.closeButton = '';
    }

    var typeModal = this.settings.slider ? 'slider-modal' : 'big-modal',
        tmpl = '<div id="overlay-modal-blanc" class="modal-fullscreen-background' + ' ' +  this.options.animation + ' ' + 'is-active">' +
                    '<div id="modal-fullscreen-container"class="modal-fullscreen-container ' + typeModal + '">' +
                        '<div id="card">'+
                            '<div class="front">' +
                                '<div id="front-card" class="modal-fullscreen-item">' +
                                    this.closeButton +
                                    contentType(this.options.content) +
                                '</div>'+
                            '</div>' +
                            '<div class="back">' +
                                '<div  id="back-card" class="modal-fullscreen-item">' +
                                    this.closeButton +
                                    contentType(this.options.sideTwo.content) +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                '</div>',
        modalId,
        body = document.getElementsByTagName('body');

    if (body[0].id) {
        modalId = body[0].id;
    } else {
        modalId = 'go-modal';
        body[0].id = modalId;
    }

    StringAsNode(document.getElementById(modalId), tmpl);
    this.settings.modalOpen = true;

    if (this.options.sideTwo.content === null) return;

    buildButton(this.options.sideTwo.button);
    buildButton(this.options.sideTwo.buttonBack, 'back');
}

function buildElement(buildOptions) {
    var createElm,
        parentElm;

    createElm = document.createElement(buildOptions.elm);
    createElm.id = buildOptions.buttonId;
    createElm.innerHTML = buildOptions.buttonText;
    parentElm = document.getElementById(buildOptions.parentId);

    parentElm.appendChild(createElm);
}


function buildButton(elm) {
    var button,
        computedButton,
        computedButtonBack,
        frontCard,
        backCard;

    if (elm === null || elm === undefined) {
        if (document.getElementById('modal-button-next') || document.getElementById('modal-button-prev')) {
            return;
        } else {
            buildElement({
                elm: 'a',
                buttonId: 'modal-button-next',
                buttonText: 'Next step',
                parentId: 'front-card'
            });

            buildElement({
                elm: 'a',
                buttonId: 'modal-button-prev',
                buttonText: 'Previous step',
                parentId: 'back-card'
            });
        }
    } else {
        buildElement({
            elm: elm.element,
            buttonId: elm.id,
            buttonText: elm.text,
            parentId: elm.parent,
        });
    }
}

function contentType(contentValue) {
    if (typeof contentValue === 'string') {
        return contentValue;
    } else if (contentValue === null) {
        return '';
    } else {
        return contentValue.innerHTML;
    }
}

module.exports = Modalblanc;

},{"./lib/extend_default":2,"./lib/image_slider":3,"./lib/string_as_node":4}],2:[function(require,module,exports){
'use strict';
/* jshint node: true */

module.exports = function(source, properties) {
    var property;
    for (property in properties) {
        if (properties.hasOwnProperty(property)) {
            source[property] = properties[property];
        }
    }
    return source;
};
},{}],3:[function(require,module,exports){
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

    var _this = this;

    this.currentSlide = 0;

    this._init();
    // this.nextSlide()
    this.slider = document.querySelectorAll('.image-slider-holder .image-slider');
    this.setSlide();

    this.slideInterval = setInterval(function() {
        _this.nextSlide();
    }, 2000);
};

ImageSlider.prototype._init = function() {
    this.createSlides();
};

ImageSlider.prototype.createSlides = function() {
    this.slides = [];
    var slides,
        images = this.options.selector;

    if (images instanceof Array) {
        slides = images;
    } else {
        slides = document.querySelectorAll(this.options.selector + ' img');
    }


    var parentEl = document.querySelector(this.options.parent),
        container = document.createElement('ul'),
        slideImg,
        sliderElm,
        imgElm;

    container.className = 'image-slider-holder';

    for (var i = 0; i < slides.length; i++) {
        if (slides[i].src) {
            slideImg = slides[i].src;
        } else {
            slideImg = slides[i];
        }

        this.slides.push({
            index: i,
            el: slides[i],
            images: slideImg
        });

        sliderElm = document.createElement('li');
        sliderElm.className = 'image-slider';

        imgElm = document.createElement('img');
        imgElm.src = slideImg;

        sliderElm.appendChild(imgElm);
        container.appendChild(sliderElm);
        parentEl.appendChild(container);
    }
};

ImageSlider.prototype.setSlide = function() {
    // set the slider with image slider elements.
    var first = this.slider[0];
    first.classList.add('is-showing');
}

ImageSlider.prototype.nextSlide = function() {
    var slides = this.slider;

    slides[this.currentSlide].className = 'image-slider';
    this.currentSlide = (this.currentSlide + 1) % slides.length;
    slides[this.currentSlide].className = 'image-slider is-showing';
}

module.exports = ImageSlider;

},{"./extend_default":2,"./string_as_node":4}],4:[function(require,module,exports){
'use strict';
/* jshint node: true */

module.exports = function(element, html) {
    if (html === null) return;

    var frag = document.createDocumentFragment(),
        tmp = document.createElement('body'),
        child;

    tmp.innerHTML = html;

    while (child = tmp.firstChild) {
        frag.appendChild(child);
    }

    element.appendChild(frag);
    frag = tmp = null;
};
},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJpbmRleC5qcyIsImxpYi9leHRlbmRfZGVmYXVsdC5qcyIsImxpYi9pbWFnZV9zbGlkZXIuanMiLCJsaWIvc3RyaW5nX2FzX25vZGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsUUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25HQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCc7XG4vKiBqc2hpbnQgbm9kZTogdHJ1ZSAqL1xuXG52YXIgRXh0ZW5kRGVmYXVsdCA9IHJlcXVpcmUoJy4vbGliL2V4dGVuZF9kZWZhdWx0Jyk7XG52YXIgSW1hZ2VTbGlkZXIgPSByZXF1aXJlKCcuL2xpYi9pbWFnZV9zbGlkZXInKTtcbnZhciBTdHJpbmdBc05vZGUgPSByZXF1aXJlKCcuL2xpYi9zdHJpbmdfYXNfbm9kZScpO1xuXG5cbnZhciBNb2RhbGJsYW5jID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICghKHRoaXMgaW5zdGFuY2VvZiBNb2RhbGJsYW5jKSkge1xuICAgICAgcmV0dXJuIG5ldyBNb2RhbGJsYW5jKCk7XG4gICAgfVxuXG4gICAgdGhpcy5jbG9zZUJ1dHRvbiA9IG51bGw7XG4gICAgdGhpcy5vdmVybGF5ID0gbnVsbDtcblxuICAgIHZhciBkZWZhdWx0cyA9IHtcbiAgICAgICAgYW5pbWF0aW9uOiAnZmFkZS1pbi1vdXQnLFxuICAgICAgICBjbG9zZUJ1dHRvbjogdHJ1ZSxcbiAgICAgICAgY29udGVudDogJycsXG4gICAgICAgIHNsaWRlcjogbnVsbCxcbiAgICAgICAgc2lkZVR3bzoge1xuICAgICAgICAgICAgY29udGVudDogbnVsbCxcbiAgICAgICAgICAgIGFuaW1hdGlvbjogbnVsbCxcbiAgICAgICAgICAgIGJ1dHRvbjogbnVsbCxcbiAgICAgICAgICAgIGJ1dHRvbkJhY2s6IG51bGxcbiAgICAgICAgfSxcbiAgICAgIH07XG5cbiAgICB0aGlzLnNldHRpbmdzID0ge307XG5cbiAgICBpZiAoYXJndW1lbnRzWzBdICYmIHR5cGVvZiBhcmd1bWVudHNbMF0gPT09ICdvYmplY3QnKSB7XG4gICAgICAgIHRoaXMub3B0aW9ucyA9IEV4dGVuZERlZmF1bHQoZGVmYXVsdHMsIGFyZ3VtZW50c1swXSk7XG4gICAgfVxuXG59O1xuXG5Nb2RhbGJsYW5jLnByb3RvdHlwZS5vcGVuID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKHRoaXMuc2V0dGluZ3MubW9kYWxPcGVuKSByZXR1cm47XG5cbiAgICBidWlsZC5jYWxsKHRoaXMpO1xuICAgIHNldEV2ZW50cy5jYWxsKHRoaXMpO1xufTtcblxuTW9kYWxibGFuYy5wcm90b3R5cGUuY2xvc2UgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAoIXRoaXMuc2V0dGluZ3MubW9kYWxPcGVuKSByZXR1cm47XG5cbiAgICB2YXIgb3ZlcmxheSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdvdmVybGF5LW1vZGFsLWJsYW5jJyksXG4gICAgICAgIF90aGlzID0gdGhpcztcblxuICAgIG92ZXJsYXkuY2xhc3NMaXN0LnJlbW92ZSgnaXMtYWN0aXZlJyk7XG4gICAgb3ZlcmxheS5jbGFzc0xpc3QuYWRkKCdpcy1pbmFjdGl2ZScpO1xuXG4gICAgdmFyIHRyYW5zUHJlZml4ID0gdHJhbnNpdGlvblByZWZpeChvdmVybGF5KTtcblxuICAgIG92ZXJsYXkuYWRkRXZlbnRMaXN0ZW5lcih0cmFuc1ByZWZpeC5lbmQsIGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLnJlbW92ZSgpO1xuICAgICAgICBfdGhpcy5zZXR0aW5ncy5tb2RhbE9wZW4gPSBmYWxzZTtcbiAgICB9LCBmYWxzZSk7XG59O1xuXG5Nb2RhbGJsYW5jLnByb3RvdHlwZS5zbGlkZXJJbml0ID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKHRoaXMub3B0aW9ucy5zbGlkZXIgIT09IG51bGwpIHtcbiAgICAgICAgdGhpcy5zZXR0aW5ncy5zbGlkZXIgPSB0cnVlO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnNldHRpbmdzLnNsaWRlcikge1xuICAgICAgICB0aGlzLm9wZW4oKTtcbiAgICAgICAgdmFyIHNsaWRlciA9IG5ldyBJbWFnZVNsaWRlcih7XG4gICAgICAgICAgICBzZWxlY3RvcjogdGhpcy5vcHRpb25zLnNsaWRlcixcbiAgICAgICAgICAgIHBhcmVudDogJyNmcm9udC1jYXJkJ1xuICAgICAgICB9KTtcbiAgICB9XG59O1xuXG5Nb2RhbGJsYW5jLnByb3RvdHlwZS5fY29udGVudE5leHQgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgY2FyZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjYXJkJyksXG4gICAgICAgIGN1c3RvbUNsYXNzID0gdGhpcy5vcHRpb25zLnNpZGVUd28uYW5pbWF0aW9uO1xuXG4gICAgY2FyZC5jbGFzc0xpc3QucmVtb3ZlKHR5cGVPZkFuaW1hdGlvbihjdXN0b21DbGFzcywgMikpO1xuICAgIGNhcmQuY2xhc3NMaXN0LmFkZCh0eXBlT2ZBbmltYXRpb24oY3VzdG9tQ2xhc3MpKTtcbn07XG5cbk1vZGFsYmxhbmMucHJvdG90eXBlLl9jb250ZW50UHJldmlvdXMgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgY2FyZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjYXJkJyksXG4gICAgICAgIGN1c3RvbUNsYXNzID0gdGhpcy5vcHRpb25zLnNpZGVUd28uYW5pbWF0aW9uO1xuXG4gICAgY2FyZC5jbGFzc0xpc3QucmVtb3ZlKHR5cGVPZkFuaW1hdGlvbihjdXN0b21DbGFzcykpO1xuICAgIGNhcmQuY2xhc3NMaXN0LmFkZCh0eXBlT2ZBbmltYXRpb24oY3VzdG9tQ2xhc3MsIDIpKTtcbn07XG5cbk1vZGFsYmxhbmMucHJvdG90eXBlLmNsYXNzRXZlbnRMaXN0ZW5lciA9IGZ1bmN0aW9uKGVsbSwgY2FsbGJhY2spIHtcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbG0ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgZWxtW2ldLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICB9KTtcbiAgICB9XG59O1xuXG5mdW5jdGlvbiB0eXBlT2ZBbmltYXRpb24odHlwZSwgdHlwZUNsYXNzKSB7XG4gICAgdmFyIGFuaW1hdGlvblR5cGVzID0ge1xuICAgICAgICAgICAgJ3NsaWRlJzogWydzbGlkZS1uZXh0JywgJ3NsaWRlLWJhY2snXSxcbiAgICAgICAgICAgICdzY2FsZSc6IFsnc2NhbGUtbmV4dCcsICdzY2FsZS1iYWNrJ11cbiAgICAgICAgfSxcbiAgICAgICAgYW5pbWF0aW9uQ2xhc3MgPSBhbmltYXRpb25UeXBlc1t0eXBlXTtcblxuICAgICAgICBpZiAodHlwZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBpZiAodHlwZUNsYXNzID09PSAyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGFuaW1hdGlvblR5cGVzLnNsaWRlWzFdO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYW5pbWF0aW9uVHlwZXMuc2xpZGVbMF07XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZUNsYXNzID09PSAyKSB7XG4gICAgICAgICAgICByZXR1cm4gYW5pbWF0aW9uQ2xhc3NbMV07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gYW5pbWF0aW9uQ2xhc3NbMF07XG4gICAgICAgIH1cbn1cblxuZnVuY3Rpb24gdHJhbnNpdGlvblByZWZpeChlbG0pIHtcbiAgICB2YXIgdHJhbnNFbmRFdmVudE5hbWVzID0ge1xuICAgICAgICAnV2Via2l0VHJhbnNpdGlvbicgOiAnd2Via2l0VHJhbnNpdGlvbkVuZCcsXG4gICAgICAgICdNb3pUcmFuc2l0aW9uJyAgICA6ICd0cmFuc2l0aW9uZW5kJyxcbiAgICAgICAgJ09UcmFuc2l0aW9uJyAgICAgIDogJ29UcmFuc2l0aW9uRW5kIG90cmFuc2l0aW9uZW5kJyxcbiAgICAgICAgJ3RyYW5zaXRpb24nICAgICAgIDogJ3RyYW5zaXRpb25lbmQnXG4gICAgfTtcblxuICAgIGZvciAodmFyIG5hbWUgaW4gdHJhbnNFbmRFdmVudE5hbWVzKSB7XG4gICAgICBpZiAoZWxtLnN0eWxlW25hbWVdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGVuZDogdHJhbnNFbmRFdmVudE5hbWVzW25hbWVdXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfVxufVxuXG5mdW5jdGlvbiBzZXRFdmVudHMoKSB7XG4gICAgdmFyIG5leHRCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbW9kYWwtYnV0dG9uLW5leHQnKSxcbiAgICAgICAgcHJldkJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtb2RhbC1idXR0b24tcHJldicpLFxuICAgICAgICBjbG9zZWQgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdtb2RhbC1mdWxsc2NyZWVuLWNsb3NlJyksXG4gICAgICAgIF90aGlzID0gdGhpcztcblxuICAgIHRoaXMuY2xhc3NFdmVudExpc3RlbmVyKGNsb3NlZCwgZnVuY3Rpb24oKSB7XG4gICAgICAgIF90aGlzLmNsb3NlKCk7XG4gICAgfSk7XG5cbiAgICBpZiAodGhpcy5vcHRpb25zLnNpZGVUd28uY29udGVudCA9PT0gbnVsbCkgcmV0dXJuO1xuXG4gICAgbmV4dEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuX2NvbnRlbnROZXh0LmJpbmQodGhpcykpO1xuICAgIHByZXZCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLl9jb250ZW50UHJldmlvdXMuYmluZCh0aGlzKSk7XG59XG5cbmZ1bmN0aW9uIGJ1aWxkKCkge1xuICAgIGlmICh0aGlzLm9wdGlvbnMuY2xvc2VCdXR0b24gPT09IHRydWUpIHtcbiAgICAgICAgdGhpcy5jbG9zZUJ1dHRvbiA9ICc8c3BhbiBjbGFzcz1cIm1vZGFsLWZ1bGxzY3JlZW4tY2xvc2VcIj5YPC9zcGFuPic7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5jbG9zZUJ1dHRvbiA9ICcnO1xuICAgIH1cblxuICAgIHZhciB0eXBlTW9kYWwgPSB0aGlzLnNldHRpbmdzLnNsaWRlciA/ICdzbGlkZXItbW9kYWwnIDogJ2JpZy1tb2RhbCcsXG4gICAgICAgIHRtcGwgPSAnPGRpdiBpZD1cIm92ZXJsYXktbW9kYWwtYmxhbmNcIiBjbGFzcz1cIm1vZGFsLWZ1bGxzY3JlZW4tYmFja2dyb3VuZCcgKyAnICcgKyAgdGhpcy5vcHRpb25zLmFuaW1hdGlvbiArICcgJyArICdpcy1hY3RpdmVcIj4nICtcbiAgICAgICAgICAgICAgICAgICAgJzxkaXYgaWQ9XCJtb2RhbC1mdWxsc2NyZWVuLWNvbnRhaW5lclwiY2xhc3M9XCJtb2RhbC1mdWxsc2NyZWVuLWNvbnRhaW5lciAnICsgdHlwZU1vZGFsICsgJ1wiPicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJzxkaXYgaWQ9XCJjYXJkXCI+JytcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cImZyb250XCI+JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8ZGl2IGlkPVwiZnJvbnQtY2FyZFwiIGNsYXNzPVwibW9kYWwtZnVsbHNjcmVlbi1pdGVtXCI+JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNsb3NlQnV0dG9uICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnRUeXBlKHRoaXMub3B0aW9ucy5jb250ZW50KSArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8L2Rpdj4nK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8L2Rpdj4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cImJhY2tcIj4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJzxkaXYgIGlkPVwiYmFjay1jYXJkXCIgY2xhc3M9XCJtb2RhbC1mdWxsc2NyZWVuLWl0ZW1cIj4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2xvc2VCdXR0b24gK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudFR5cGUodGhpcy5vcHRpb25zLnNpZGVUd28uY29udGVudCkgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPC9kaXY+JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJzwvZGl2PicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJzwvZGl2PicgK1xuICAgICAgICAgICAgICAgICAgICAnPC9kaXY+JyArXG4gICAgICAgICAgICAgICAgJzwvZGl2PicsXG4gICAgICAgIG1vZGFsSWQsXG4gICAgICAgIGJvZHkgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnYm9keScpO1xuXG4gICAgaWYgKGJvZHlbMF0uaWQpIHtcbiAgICAgICAgbW9kYWxJZCA9IGJvZHlbMF0uaWQ7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgbW9kYWxJZCA9ICdnby1tb2RhbCc7XG4gICAgICAgIGJvZHlbMF0uaWQgPSBtb2RhbElkO1xuICAgIH1cblxuICAgIFN0cmluZ0FzTm9kZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZChtb2RhbElkKSwgdG1wbCk7XG4gICAgdGhpcy5zZXR0aW5ncy5tb2RhbE9wZW4gPSB0cnVlO1xuXG4gICAgaWYgKHRoaXMub3B0aW9ucy5zaWRlVHdvLmNvbnRlbnQgPT09IG51bGwpIHJldHVybjtcblxuICAgIGJ1aWxkQnV0dG9uKHRoaXMub3B0aW9ucy5zaWRlVHdvLmJ1dHRvbik7XG4gICAgYnVpbGRCdXR0b24odGhpcy5vcHRpb25zLnNpZGVUd28uYnV0dG9uQmFjaywgJ2JhY2snKTtcbn1cblxuZnVuY3Rpb24gYnVpbGRFbGVtZW50KGJ1aWxkT3B0aW9ucykge1xuICAgIHZhciBjcmVhdGVFbG0sXG4gICAgICAgIHBhcmVudEVsbTtcblxuICAgIGNyZWF0ZUVsbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoYnVpbGRPcHRpb25zLmVsbSk7XG4gICAgY3JlYXRlRWxtLmlkID0gYnVpbGRPcHRpb25zLmJ1dHRvbklkO1xuICAgIGNyZWF0ZUVsbS5pbm5lckhUTUwgPSBidWlsZE9wdGlvbnMuYnV0dG9uVGV4dDtcbiAgICBwYXJlbnRFbG0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChidWlsZE9wdGlvbnMucGFyZW50SWQpO1xuXG4gICAgcGFyZW50RWxtLmFwcGVuZENoaWxkKGNyZWF0ZUVsbSk7XG59XG5cblxuZnVuY3Rpb24gYnVpbGRCdXR0b24oZWxtKSB7XG4gICAgdmFyIGJ1dHRvbixcbiAgICAgICAgY29tcHV0ZWRCdXR0b24sXG4gICAgICAgIGNvbXB1dGVkQnV0dG9uQmFjayxcbiAgICAgICAgZnJvbnRDYXJkLFxuICAgICAgICBiYWNrQ2FyZDtcblxuICAgIGlmIChlbG0gPT09IG51bGwgfHwgZWxtID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgaWYgKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtb2RhbC1idXR0b24tbmV4dCcpIHx8IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtb2RhbC1idXR0b24tcHJldicpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBidWlsZEVsZW1lbnQoe1xuICAgICAgICAgICAgICAgIGVsbTogJ2EnLFxuICAgICAgICAgICAgICAgIGJ1dHRvbklkOiAnbW9kYWwtYnV0dG9uLW5leHQnLFxuICAgICAgICAgICAgICAgIGJ1dHRvblRleHQ6ICdOZXh0IHN0ZXAnLFxuICAgICAgICAgICAgICAgIHBhcmVudElkOiAnZnJvbnQtY2FyZCdcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBidWlsZEVsZW1lbnQoe1xuICAgICAgICAgICAgICAgIGVsbTogJ2EnLFxuICAgICAgICAgICAgICAgIGJ1dHRvbklkOiAnbW9kYWwtYnV0dG9uLXByZXYnLFxuICAgICAgICAgICAgICAgIGJ1dHRvblRleHQ6ICdQcmV2aW91cyBzdGVwJyxcbiAgICAgICAgICAgICAgICBwYXJlbnRJZDogJ2JhY2stY2FyZCdcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgICAgYnVpbGRFbGVtZW50KHtcbiAgICAgICAgICAgIGVsbTogZWxtLmVsZW1lbnQsXG4gICAgICAgICAgICBidXR0b25JZDogZWxtLmlkLFxuICAgICAgICAgICAgYnV0dG9uVGV4dDogZWxtLnRleHQsXG4gICAgICAgICAgICBwYXJlbnRJZDogZWxtLnBhcmVudCxcbiAgICAgICAgfSk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBjb250ZW50VHlwZShjb250ZW50VmFsdWUpIHtcbiAgICBpZiAodHlwZW9mIGNvbnRlbnRWYWx1ZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgcmV0dXJuIGNvbnRlbnRWYWx1ZTtcbiAgICB9IGVsc2UgaWYgKGNvbnRlbnRWYWx1ZSA9PT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gJyc7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGNvbnRlbnRWYWx1ZS5pbm5lckhUTUw7XG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IE1vZGFsYmxhbmM7XG4iLCIndXNlIHN0cmljdCc7XG4vKiBqc2hpbnQgbm9kZTogdHJ1ZSAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHNvdXJjZSwgcHJvcGVydGllcykge1xuICAgIHZhciBwcm9wZXJ0eTtcbiAgICBmb3IgKHByb3BlcnR5IGluIHByb3BlcnRpZXMpIHtcbiAgICAgICAgaWYgKHByb3BlcnRpZXMuaGFzT3duUHJvcGVydHkocHJvcGVydHkpKSB7XG4gICAgICAgICAgICBzb3VyY2VbcHJvcGVydHldID0gcHJvcGVydGllc1twcm9wZXJ0eV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHNvdXJjZTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xuLyoganNoaW50IG5vZGU6IHRydWUgKi9cblxudmFyIEV4dGVuZERlZmF1bHQgPSByZXF1aXJlKCcuL2V4dGVuZF9kZWZhdWx0Jyk7XG52YXIgU3RyaW5nQXNOb2RlID0gcmVxdWlyZSgnLi9zdHJpbmdfYXNfbm9kZScpO1xuXG52YXIgSW1hZ2VTbGlkZXIgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAoISh0aGlzIGluc3RhbmNlb2YgSW1hZ2VTbGlkZXIpKSB7XG4gICAgICAgIHJldHVybiBuZXcgSW1hZ2VTbGlkZXIoKTtcbiAgICB9XG5cbiAgICB2YXIgZGVmYXVsdHMgPSB7XG4gICAgICAgIHNlbGVjdG9yOiAnLnNsaWRlcycsXG4gICAgICAgIHRyYW5zaXRpb246ICdmYWRlLXNsaWRlJyxcbiAgICAgICAgYXV0b1BsYXk6IGZhbHNlXG4gICAgfTtcblxuICAgIGlmIChhcmd1bWVudHNbMF0gJiYgdHlwZW9mIGFyZ3VtZW50c1swXSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgdGhpcy5vcHRpb25zID0gRXh0ZW5kRGVmYXVsdChkZWZhdWx0cywgYXJndW1lbnRzWzBdKTtcbiAgICB9XG5cbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgdGhpcy5jdXJyZW50U2xpZGUgPSAwO1xuXG4gICAgdGhpcy5faW5pdCgpO1xuICAgIC8vIHRoaXMubmV4dFNsaWRlKClcbiAgICB0aGlzLnNsaWRlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5pbWFnZS1zbGlkZXItaG9sZGVyIC5pbWFnZS1zbGlkZXInKTtcbiAgICB0aGlzLnNldFNsaWRlKCk7XG5cbiAgICB0aGlzLnNsaWRlSW50ZXJ2YWwgPSBzZXRJbnRlcnZhbChmdW5jdGlvbigpIHtcbiAgICAgICAgX3RoaXMubmV4dFNsaWRlKCk7XG4gICAgfSwgMjAwMCk7XG59O1xuXG5JbWFnZVNsaWRlci5wcm90b3R5cGUuX2luaXQgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmNyZWF0ZVNsaWRlcygpO1xufTtcblxuSW1hZ2VTbGlkZXIucHJvdG90eXBlLmNyZWF0ZVNsaWRlcyA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuc2xpZGVzID0gW107XG4gICAgdmFyIHNsaWRlcyxcbiAgICAgICAgaW1hZ2VzID0gdGhpcy5vcHRpb25zLnNlbGVjdG9yO1xuXG4gICAgaWYgKGltYWdlcyBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgIHNsaWRlcyA9IGltYWdlcztcbiAgICB9IGVsc2Uge1xuICAgICAgICBzbGlkZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHRoaXMub3B0aW9ucy5zZWxlY3RvciArICcgaW1nJyk7XG4gICAgfVxuXG5cbiAgICB2YXIgcGFyZW50RWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRoaXMub3B0aW9ucy5wYXJlbnQpLFxuICAgICAgICBjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd1bCcpLFxuICAgICAgICBzbGlkZUltZyxcbiAgICAgICAgc2xpZGVyRWxtLFxuICAgICAgICBpbWdFbG07XG5cbiAgICBjb250YWluZXIuY2xhc3NOYW1lID0gJ2ltYWdlLXNsaWRlci1ob2xkZXInO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzbGlkZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKHNsaWRlc1tpXS5zcmMpIHtcbiAgICAgICAgICAgIHNsaWRlSW1nID0gc2xpZGVzW2ldLnNyYztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNsaWRlSW1nID0gc2xpZGVzW2ldO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zbGlkZXMucHVzaCh7XG4gICAgICAgICAgICBpbmRleDogaSxcbiAgICAgICAgICAgIGVsOiBzbGlkZXNbaV0sXG4gICAgICAgICAgICBpbWFnZXM6IHNsaWRlSW1nXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHNsaWRlckVsbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XG4gICAgICAgIHNsaWRlckVsbS5jbGFzc05hbWUgPSAnaW1hZ2Utc2xpZGVyJztcblxuICAgICAgICBpbWdFbG0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKTtcbiAgICAgICAgaW1nRWxtLnNyYyA9IHNsaWRlSW1nO1xuXG4gICAgICAgIHNsaWRlckVsbS5hcHBlbmRDaGlsZChpbWdFbG0pO1xuICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoc2xpZGVyRWxtKTtcbiAgICAgICAgcGFyZW50RWwuYXBwZW5kQ2hpbGQoY29udGFpbmVyKTtcbiAgICB9XG59O1xuXG5JbWFnZVNsaWRlci5wcm90b3R5cGUuc2V0U2xpZGUgPSBmdW5jdGlvbigpIHtcbiAgICAvLyBzZXQgdGhlIHNsaWRlciB3aXRoIGltYWdlIHNsaWRlciBlbGVtZW50cy5cbiAgICB2YXIgZmlyc3QgPSB0aGlzLnNsaWRlclswXTtcbiAgICBmaXJzdC5jbGFzc0xpc3QuYWRkKCdpcy1zaG93aW5nJyk7XG59XG5cbkltYWdlU2xpZGVyLnByb3RvdHlwZS5uZXh0U2xpZGUgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgc2xpZGVzID0gdGhpcy5zbGlkZXI7XG5cbiAgICBzbGlkZXNbdGhpcy5jdXJyZW50U2xpZGVdLmNsYXNzTmFtZSA9ICdpbWFnZS1zbGlkZXInO1xuICAgIHRoaXMuY3VycmVudFNsaWRlID0gKHRoaXMuY3VycmVudFNsaWRlICsgMSkgJSBzbGlkZXMubGVuZ3RoO1xuICAgIHNsaWRlc1t0aGlzLmN1cnJlbnRTbGlkZV0uY2xhc3NOYW1lID0gJ2ltYWdlLXNsaWRlciBpcy1zaG93aW5nJztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBJbWFnZVNsaWRlcjtcbiIsIid1c2Ugc3RyaWN0Jztcbi8qIGpzaGludCBub2RlOiB0cnVlICovXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZWxlbWVudCwgaHRtbCkge1xuICAgIGlmIChodG1sID09PSBudWxsKSByZXR1cm47XG5cbiAgICB2YXIgZnJhZyA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKSxcbiAgICAgICAgdG1wID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYm9keScpLFxuICAgICAgICBjaGlsZDtcblxuICAgIHRtcC5pbm5lckhUTUwgPSBodG1sO1xuXG4gICAgd2hpbGUgKGNoaWxkID0gdG1wLmZpcnN0Q2hpbGQpIHtcbiAgICAgICAgZnJhZy5hcHBlbmRDaGlsZChjaGlsZCk7XG4gICAgfVxuXG4gICAgZWxlbWVudC5hcHBlbmRDaGlsZChmcmFnKTtcbiAgICBmcmFnID0gdG1wID0gbnVsbDtcbn07Il19
