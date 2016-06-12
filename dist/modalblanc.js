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

Modalblanc.prototype.sliderInit = function(side) {
    if (this.options.slider !== null) {
        this.settings.slider = true;
    }

    if (this.settings.slider) {
        this.open();
        var slider = new ImageSlider({
            selector: this.options.slider,
            parent: side
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

    var typeModal = this.options.slider ? 'slider-modal' : 'big-modal',
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

    if (this.options.slider) this.sliderInit('#front-card');
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
    this.playing = true;

    this._init();
    // this.nextSlide()
    this.slider = document.querySelectorAll('.image-slider-holder .image-slider');
    this.setSlide();
    this.play();
};

ImageSlider.prototype._init = function() {
    this.createSlides();
    setEvents.call(this);
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

    this.pauseBtn = document.createElement('span');
    this.pauseBtn.id = 'pause-btn';
    this.pauseBtn.innerHTML = 'pause';
    container.appendChild(this.pauseBtn);
};

ImageSlider.prototype.setSlide = function() {
    // set the slider with image slider elements.
    var first = this.slider[0];
    first.classList.add('is-showing');
}

function setEvents() {
    var pauseButton = document.getElementById('pause-btn'),
        _this = this;;

    pauseButton.onclick = function() {
        debugger
        if (_this.playing) {
            _this.pause();
        } else {
            _this.play();
        }
    }
}

ImageSlider.prototype.nextSlide = function() {
    var slides = this.slider;

    slides[this.currentSlide].className = 'image-slider';
    this.currentSlide = (this.currentSlide + 1) % slides.length;
    slides[this.currentSlide].className = 'image-slider is-showing';
}

ImageSlider.prototype.pause = function() {
    this.pauseBtn.innerHTML = 'play';
    this.playing = false;
    clearInterval(this.slideInterval);
}

ImageSlider.prototype.play = function() {
    var _this = this;

    this.pauseBtn.innerHTML = 'pause';
    this.playing = true;
    this.slideInterval = setInterval(function() {
        _this.nextSlide();
    }, 2000);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJpbmRleC5qcyIsImxpYi9leHRlbmRfZGVmYXVsdC5qcyIsImxpYi9pbWFnZV9zbGlkZXIuanMiLCJsaWIvc3RyaW5nX2FzX25vZGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcFFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCc7XG4vKiBqc2hpbnQgbm9kZTogdHJ1ZSAqL1xuXG52YXIgRXh0ZW5kRGVmYXVsdCA9IHJlcXVpcmUoJy4vbGliL2V4dGVuZF9kZWZhdWx0Jyk7XG52YXIgSW1hZ2VTbGlkZXIgPSByZXF1aXJlKCcuL2xpYi9pbWFnZV9zbGlkZXInKTtcbnZhciBTdHJpbmdBc05vZGUgPSByZXF1aXJlKCcuL2xpYi9zdHJpbmdfYXNfbm9kZScpO1xuXG5cbnZhciBNb2RhbGJsYW5jID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICghKHRoaXMgaW5zdGFuY2VvZiBNb2RhbGJsYW5jKSkge1xuICAgICAgcmV0dXJuIG5ldyBNb2RhbGJsYW5jKCk7XG4gICAgfVxuXG4gICAgdGhpcy5jbG9zZUJ1dHRvbiA9IG51bGw7XG4gICAgdGhpcy5vdmVybGF5ID0gbnVsbDtcblxuICAgIHZhciBkZWZhdWx0cyA9IHtcbiAgICAgICAgYW5pbWF0aW9uOiAnZmFkZS1pbi1vdXQnLFxuICAgICAgICBjbG9zZUJ1dHRvbjogdHJ1ZSxcbiAgICAgICAgY29udGVudDogJycsXG4gICAgICAgIHNsaWRlcjogbnVsbCxcbiAgICAgICAgc2lkZVR3bzoge1xuICAgICAgICAgICAgY29udGVudDogbnVsbCxcbiAgICAgICAgICAgIGFuaW1hdGlvbjogbnVsbCxcbiAgICAgICAgICAgIGJ1dHRvbjogbnVsbCxcbiAgICAgICAgICAgIGJ1dHRvbkJhY2s6IG51bGxcbiAgICAgICAgfSxcbiAgICAgIH07XG5cbiAgICB0aGlzLnNldHRpbmdzID0ge307XG5cbiAgICBpZiAoYXJndW1lbnRzWzBdICYmIHR5cGVvZiBhcmd1bWVudHNbMF0gPT09ICdvYmplY3QnKSB7XG4gICAgICAgIHRoaXMub3B0aW9ucyA9IEV4dGVuZERlZmF1bHQoZGVmYXVsdHMsIGFyZ3VtZW50c1swXSk7XG4gICAgfVxuXG59O1xuXG5Nb2RhbGJsYW5jLnByb3RvdHlwZS5vcGVuID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKHRoaXMuc2V0dGluZ3MubW9kYWxPcGVuKSByZXR1cm47XG5cbiAgICBidWlsZC5jYWxsKHRoaXMpO1xuICAgIHNldEV2ZW50cy5jYWxsKHRoaXMpO1xufTtcblxuTW9kYWxibGFuYy5wcm90b3R5cGUuY2xvc2UgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAoIXRoaXMuc2V0dGluZ3MubW9kYWxPcGVuKSByZXR1cm47XG5cbiAgICB2YXIgb3ZlcmxheSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdvdmVybGF5LW1vZGFsLWJsYW5jJyksXG4gICAgICAgIF90aGlzID0gdGhpcztcblxuICAgIG92ZXJsYXkuY2xhc3NMaXN0LnJlbW92ZSgnaXMtYWN0aXZlJyk7XG4gICAgb3ZlcmxheS5jbGFzc0xpc3QuYWRkKCdpcy1pbmFjdGl2ZScpO1xuXG4gICAgdmFyIHRyYW5zUHJlZml4ID0gdHJhbnNpdGlvblByZWZpeChvdmVybGF5KTtcblxuICAgIG92ZXJsYXkuYWRkRXZlbnRMaXN0ZW5lcih0cmFuc1ByZWZpeC5lbmQsIGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLnJlbW92ZSgpO1xuICAgICAgICBfdGhpcy5zZXR0aW5ncy5tb2RhbE9wZW4gPSBmYWxzZTtcbiAgICB9LCBmYWxzZSk7XG59O1xuXG5Nb2RhbGJsYW5jLnByb3RvdHlwZS5zbGlkZXJJbml0ID0gZnVuY3Rpb24oc2lkZSkge1xuICAgIGlmICh0aGlzLm9wdGlvbnMuc2xpZGVyICE9PSBudWxsKSB7XG4gICAgICAgIHRoaXMuc2V0dGluZ3Muc2xpZGVyID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5zZXR0aW5ncy5zbGlkZXIpIHtcbiAgICAgICAgdGhpcy5vcGVuKCk7XG4gICAgICAgIHZhciBzbGlkZXIgPSBuZXcgSW1hZ2VTbGlkZXIoe1xuICAgICAgICAgICAgc2VsZWN0b3I6IHRoaXMub3B0aW9ucy5zbGlkZXIsXG4gICAgICAgICAgICBwYXJlbnQ6IHNpZGVcbiAgICAgICAgfSk7XG4gICAgfVxufTtcblxuTW9kYWxibGFuYy5wcm90b3R5cGUuX2NvbnRlbnROZXh0ID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGNhcmQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2FyZCcpLFxuICAgICAgICBjdXN0b21DbGFzcyA9IHRoaXMub3B0aW9ucy5zaWRlVHdvLmFuaW1hdGlvbjtcblxuICAgIGNhcmQuY2xhc3NMaXN0LnJlbW92ZSh0eXBlT2ZBbmltYXRpb24oY3VzdG9tQ2xhc3MsIDIpKTtcbiAgICBjYXJkLmNsYXNzTGlzdC5hZGQodHlwZU9mQW5pbWF0aW9uKGN1c3RvbUNsYXNzKSk7XG59O1xuXG5Nb2RhbGJsYW5jLnByb3RvdHlwZS5fY29udGVudFByZXZpb3VzID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGNhcmQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2FyZCcpLFxuICAgICAgICBjdXN0b21DbGFzcyA9IHRoaXMub3B0aW9ucy5zaWRlVHdvLmFuaW1hdGlvbjtcblxuICAgIGNhcmQuY2xhc3NMaXN0LnJlbW92ZSh0eXBlT2ZBbmltYXRpb24oY3VzdG9tQ2xhc3MpKTtcbiAgICBjYXJkLmNsYXNzTGlzdC5hZGQodHlwZU9mQW5pbWF0aW9uKGN1c3RvbUNsYXNzLCAyKSk7XG59O1xuXG5Nb2RhbGJsYW5jLnByb3RvdHlwZS5jbGFzc0V2ZW50TGlzdGVuZXIgPSBmdW5jdGlvbihlbG0sIGNhbGxiYWNrKSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZWxtLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGVsbVtpXS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgfSk7XG4gICAgfVxufTtcblxuZnVuY3Rpb24gdHlwZU9mQW5pbWF0aW9uKHR5cGUsIHR5cGVDbGFzcykge1xuICAgIHZhciBhbmltYXRpb25UeXBlcyA9IHtcbiAgICAgICAgICAgICdzbGlkZSc6IFsnc2xpZGUtbmV4dCcsICdzbGlkZS1iYWNrJ10sXG4gICAgICAgICAgICAnc2NhbGUnOiBbJ3NjYWxlLW5leHQnLCAnc2NhbGUtYmFjayddXG4gICAgICAgIH0sXG4gICAgICAgIGFuaW1hdGlvbkNsYXNzID0gYW5pbWF0aW9uVHlwZXNbdHlwZV07XG5cbiAgICAgICAgaWYgKHR5cGUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgaWYgKHR5cGVDbGFzcyA9PT0gMikge1xuICAgICAgICAgICAgICAgIHJldHVybiBhbmltYXRpb25UeXBlcy5zbGlkZVsxXTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGFuaW1hdGlvblR5cGVzLnNsaWRlWzBdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKHR5cGVDbGFzcyA9PT0gMikge1xuICAgICAgICAgICAgcmV0dXJuIGFuaW1hdGlvbkNsYXNzWzFdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGFuaW1hdGlvbkNsYXNzWzBdO1xuICAgICAgICB9XG59XG5cbmZ1bmN0aW9uIHRyYW5zaXRpb25QcmVmaXgoZWxtKSB7XG4gICAgdmFyIHRyYW5zRW5kRXZlbnROYW1lcyA9IHtcbiAgICAgICAgJ1dlYmtpdFRyYW5zaXRpb24nIDogJ3dlYmtpdFRyYW5zaXRpb25FbmQnLFxuICAgICAgICAnTW96VHJhbnNpdGlvbicgICAgOiAndHJhbnNpdGlvbmVuZCcsXG4gICAgICAgICdPVHJhbnNpdGlvbicgICAgICA6ICdvVHJhbnNpdGlvbkVuZCBvdHJhbnNpdGlvbmVuZCcsXG4gICAgICAgICd0cmFuc2l0aW9uJyAgICAgICA6ICd0cmFuc2l0aW9uZW5kJ1xuICAgIH07XG5cbiAgICBmb3IgKHZhciBuYW1lIGluIHRyYW5zRW5kRXZlbnROYW1lcykge1xuICAgICAgaWYgKGVsbS5zdHlsZVtuYW1lXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBlbmQ6IHRyYW5zRW5kRXZlbnROYW1lc1tuYW1lXVxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH1cbn1cblxuZnVuY3Rpb24gc2V0RXZlbnRzKCkge1xuICAgIHZhciBuZXh0QnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21vZGFsLWJ1dHRvbi1uZXh0JyksXG4gICAgICAgIHByZXZCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbW9kYWwtYnV0dG9uLXByZXYnKSxcbiAgICAgICAgY2xvc2VkID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnbW9kYWwtZnVsbHNjcmVlbi1jbG9zZScpLFxuICAgICAgICBfdGhpcyA9IHRoaXM7XG5cbiAgICB0aGlzLmNsYXNzRXZlbnRMaXN0ZW5lcihjbG9zZWQsIGZ1bmN0aW9uKCkge1xuICAgICAgICBfdGhpcy5jbG9zZSgpO1xuICAgIH0pO1xuXG4gICAgaWYgKHRoaXMub3B0aW9ucy5zaWRlVHdvLmNvbnRlbnQgPT09IG51bGwpIHJldHVybjtcblxuICAgIG5leHRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLl9jb250ZW50TmV4dC5iaW5kKHRoaXMpKTtcbiAgICBwcmV2QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5fY29udGVudFByZXZpb3VzLmJpbmQodGhpcykpO1xufVxuXG5mdW5jdGlvbiBidWlsZCgpIHtcbiAgICBpZiAodGhpcy5vcHRpb25zLmNsb3NlQnV0dG9uID09PSB0cnVlKSB7XG4gICAgICAgIHRoaXMuY2xvc2VCdXR0b24gPSAnPHNwYW4gY2xhc3M9XCJtb2RhbC1mdWxsc2NyZWVuLWNsb3NlXCI+WDwvc3Bhbj4nO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuY2xvc2VCdXR0b24gPSAnJztcbiAgICB9XG5cbiAgICB2YXIgdHlwZU1vZGFsID0gdGhpcy5vcHRpb25zLnNsaWRlciA/ICdzbGlkZXItbW9kYWwnIDogJ2JpZy1tb2RhbCcsXG4gICAgICAgIHRtcGwgPSAnPGRpdiBpZD1cIm92ZXJsYXktbW9kYWwtYmxhbmNcIiBjbGFzcz1cIm1vZGFsLWZ1bGxzY3JlZW4tYmFja2dyb3VuZCcgKyAnICcgKyAgdGhpcy5vcHRpb25zLmFuaW1hdGlvbiArICcgJyArICdpcy1hY3RpdmVcIj4nICtcbiAgICAgICAgICAgICAgICAgICAgJzxkaXYgaWQ9XCJtb2RhbC1mdWxsc2NyZWVuLWNvbnRhaW5lclwiY2xhc3M9XCJtb2RhbC1mdWxsc2NyZWVuLWNvbnRhaW5lciAnICsgdHlwZU1vZGFsICsgJ1wiPicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJzxkaXYgaWQ9XCJjYXJkXCI+JytcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cImZyb250XCI+JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8ZGl2IGlkPVwiZnJvbnQtY2FyZFwiIGNsYXNzPVwibW9kYWwtZnVsbHNjcmVlbi1pdGVtXCI+JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNsb3NlQnV0dG9uICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnRUeXBlKHRoaXMub3B0aW9ucy5jb250ZW50KSArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8L2Rpdj4nK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8L2Rpdj4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cImJhY2tcIj4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJzxkaXYgIGlkPVwiYmFjay1jYXJkXCIgY2xhc3M9XCJtb2RhbC1mdWxsc2NyZWVuLWl0ZW1cIj4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2xvc2VCdXR0b24gK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudFR5cGUodGhpcy5vcHRpb25zLnNpZGVUd28uY29udGVudCkgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPC9kaXY+JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJzwvZGl2PicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJzwvZGl2PicgK1xuICAgICAgICAgICAgICAgICAgICAnPC9kaXY+JyArXG4gICAgICAgICAgICAgICAgJzwvZGl2PicsXG4gICAgICAgIG1vZGFsSWQsXG4gICAgICAgIGJvZHkgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnYm9keScpO1xuXG4gICAgaWYgKGJvZHlbMF0uaWQpIHtcbiAgICAgICAgbW9kYWxJZCA9IGJvZHlbMF0uaWQ7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgbW9kYWxJZCA9ICdnby1tb2RhbCc7XG4gICAgICAgIGJvZHlbMF0uaWQgPSBtb2RhbElkO1xuICAgIH1cblxuICAgIFN0cmluZ0FzTm9kZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZChtb2RhbElkKSwgdG1wbCk7XG4gICAgdGhpcy5zZXR0aW5ncy5tb2RhbE9wZW4gPSB0cnVlO1xuXG4gICAgaWYgKHRoaXMub3B0aW9ucy5zaWRlVHdvLmNvbnRlbnQgPT09IG51bGwpIHJldHVybjtcblxuICAgIGJ1aWxkQnV0dG9uKHRoaXMub3B0aW9ucy5zaWRlVHdvLmJ1dHRvbik7XG4gICAgYnVpbGRCdXR0b24odGhpcy5vcHRpb25zLnNpZGVUd28uYnV0dG9uQmFjaywgJ2JhY2snKTtcblxuICAgIGlmICh0aGlzLm9wdGlvbnMuc2xpZGVyKSB0aGlzLnNsaWRlckluaXQoJyNmcm9udC1jYXJkJyk7XG59XG5cbmZ1bmN0aW9uIGJ1aWxkRWxlbWVudChidWlsZE9wdGlvbnMpIHtcbiAgICB2YXIgY3JlYXRlRWxtLFxuICAgICAgICBwYXJlbnRFbG07XG5cbiAgICBjcmVhdGVFbG0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KGJ1aWxkT3B0aW9ucy5lbG0pO1xuICAgIGNyZWF0ZUVsbS5pZCA9IGJ1aWxkT3B0aW9ucy5idXR0b25JZDtcbiAgICBjcmVhdGVFbG0uaW5uZXJIVE1MID0gYnVpbGRPcHRpb25zLmJ1dHRvblRleHQ7XG4gICAgcGFyZW50RWxtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoYnVpbGRPcHRpb25zLnBhcmVudElkKTtcblxuICAgIHBhcmVudEVsbS5hcHBlbmRDaGlsZChjcmVhdGVFbG0pO1xufVxuXG5cbmZ1bmN0aW9uIGJ1aWxkQnV0dG9uKGVsbSkge1xuICAgIHZhciBidXR0b24sXG4gICAgICAgIGNvbXB1dGVkQnV0dG9uLFxuICAgICAgICBjb21wdXRlZEJ1dHRvbkJhY2ssXG4gICAgICAgIGZyb250Q2FyZCxcbiAgICAgICAgYmFja0NhcmQ7XG5cbiAgICBpZiAoZWxtID09PSBudWxsIHx8IGVsbSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGlmIChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbW9kYWwtYnV0dG9uLW5leHQnKSB8fCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbW9kYWwtYnV0dG9uLXByZXYnKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYnVpbGRFbGVtZW50KHtcbiAgICAgICAgICAgICAgICBlbG06ICdhJyxcbiAgICAgICAgICAgICAgICBidXR0b25JZDogJ21vZGFsLWJ1dHRvbi1uZXh0JyxcbiAgICAgICAgICAgICAgICBidXR0b25UZXh0OiAnTmV4dCBzdGVwJyxcbiAgICAgICAgICAgICAgICBwYXJlbnRJZDogJ2Zyb250LWNhcmQnXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgYnVpbGRFbGVtZW50KHtcbiAgICAgICAgICAgICAgICBlbG06ICdhJyxcbiAgICAgICAgICAgICAgICBidXR0b25JZDogJ21vZGFsLWJ1dHRvbi1wcmV2JyxcbiAgICAgICAgICAgICAgICBidXR0b25UZXh0OiAnUHJldmlvdXMgc3RlcCcsXG4gICAgICAgICAgICAgICAgcGFyZW50SWQ6ICdiYWNrLWNhcmQnXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAgIGJ1aWxkRWxlbWVudCh7XG4gICAgICAgICAgICBlbG06IGVsbS5lbGVtZW50LFxuICAgICAgICAgICAgYnV0dG9uSWQ6IGVsbS5pZCxcbiAgICAgICAgICAgIGJ1dHRvblRleHQ6IGVsbS50ZXh0LFxuICAgICAgICAgICAgcGFyZW50SWQ6IGVsbS5wYXJlbnQsXG4gICAgICAgIH0pO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gY29udGVudFR5cGUoY29udGVudFZhbHVlKSB7XG4gICAgaWYgKHR5cGVvZiBjb250ZW50VmFsdWUgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHJldHVybiBjb250ZW50VmFsdWU7XG4gICAgfSBlbHNlIGlmIChjb250ZW50VmFsdWUgPT09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuICcnO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBjb250ZW50VmFsdWUuaW5uZXJIVE1MO1xuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBNb2RhbGJsYW5jO1xuIiwiJ3VzZSBzdHJpY3QnO1xuLyoganNoaW50IG5vZGU6IHRydWUgKi9cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihzb3VyY2UsIHByb3BlcnRpZXMpIHtcbiAgICB2YXIgcHJvcGVydHk7XG4gICAgZm9yIChwcm9wZXJ0eSBpbiBwcm9wZXJ0aWVzKSB7XG4gICAgICAgIGlmIChwcm9wZXJ0aWVzLmhhc093blByb3BlcnR5KHByb3BlcnR5KSkge1xuICAgICAgICAgICAgc291cmNlW3Byb3BlcnR5XSA9IHByb3BlcnRpZXNbcHJvcGVydHldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBzb3VyY2U7XG59OyIsIid1c2Ugc3RyaWN0Jztcbi8qIGpzaGludCBub2RlOiB0cnVlICovXG5cbnZhciBFeHRlbmREZWZhdWx0ID0gcmVxdWlyZSgnLi9leHRlbmRfZGVmYXVsdCcpO1xudmFyIFN0cmluZ0FzTm9kZSA9IHJlcXVpcmUoJy4vc3RyaW5nX2FzX25vZGUnKTtcblxudmFyIEltYWdlU2xpZGVyID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIEltYWdlU2xpZGVyKSkge1xuICAgICAgICByZXR1cm4gbmV3IEltYWdlU2xpZGVyKCk7XG4gICAgfVxuXG4gICAgdmFyIGRlZmF1bHRzID0ge1xuICAgICAgICBzZWxlY3RvcjogJy5zbGlkZXMnLFxuICAgICAgICB0cmFuc2l0aW9uOiAnZmFkZS1zbGlkZScsXG4gICAgICAgIGF1dG9QbGF5OiBmYWxzZVxuICAgIH07XG5cbiAgICBpZiAoYXJndW1lbnRzWzBdICYmIHR5cGVvZiBhcmd1bWVudHNbMF0gPT09ICdvYmplY3QnKSB7XG4gICAgICAgIHRoaXMub3B0aW9ucyA9IEV4dGVuZERlZmF1bHQoZGVmYXVsdHMsIGFyZ3VtZW50c1swXSk7XG4gICAgfVxuXG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIHRoaXMuY3VycmVudFNsaWRlID0gMDtcbiAgICB0aGlzLnBsYXlpbmcgPSB0cnVlO1xuXG4gICAgdGhpcy5faW5pdCgpO1xuICAgIC8vIHRoaXMubmV4dFNsaWRlKClcbiAgICB0aGlzLnNsaWRlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5pbWFnZS1zbGlkZXItaG9sZGVyIC5pbWFnZS1zbGlkZXInKTtcbiAgICB0aGlzLnNldFNsaWRlKCk7XG4gICAgdGhpcy5wbGF5KCk7XG59O1xuXG5JbWFnZVNsaWRlci5wcm90b3R5cGUuX2luaXQgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmNyZWF0ZVNsaWRlcygpO1xuICAgIHNldEV2ZW50cy5jYWxsKHRoaXMpO1xufTtcblxuSW1hZ2VTbGlkZXIucHJvdG90eXBlLmNyZWF0ZVNsaWRlcyA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuc2xpZGVzID0gW107XG4gICAgdmFyIHNsaWRlcyxcbiAgICAgICAgaW1hZ2VzID0gdGhpcy5vcHRpb25zLnNlbGVjdG9yO1xuXG4gICAgaWYgKGltYWdlcyBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgIHNsaWRlcyA9IGltYWdlcztcbiAgICB9IGVsc2Uge1xuICAgICAgICBzbGlkZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHRoaXMub3B0aW9ucy5zZWxlY3RvciArICcgaW1nJyk7XG4gICAgfVxuXG5cbiAgICB2YXIgcGFyZW50RWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRoaXMub3B0aW9ucy5wYXJlbnQpLFxuICAgICAgICBjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd1bCcpLFxuICAgICAgICBzbGlkZUltZyxcbiAgICAgICAgc2xpZGVyRWxtLFxuICAgICAgICBpbWdFbG07XG5cbiAgICBjb250YWluZXIuY2xhc3NOYW1lID0gJ2ltYWdlLXNsaWRlci1ob2xkZXInO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzbGlkZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKHNsaWRlc1tpXS5zcmMpIHtcbiAgICAgICAgICAgIHNsaWRlSW1nID0gc2xpZGVzW2ldLnNyYztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNsaWRlSW1nID0gc2xpZGVzW2ldO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zbGlkZXMucHVzaCh7XG4gICAgICAgICAgICBpbmRleDogaSxcbiAgICAgICAgICAgIGVsOiBzbGlkZXNbaV0sXG4gICAgICAgICAgICBpbWFnZXM6IHNsaWRlSW1nXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHNsaWRlckVsbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XG4gICAgICAgIHNsaWRlckVsbS5jbGFzc05hbWUgPSAnaW1hZ2Utc2xpZGVyJztcblxuICAgICAgICBpbWdFbG0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKTtcbiAgICAgICAgaW1nRWxtLnNyYyA9IHNsaWRlSW1nO1xuXG4gICAgICAgIHNsaWRlckVsbS5hcHBlbmRDaGlsZChpbWdFbG0pO1xuICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoc2xpZGVyRWxtKTtcbiAgICAgICAgcGFyZW50RWwuYXBwZW5kQ2hpbGQoY29udGFpbmVyKTtcbiAgICB9XG5cbiAgICB0aGlzLnBhdXNlQnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgIHRoaXMucGF1c2VCdG4uaWQgPSAncGF1c2UtYnRuJztcbiAgICB0aGlzLnBhdXNlQnRuLmlubmVySFRNTCA9ICdwYXVzZSc7XG4gICAgY29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMucGF1c2VCdG4pO1xufTtcblxuSW1hZ2VTbGlkZXIucHJvdG90eXBlLnNldFNsaWRlID0gZnVuY3Rpb24oKSB7XG4gICAgLy8gc2V0IHRoZSBzbGlkZXIgd2l0aCBpbWFnZSBzbGlkZXIgZWxlbWVudHMuXG4gICAgdmFyIGZpcnN0ID0gdGhpcy5zbGlkZXJbMF07XG4gICAgZmlyc3QuY2xhc3NMaXN0LmFkZCgnaXMtc2hvd2luZycpO1xufVxuXG5mdW5jdGlvbiBzZXRFdmVudHMoKSB7XG4gICAgdmFyIHBhdXNlQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhdXNlLWJ0bicpLFxuICAgICAgICBfdGhpcyA9IHRoaXM7O1xuXG4gICAgcGF1c2VCdXR0b24ub25jbGljayA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBkZWJ1Z2dlclxuICAgICAgICBpZiAoX3RoaXMucGxheWluZykge1xuICAgICAgICAgICAgX3RoaXMucGF1c2UoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIF90aGlzLnBsYXkoKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuSW1hZ2VTbGlkZXIucHJvdG90eXBlLm5leHRTbGlkZSA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBzbGlkZXMgPSB0aGlzLnNsaWRlcjtcblxuICAgIHNsaWRlc1t0aGlzLmN1cnJlbnRTbGlkZV0uY2xhc3NOYW1lID0gJ2ltYWdlLXNsaWRlcic7XG4gICAgdGhpcy5jdXJyZW50U2xpZGUgPSAodGhpcy5jdXJyZW50U2xpZGUgKyAxKSAlIHNsaWRlcy5sZW5ndGg7XG4gICAgc2xpZGVzW3RoaXMuY3VycmVudFNsaWRlXS5jbGFzc05hbWUgPSAnaW1hZ2Utc2xpZGVyIGlzLXNob3dpbmcnO1xufVxuXG5JbWFnZVNsaWRlci5wcm90b3R5cGUucGF1c2UgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnBhdXNlQnRuLmlubmVySFRNTCA9ICdwbGF5JztcbiAgICB0aGlzLnBsYXlpbmcgPSBmYWxzZTtcbiAgICBjbGVhckludGVydmFsKHRoaXMuc2xpZGVJbnRlcnZhbCk7XG59XG5cbkltYWdlU2xpZGVyLnByb3RvdHlwZS5wbGF5ID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIHRoaXMucGF1c2VCdG4uaW5uZXJIVE1MID0gJ3BhdXNlJztcbiAgICB0aGlzLnBsYXlpbmcgPSB0cnVlO1xuICAgIHRoaXMuc2xpZGVJbnRlcnZhbCA9IHNldEludGVydmFsKGZ1bmN0aW9uKCkge1xuICAgICAgICBfdGhpcy5uZXh0U2xpZGUoKTtcbiAgICB9LCAyMDAwKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBJbWFnZVNsaWRlcjtcbiIsIid1c2Ugc3RyaWN0Jztcbi8qIGpzaGludCBub2RlOiB0cnVlICovXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZWxlbWVudCwgaHRtbCkge1xuICAgIGlmIChodG1sID09PSBudWxsKSByZXR1cm47XG5cbiAgICB2YXIgZnJhZyA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKSxcbiAgICAgICAgdG1wID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYm9keScpLFxuICAgICAgICBjaGlsZDtcblxuICAgIHRtcC5pbm5lckhUTUwgPSBodG1sO1xuXG4gICAgd2hpbGUgKGNoaWxkID0gdG1wLmZpcnN0Q2hpbGQpIHtcbiAgICAgICAgZnJhZy5hcHBlbmRDaGlsZChjaGlsZCk7XG4gICAgfVxuXG4gICAgZWxlbWVudC5hcHBlbmRDaGlsZChmcmFnKTtcbiAgICBmcmFnID0gdG1wID0gbnVsbDtcbn07Il19
