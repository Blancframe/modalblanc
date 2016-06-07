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

    var tmpl = '<div id="overlay-modal-blanc" class="modal-fullscreen-background' + ' ' +  this.options.animation + ' ' + 'is-active">' +
                    '<div id="modal-fullscreen-container"class="modal-fullscreen-container big-modal">' +
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

    var slides = document.querySelectorAll(this.options.selector + ' img'),
        parentEl = document.querySelector(this.options.parent),
        container = document.createElement('ul'),
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJpbmRleC5qcyIsImxpYi9leHRlbmRfZGVmYXVsdC5qcyIsImxpYi9pbWFnZV9zbGlkZXIuanMiLCJsaWIvc3RyaW5nX2FzX25vZGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDalFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIid1c2Ugc3RyaWN0Jztcbi8qIGpzaGludCBub2RlOiB0cnVlICovXG5cbnZhciBFeHRlbmREZWZhdWx0ID0gcmVxdWlyZSgnLi9saWIvZXh0ZW5kX2RlZmF1bHQnKTtcbnZhciBJbWFnZVNsaWRlciA9IHJlcXVpcmUoJy4vbGliL2ltYWdlX3NsaWRlcicpO1xudmFyIFN0cmluZ0FzTm9kZSA9IHJlcXVpcmUoJy4vbGliL3N0cmluZ19hc19ub2RlJyk7XG5cblxudmFyIE1vZGFsYmxhbmMgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIE1vZGFsYmxhbmMpKSB7XG4gICAgICByZXR1cm4gbmV3IE1vZGFsYmxhbmMoKTtcbiAgICB9XG5cbiAgICB0aGlzLmNsb3NlQnV0dG9uID0gbnVsbDtcbiAgICB0aGlzLm92ZXJsYXkgPSBudWxsO1xuXG4gICAgdmFyIGRlZmF1bHRzID0ge1xuICAgICAgICBhbmltYXRpb246ICdmYWRlLWluLW91dCcsXG4gICAgICAgIGNsb3NlQnV0dG9uOiB0cnVlLFxuICAgICAgICBjb250ZW50OiAnJyxcbiAgICAgICAgc2xpZGVyOiBudWxsLFxuICAgICAgICBzaWRlVHdvOiB7XG4gICAgICAgICAgICBjb250ZW50OiBudWxsLFxuICAgICAgICAgICAgYW5pbWF0aW9uOiBudWxsLFxuICAgICAgICAgICAgYnV0dG9uOiBudWxsLFxuICAgICAgICAgICAgYnV0dG9uQmFjazogbnVsbFxuICAgICAgICB9LFxuICAgICAgfTtcblxuICAgIHRoaXMuc2V0dGluZ3MgPSB7fTtcblxuICAgIGlmIChhcmd1bWVudHNbMF0gJiYgdHlwZW9mIGFyZ3VtZW50c1swXSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgdGhpcy5vcHRpb25zID0gRXh0ZW5kRGVmYXVsdChkZWZhdWx0cywgYXJndW1lbnRzWzBdKTtcbiAgICB9XG5cbn07XG5cbk1vZGFsYmxhbmMucHJvdG90eXBlLm9wZW4gPSBmdW5jdGlvbigpIHtcbiAgICBpZiAodGhpcy5zZXR0aW5ncy5tb2RhbE9wZW4pIHJldHVybjtcblxuICAgIGJ1aWxkLmNhbGwodGhpcyk7XG4gICAgc2V0RXZlbnRzLmNhbGwodGhpcyk7XG59O1xuXG5Nb2RhbGJsYW5jLnByb3RvdHlwZS5jbG9zZSA9IGZ1bmN0aW9uKCkge1xuICAgIGlmICghdGhpcy5zZXR0aW5ncy5tb2RhbE9wZW4pIHJldHVybjtcblxuICAgIHZhciBvdmVybGF5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ292ZXJsYXktbW9kYWwtYmxhbmMnKSxcbiAgICAgICAgX3RoaXMgPSB0aGlzO1xuXG4gICAgb3ZlcmxheS5jbGFzc0xpc3QucmVtb3ZlKCdpcy1hY3RpdmUnKTtcbiAgICBvdmVybGF5LmNsYXNzTGlzdC5hZGQoJ2lzLWluYWN0aXZlJyk7XG5cbiAgICB2YXIgdHJhbnNQcmVmaXggPSB0cmFuc2l0aW9uUHJlZml4KG92ZXJsYXkpO1xuXG4gICAgb3ZlcmxheS5hZGRFdmVudExpc3RlbmVyKHRyYW5zUHJlZml4LmVuZCwgZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMucmVtb3ZlKCk7XG4gICAgICAgIF90aGlzLnNldHRpbmdzLm1vZGFsT3BlbiA9IGZhbHNlO1xuICAgIH0sIGZhbHNlKTtcbn07XG5cbk1vZGFsYmxhbmMucHJvdG90eXBlLnNsaWRlckluaXQgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAodGhpcy5vcHRpb25zLnNsaWRlciAhPT0gbnVsbCkge1xuICAgICAgICB0aGlzLnNldHRpbmdzLnNsaWRlciA9IHRydWU7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuc2V0dGluZ3Muc2xpZGVyKSB7XG4gICAgICAgIHRoaXMub3BlbigpO1xuICAgICAgICB2YXIgc2xpZGVyID0gbmV3IEltYWdlU2xpZGVyKHtcbiAgICAgICAgICAgIHNlbGVjdG9yOiB0aGlzLm9wdGlvbnMuc2xpZGVyLFxuICAgICAgICAgICAgcGFyZW50OiAnI2Zyb250LWNhcmQnXG4gICAgICAgIH0pO1xuICAgIH1cbn07XG5cbk1vZGFsYmxhbmMucHJvdG90eXBlLl9jb250ZW50TmV4dCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBjYXJkID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NhcmQnKSxcbiAgICAgICAgY3VzdG9tQ2xhc3MgPSB0aGlzLm9wdGlvbnMuc2lkZVR3by5hbmltYXRpb247XG5cbiAgICBjYXJkLmNsYXNzTGlzdC5yZW1vdmUodHlwZU9mQW5pbWF0aW9uKGN1c3RvbUNsYXNzLCAyKSk7XG4gICAgY2FyZC5jbGFzc0xpc3QuYWRkKHR5cGVPZkFuaW1hdGlvbihjdXN0b21DbGFzcykpO1xufTtcblxuTW9kYWxibGFuYy5wcm90b3R5cGUuX2NvbnRlbnRQcmV2aW91cyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBjYXJkID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NhcmQnKSxcbiAgICAgICAgY3VzdG9tQ2xhc3MgPSB0aGlzLm9wdGlvbnMuc2lkZVR3by5hbmltYXRpb247XG5cbiAgICBjYXJkLmNsYXNzTGlzdC5yZW1vdmUodHlwZU9mQW5pbWF0aW9uKGN1c3RvbUNsYXNzKSk7XG4gICAgY2FyZC5jbGFzc0xpc3QuYWRkKHR5cGVPZkFuaW1hdGlvbihjdXN0b21DbGFzcywgMikpO1xufTtcblxuTW9kYWxibGFuYy5wcm90b3R5cGUuY2xhc3NFdmVudExpc3RlbmVyID0gZnVuY3Rpb24oZWxtLCBjYWxsYmFjaykge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGVsbS5sZW5ndGg7IGkrKykge1xuICAgICAgICBlbG1baV0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgIH0pO1xuICAgIH1cbn07XG5cbmZ1bmN0aW9uIHR5cGVPZkFuaW1hdGlvbih0eXBlLCB0eXBlQ2xhc3MpIHtcbiAgICB2YXIgYW5pbWF0aW9uVHlwZXMgPSB7XG4gICAgICAgICAgICAnc2xpZGUnOiBbJ3NsaWRlLW5leHQnLCAnc2xpZGUtYmFjayddLFxuICAgICAgICAgICAgJ3NjYWxlJzogWydzY2FsZS1uZXh0JywgJ3NjYWxlLWJhY2snXVxuICAgICAgICB9LFxuICAgICAgICBhbmltYXRpb25DbGFzcyA9IGFuaW1hdGlvblR5cGVzW3R5cGVdO1xuXG4gICAgICAgIGlmICh0eXBlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGlmICh0eXBlQ2xhc3MgPT09IDIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYW5pbWF0aW9uVHlwZXMuc2xpZGVbMV07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBhbmltYXRpb25UeXBlcy5zbGlkZVswXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICh0eXBlQ2xhc3MgPT09IDIpIHtcbiAgICAgICAgICAgIHJldHVybiBhbmltYXRpb25DbGFzc1sxXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBhbmltYXRpb25DbGFzc1swXTtcbiAgICAgICAgfVxufVxuXG5mdW5jdGlvbiB0cmFuc2l0aW9uUHJlZml4KGVsbSkge1xuICAgIHZhciB0cmFuc0VuZEV2ZW50TmFtZXMgPSB7XG4gICAgICAgICdXZWJraXRUcmFuc2l0aW9uJyA6ICd3ZWJraXRUcmFuc2l0aW9uRW5kJyxcbiAgICAgICAgJ01velRyYW5zaXRpb24nICAgIDogJ3RyYW5zaXRpb25lbmQnLFxuICAgICAgICAnT1RyYW5zaXRpb24nICAgICAgOiAnb1RyYW5zaXRpb25FbmQgb3RyYW5zaXRpb25lbmQnLFxuICAgICAgICAndHJhbnNpdGlvbicgICAgICAgOiAndHJhbnNpdGlvbmVuZCdcbiAgICB9O1xuXG4gICAgZm9yICh2YXIgbmFtZSBpbiB0cmFuc0VuZEV2ZW50TmFtZXMpIHtcbiAgICAgIGlmIChlbG0uc3R5bGVbbmFtZV0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZW5kOiB0cmFuc0VuZEV2ZW50TmFtZXNbbmFtZV1cbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9XG59XG5cbmZ1bmN0aW9uIHNldEV2ZW50cygpIHtcbiAgICB2YXIgbmV4dEJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtb2RhbC1idXR0b24tbmV4dCcpLFxuICAgICAgICBwcmV2QnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21vZGFsLWJ1dHRvbi1wcmV2JyksXG4gICAgICAgIGNsb3NlZCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ21vZGFsLWZ1bGxzY3JlZW4tY2xvc2UnKSxcbiAgICAgICAgX3RoaXMgPSB0aGlzO1xuXG4gICAgdGhpcy5jbGFzc0V2ZW50TGlzdGVuZXIoY2xvc2VkLCBmdW5jdGlvbigpIHtcbiAgICAgICAgX3RoaXMuY2xvc2UoKTtcbiAgICB9KTtcblxuICAgIGlmICh0aGlzLm9wdGlvbnMuc2lkZVR3by5jb250ZW50ID09PSBudWxsKSByZXR1cm47XG5cbiAgICBuZXh0QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5fY29udGVudE5leHQuYmluZCh0aGlzKSk7XG4gICAgcHJldkJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuX2NvbnRlbnRQcmV2aW91cy5iaW5kKHRoaXMpKTtcbn1cblxuZnVuY3Rpb24gYnVpbGQoKSB7XG4gICAgaWYgKHRoaXMub3B0aW9ucy5jbG9zZUJ1dHRvbiA9PT0gdHJ1ZSkge1xuICAgICAgICB0aGlzLmNsb3NlQnV0dG9uID0gJzxzcGFuIGNsYXNzPVwibW9kYWwtZnVsbHNjcmVlbi1jbG9zZVwiPlg8L3NwYW4+JztcbiAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmNsb3NlQnV0dG9uID0gJyc7XG4gICAgfVxuXG4gICAgdmFyIHRtcGwgPSAnPGRpdiBpZD1cIm92ZXJsYXktbW9kYWwtYmxhbmNcIiBjbGFzcz1cIm1vZGFsLWZ1bGxzY3JlZW4tYmFja2dyb3VuZCcgKyAnICcgKyAgdGhpcy5vcHRpb25zLmFuaW1hdGlvbiArICcgJyArICdpcy1hY3RpdmVcIj4nICtcbiAgICAgICAgICAgICAgICAgICAgJzxkaXYgaWQ9XCJtb2RhbC1mdWxsc2NyZWVuLWNvbnRhaW5lclwiY2xhc3M9XCJtb2RhbC1mdWxsc2NyZWVuLWNvbnRhaW5lciBiaWctbW9kYWxcIj4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICc8ZGl2IGlkPVwiY2FyZFwiPicrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJmcm9udFwiPicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPGRpdiBpZD1cImZyb250LWNhcmRcIiBjbGFzcz1cIm1vZGFsLWZ1bGxzY3JlZW4taXRlbVwiPicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jbG9zZUJ1dHRvbiArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50VHlwZSh0aGlzLm9wdGlvbnMuY29udGVudCkgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPC9kaXY+JytcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPC9kaXY+JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJiYWNrXCI+JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8ZGl2ICBpZD1cImJhY2stY2FyZFwiIGNsYXNzPVwibW9kYWwtZnVsbHNjcmVlbi1pdGVtXCI+JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNsb3NlQnV0dG9uICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnRUeXBlKHRoaXMub3B0aW9ucy5zaWRlVHdvLmNvbnRlbnQpICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJzwvZGl2PicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8L2Rpdj4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICc8L2Rpdj4nICtcbiAgICAgICAgICAgICAgICAgICAgJzwvZGl2PicgK1xuICAgICAgICAgICAgICAgICc8L2Rpdj4nLFxuICAgICAgICBtb2RhbElkLFxuICAgICAgICBib2R5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2JvZHknKTtcblxuICAgIGlmIChib2R5WzBdLmlkKSB7XG4gICAgICAgIG1vZGFsSWQgPSBib2R5WzBdLmlkO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIG1vZGFsSWQgPSAnZ28tbW9kYWwnO1xuICAgICAgICBib2R5WzBdLmlkID0gbW9kYWxJZDtcbiAgICB9XG5cbiAgICBTdHJpbmdBc05vZGUoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQobW9kYWxJZCksIHRtcGwpO1xuICAgIHRoaXMuc2V0dGluZ3MubW9kYWxPcGVuID0gdHJ1ZTtcblxuICAgIGlmICh0aGlzLm9wdGlvbnMuc2lkZVR3by5jb250ZW50ID09PSBudWxsKSByZXR1cm47XG5cbiAgICBidWlsZEJ1dHRvbih0aGlzLm9wdGlvbnMuc2lkZVR3by5idXR0b24pO1xuICAgIGJ1aWxkQnV0dG9uKHRoaXMub3B0aW9ucy5zaWRlVHdvLmJ1dHRvbkJhY2ssICdiYWNrJyk7XG59XG5cbmZ1bmN0aW9uIGJ1aWxkRWxlbWVudChidWlsZE9wdGlvbnMpIHtcbiAgICB2YXIgY3JlYXRlRWxtLFxuICAgICAgICBwYXJlbnRFbG07XG5cbiAgICBjcmVhdGVFbG0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KGJ1aWxkT3B0aW9ucy5lbG0pO1xuICAgIGNyZWF0ZUVsbS5pZCA9IGJ1aWxkT3B0aW9ucy5idXR0b25JZDtcbiAgICBjcmVhdGVFbG0uaW5uZXJIVE1MID0gYnVpbGRPcHRpb25zLmJ1dHRvblRleHQ7XG4gICAgcGFyZW50RWxtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoYnVpbGRPcHRpb25zLnBhcmVudElkKTtcblxuICAgIHBhcmVudEVsbS5hcHBlbmRDaGlsZChjcmVhdGVFbG0pO1xufVxuXG5cbmZ1bmN0aW9uIGJ1aWxkQnV0dG9uKGVsbSkge1xuICAgIHZhciBidXR0b24sXG4gICAgICAgIGNvbXB1dGVkQnV0dG9uLFxuICAgICAgICBjb21wdXRlZEJ1dHRvbkJhY2ssXG4gICAgICAgIGZyb250Q2FyZCxcbiAgICAgICAgYmFja0NhcmQ7XG5cbiAgICBpZiAoZWxtID09PSBudWxsIHx8IGVsbSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGlmIChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbW9kYWwtYnV0dG9uLW5leHQnKSB8fCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbW9kYWwtYnV0dG9uLXByZXYnKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYnVpbGRFbGVtZW50KHtcbiAgICAgICAgICAgICAgICBlbG06ICdhJyxcbiAgICAgICAgICAgICAgICBidXR0b25JZDogJ21vZGFsLWJ1dHRvbi1uZXh0JyxcbiAgICAgICAgICAgICAgICBidXR0b25UZXh0OiAnTmV4dCBzdGVwJyxcbiAgICAgICAgICAgICAgICBwYXJlbnRJZDogJ2Zyb250LWNhcmQnXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgYnVpbGRFbGVtZW50KHtcbiAgICAgICAgICAgICAgICBlbG06ICdhJyxcbiAgICAgICAgICAgICAgICBidXR0b25JZDogJ21vZGFsLWJ1dHRvbi1wcmV2JyxcbiAgICAgICAgICAgICAgICBidXR0b25UZXh0OiAnUHJldmlvdXMgc3RlcCcsXG4gICAgICAgICAgICAgICAgcGFyZW50SWQ6ICdiYWNrLWNhcmQnXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAgIGJ1aWxkRWxlbWVudCh7XG4gICAgICAgICAgICBlbG06IGVsbS5lbGVtZW50LFxuICAgICAgICAgICAgYnV0dG9uSWQ6IGVsbS5pZCxcbiAgICAgICAgICAgIGJ1dHRvblRleHQ6IGVsbS50ZXh0LFxuICAgICAgICAgICAgcGFyZW50SWQ6IGVsbS5wYXJlbnQsXG4gICAgICAgIH0pO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gY29udGVudFR5cGUoY29udGVudFZhbHVlKSB7XG4gICAgaWYgKHR5cGVvZiBjb250ZW50VmFsdWUgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHJldHVybiBjb250ZW50VmFsdWU7XG4gICAgfSBlbHNlIGlmIChjb250ZW50VmFsdWUgPT09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuICcnO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBjb250ZW50VmFsdWUuaW5uZXJIVE1MO1xuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBNb2RhbGJsYW5jO1xuIiwiJ3VzZSBzdHJpY3QnO1xuLyoganNoaW50IG5vZGU6IHRydWUgKi9cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihzb3VyY2UsIHByb3BlcnRpZXMpIHtcbiAgICB2YXIgcHJvcGVydHk7XG4gICAgZm9yIChwcm9wZXJ0eSBpbiBwcm9wZXJ0aWVzKSB7XG4gICAgICAgIGlmIChwcm9wZXJ0aWVzLmhhc093blByb3BlcnR5KHByb3BlcnR5KSkge1xuICAgICAgICAgICAgc291cmNlW3Byb3BlcnR5XSA9IHByb3BlcnRpZXNbcHJvcGVydHldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBzb3VyY2U7XG59OyIsIid1c2Ugc3RyaWN0Jztcbi8qIGpzaGludCBub2RlOiB0cnVlICovXG5cbnZhciBFeHRlbmREZWZhdWx0ID0gcmVxdWlyZSgnLi9leHRlbmRfZGVmYXVsdCcpO1xudmFyIFN0cmluZ0FzTm9kZSA9IHJlcXVpcmUoJy4vc3RyaW5nX2FzX25vZGUnKTtcblxudmFyIEltYWdlU2xpZGVyID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIEltYWdlU2xpZGVyKSkge1xuICAgICAgICByZXR1cm4gbmV3IEltYWdlU2xpZGVyKCk7XG4gICAgfVxuXG4gICAgdmFyIGRlZmF1bHRzID0ge1xuICAgICAgICBzZWxlY3RvcjogJy5zbGlkZXMnLFxuICAgICAgICB0cmFuc2l0aW9uOiAnZmFkZS1zbGlkZScsXG4gICAgICAgIGF1dG9QbGF5OiBmYWxzZVxuICAgIH07XG5cbiAgICBpZiAoYXJndW1lbnRzWzBdICYmIHR5cGVvZiBhcmd1bWVudHNbMF0gPT09ICdvYmplY3QnKSB7XG4gICAgICAgIHRoaXMub3B0aW9ucyA9IEV4dGVuZERlZmF1bHQoZGVmYXVsdHMsIGFyZ3VtZW50c1swXSk7XG4gICAgfVxuXG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIHRoaXMuY3VycmVudFNsaWRlID0gMDtcblxuICAgIHRoaXMuX2luaXQoKTtcbiAgICAvLyB0aGlzLm5leHRTbGlkZSgpXG4gICAgdGhpcy5zbGlkZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuaW1hZ2Utc2xpZGVyLWhvbGRlciAuaW1hZ2Utc2xpZGVyJyk7XG4gICAgdGhpcy5zZXRTbGlkZSgpO1xuXG4gICAgdGhpcy5zbGlkZUludGVydmFsID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKSB7XG4gICAgICAgIF90aGlzLm5leHRTbGlkZSgpO1xuICAgIH0sIDIwMDApO1xufTtcblxuSW1hZ2VTbGlkZXIucHJvdG90eXBlLl9pbml0ID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5jcmVhdGVTbGlkZXMoKTtcbn07XG5cbkltYWdlU2xpZGVyLnByb3RvdHlwZS5jcmVhdGVTbGlkZXMgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnNsaWRlcyA9IFtdO1xuXG4gICAgdmFyIHNsaWRlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwodGhpcy5vcHRpb25zLnNlbGVjdG9yICsgJyBpbWcnKSxcbiAgICAgICAgcGFyZW50RWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRoaXMub3B0aW9ucy5wYXJlbnQpLFxuICAgICAgICBjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd1bCcpLFxuICAgICAgICBzbGlkZUltZyxcbiAgICAgICAgc2xpZGVyRWxtLFxuICAgICAgICBpbWdFbG07XG5cbiAgICBjb250YWluZXIuY2xhc3NOYW1lID0gJ2ltYWdlLXNsaWRlci1ob2xkZXInO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzbGlkZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgLy8gaGlkZSBhbFxuICAgICAgICAvLyBzbGlkZXNbaV0uc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgc2xpZGVJbWcgPSBzbGlkZXNbaV0uc3JjO1xuXG4gICAgICAgIHRoaXMuc2xpZGVzLnB1c2goe1xuICAgICAgICAgICAgaW5kZXg6IGksXG4gICAgICAgICAgICBlbDogc2xpZGVzW2ldLFxuICAgICAgICAgICAgaW1hZ2VzOiBzbGlkZUltZ1xuICAgICAgICB9KTtcblxuICAgICAgICBzbGlkZXJFbG0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xuICAgICAgICBzbGlkZXJFbG0uY2xhc3NOYW1lID0gJ2ltYWdlLXNsaWRlcic7XG5cbiAgICAgICAgaW1nRWxtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XG4gICAgICAgIGltZ0VsbS5zcmMgPSBzbGlkZUltZztcblxuICAgICAgICBzbGlkZXJFbG0uYXBwZW5kQ2hpbGQoaW1nRWxtKTtcbiAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKHNsaWRlckVsbSk7XG4gICAgICAgIHBhcmVudEVsLmFwcGVuZENoaWxkKGNvbnRhaW5lcik7XG4gICAgfVxufTtcblxuSW1hZ2VTbGlkZXIucHJvdG90eXBlLnNldFNsaWRlID0gZnVuY3Rpb24oKSB7XG4gICAgLy8gc2V0IHRoZSBzbGlkZXIgd2l0aCBpbWFnZSBzbGlkZXIgZWxlbWVudHMuXG4gICAgdmFyIGZpcnN0ID0gdGhpcy5zbGlkZXJbMF07XG4gICAgZmlyc3QuY2xhc3NMaXN0LmFkZCgnaXMtc2hvd2luZycpO1xufVxuXG5JbWFnZVNsaWRlci5wcm90b3R5cGUubmV4dFNsaWRlID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHNsaWRlcyA9IHRoaXMuc2xpZGVyO1xuXG4gICAgc2xpZGVzW3RoaXMuY3VycmVudFNsaWRlXS5jbGFzc05hbWUgPSAnaW1hZ2Utc2xpZGVyJztcbiAgICB0aGlzLmN1cnJlbnRTbGlkZSA9ICh0aGlzLmN1cnJlbnRTbGlkZSArIDEpICUgc2xpZGVzLmxlbmd0aDtcbiAgICBzbGlkZXNbdGhpcy5jdXJyZW50U2xpZGVdLmNsYXNzTmFtZSA9ICdpbWFnZS1zbGlkZXIgaXMtc2hvd2luZyc7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gSW1hZ2VTbGlkZXI7XG4iLCIndXNlIHN0cmljdCc7XG4vKiBqc2hpbnQgbm9kZTogdHJ1ZSAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGVsZW1lbnQsIGh0bWwpIHtcbiAgICBpZiAoaHRtbCA9PT0gbnVsbCkgcmV0dXJuO1xuXG4gICAgdmFyIGZyYWcgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCksXG4gICAgICAgIHRtcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2JvZHknKSxcbiAgICAgICAgY2hpbGQ7XG5cbiAgICB0bXAuaW5uZXJIVE1MID0gaHRtbDtcblxuICAgIHdoaWxlIChjaGlsZCA9IHRtcC5maXJzdENoaWxkKSB7XG4gICAgICAgIGZyYWcuYXBwZW5kQ2hpbGQoY2hpbGQpO1xuICAgIH1cblxuICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQoZnJhZyk7XG4gICAgZnJhZyA9IHRtcCA9IG51bGw7XG59OyJdfQ==
