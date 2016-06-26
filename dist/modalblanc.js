(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Modalblanc = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';
/* jshint node: true */

var ExtendDefault = require('./lib/extend_default');
var ImageSlider = require('./lib/image_slider');
var StringAsNode = require('./lib/string_as_node');
var Template = require('./lib/template-engine');


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

    this.hasSlider = this.hasSlider ? true : false;
    this.sliderIsOpen = false;
    this.modalContainer = document.getElementsByClassName('modal-fullscreen-container');

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
        this.hasSlider = true;
    }

    if (this.hasSlider) {
        this.open();
        this.sliderIsOpen = true;

        this.slider = new ImageSlider({
            parent: side,
            selector: this.options.slider
        });
    }
};

Modalblanc.prototype._contentNext = function() {
    if (this.hasSlider) {
        this.sliderIsOpen = false;
        if (this.slider.playing) this.slider.pause();
        removeClass(this.modalContainer, 'slider-modal');
        addClass(this.modalContainer, 'big-modal');
    }

    var card = document.getElementById('card'),
        customClass = this.options.sideTwo.animation;

    card.classList.remove(typeOfAnimation(customClass, 2));
    card.classList.add(typeOfAnimation(customClass));
};

Modalblanc.prototype._contentPrevious = function() {
    if (this.hasSlider) {
        // if (!this.slider.playing) this.slider.play();
        removeClass(this.modalContainer, 'big-modal');
        addClass(this.modalContainer, 'slider-modal');
    }

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
    if (this.options.closeButton) this.closeButton = '<span class="modal-fullscreen-close">X</span>';

    var contentSideOne = !this.options.slider ? contentType(this.options.content) : contentType('<div id="modal-slider"></div>');

    var typeModal = this.options.slider ? 'slider-modal' : 'big-modal';
    var modal = '<div id="overlay-modal-blanc" class="modal-fullscreen-background <%this.animation%> <%this.state%>">' +
                    '<div id="modal-fullscreen-container"class="modal-fullscreen-container <%this.type%> ">' +
                        '<div id="card">'+
                            '<div class="front">' +
                                '<div id="front-card" class="modal-fullscreen-item">'+
                                    '<%this.closeButton%>' +
                                    '<%this.contentTypeSideOne%>' +
                                '</div>'+
                            '</div>' +
                            '<div class="back">' +
                                '<div  id="back-card" class="modal-fullscreen-item">' +
                                    '<%this.closeButton%>' +
                                    '<%this.contentTypeSideTwo%>' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                '</div>';

    var modalTemplate = Template(modal, {
        animation: this.options.animation,
        state: 'is-active',
        type: typeModal,
        closeButton: this.closeButton,
        contentTypeSideOne: contentSideOne,
        contentTypeSideTwo: contentType(this.options.sideTwo.content)
    });

    var body = document.getElementsByTagName('body'),
        modalId;

    if (body[0].id) {
        modalId = body[0].id;
    } else {
        modalId = 'go-modal';
        body[0].id = modalId;
    }

    StringAsNode(document.getElementById(modalId), modalTemplate);
    this.settings.modalOpen = true;

    if (this.options.slider) this.sliderInit('#modal-slider');

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

function addClass(selector, className) {
    selector[0].classList.add(className)
}

function removeClass(selector, className) {
    selector[0].classList.remove(className)
}
module.exports = Modalblanc;

},{"./lib/extend_default":2,"./lib/image_slider":3,"./lib/string_as_node":4,"./lib/template-engine":5}],2:[function(require,module,exports){
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
    this.playing;

    this._init();
    // this.nextSlide()
    this.slider = document.querySelectorAll('.image-slider-holder .image-slider');
    this.setSlide();

    if (this.options.autoPlay) {
        this.play();
    }
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
        container = document.createElement('div'),
        slider = document.createElement('ul'),
        slideImg,
        sliderElm,
        imgElm;

    container.className = 'image-slider-container';
    slider.className = 'image-slider-holder';

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
        slider.appendChild(sliderElm);
        container.appendChild(slider);
        parentEl.appendChild(container);
    }

    this.playBtn = document.createElement('span');
    this.playBtn.id = 'play-btn';
    slider.appendChild(this.playBtn);

    this.previousBtn = document.createElement('span');
    this.previousBtn.id = 'previous-btn';
    slider.appendChild(this.previousBtn);

    this.nextBtn = document.createElement('span');
    this.nextBtn.id = 'next-btn';
    slider.appendChild(this.nextBtn);
};

ImageSlider.prototype.setSlide = function() {
    // set the slider with image slider elements.
    var first = this.slider[0];
    first.classList.add('is-showing');
}

function setEvents() {
    var playButton = document.getElementById('play-btn'),
        previousButton = document.getElementById('previous-btn'),
        nextButton = document.getElementById('next-btn'),
        _this = this;

    playButton.onclick = function() {
        if (_this.playing) {
            _this.pause();
        } else {
            _this.play();
        }
    }

    previousButton.onclick = function() {
        _this.pause();
        _this.previousSlide();
    }

    nextButton.onclick = function() {
        _this.pause();
        _this.nextSlide();
    }
}

ImageSlider.prototype.nextSlide = function() {
    this.goToSlide(this.currentSlide + 1, 'next');
}

ImageSlider.prototype.previousSlide = function() {
    this.goToSlide(this.currentSlide - 1, 'previous');
}

ImageSlider.prototype.goToSlide = function(n, side) {
    var slides = this.slider;

    slides[this.currentSlide].className = side + ' image-slider';
    this.currentSlide = (n + slides.length) % slides.length;
    slides[this.currentSlide].className = side + ' image-slider is-showing';

    if (side === 'previous') {
        this.prevSlide = (this.currentSlide + 1) % slides.length;
    } else {
        this.prevSlide = (this.currentSlide - 1) % slides.length;
    }

    if (side === 'previous') {
        if (this.currentSlide === slides.length) {
            slides[slides.length +   1].className = side + ' image-slider is-hiding';
        } else {
            slides[this.prevSlide].className = side + ' image-slider is-hiding';
        }
    } else {
        if (this.currentSlide === 0) {
            slides[slides.length - 1].className = side + ' image-slider is-hiding';
        } else {
            slides[this.prevSlide].className = side + ' image-slider is-hiding';
        }
    }
}

ImageSlider.prototype.pause = function() {
    this.playBtn.classList.remove('is-pause');
    this.playing = false;
    clearInterval(this.slideInterval);
}

ImageSlider.prototype.play = function() {
    var _this = this;

    this.playBtn.classList.add('is-pause');
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
},{}],5:[function(require,module,exports){
'use strict';
/* jshint node: true */

/*
    var template = '<p>Hello, ik ben <%this.name%>. Ik ben <%this.profile.age%> jaar oud en ben erg <%this.state%></p>';
    console.log(TemplateEngine(template, {
        name: 'Jhon Majoor',
        profile: {age: 34},
        state: 'lief'
    }));

    var skillTemplate = 
        'My Skills:' +
        '<%for(var index in this.skills) {%>' +
        '<a href="#"><%this.skills[index]%></a>' +
        '<%}%>';

    console.log(TemplateEngine(skillTemplate, {
        skills: ['js', 'html', 'css']
    }));
*/

module.exports = function(html, options) {
    var re = /<%(.+?)%>/g,
        reExp = /(^( )?(var|if|for|else|switch|case|break|{|}|;))(.*)?/g,
        code = 'with(obj) { var r=[];\n',
        cursor = 0,
        match,
        result;

    var add = function(line, js) {
        js ? code += line.match(reExp) ? line + '\n' : 'r.push(' + line + ');\n' :
            (code += line != '' ? 'r.push("' + line.replace(/"/g, '\\"') + '");\n' : '');
        return add;
    }

    while(match = re.exec(html)) {
        add(html.slice(cursor, match.index))(match[1], true);
        cursor = match.index + match[0].length;
    }

    add(html.substr(cursor, html.length - cursor));
    code = (code + 'return r.join(""); }').replace(/[\r\t\n]/g, '');

    try {
        result = new Function('obj', code).apply(options, [options]);
    } catch(err) {
        console.error("'" + err.message + "'", " in \n\nCode:\n", code, "\n");
    }

    return result;
}
},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJpbmRleC5qcyIsImxpYi9leHRlbmRfZGVmYXVsdC5qcyIsImxpYi9pbWFnZV9zbGlkZXIuanMiLCJsaWIvc3RyaW5nX2FzX25vZGUuanMiLCJsaWIvdGVtcGxhdGUtZW5naW5lLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2U0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6TEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIid1c2Ugc3RyaWN0Jztcbi8qIGpzaGludCBub2RlOiB0cnVlICovXG5cbnZhciBFeHRlbmREZWZhdWx0ID0gcmVxdWlyZSgnLi9saWIvZXh0ZW5kX2RlZmF1bHQnKTtcbnZhciBJbWFnZVNsaWRlciA9IHJlcXVpcmUoJy4vbGliL2ltYWdlX3NsaWRlcicpO1xudmFyIFN0cmluZ0FzTm9kZSA9IHJlcXVpcmUoJy4vbGliL3N0cmluZ19hc19ub2RlJyk7XG52YXIgVGVtcGxhdGUgPSByZXF1aXJlKCcuL2xpYi90ZW1wbGF0ZS1lbmdpbmUnKTtcblxuXG52YXIgTW9kYWxibGFuYyA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoISh0aGlzIGluc3RhbmNlb2YgTW9kYWxibGFuYykpIHtcbiAgICAgIHJldHVybiBuZXcgTW9kYWxibGFuYygpO1xuICAgIH1cblxuICAgIHRoaXMuY2xvc2VCdXR0b24gPSBudWxsO1xuICAgIHRoaXMub3ZlcmxheSA9IG51bGw7XG5cbiAgICB2YXIgZGVmYXVsdHMgPSB7XG4gICAgICAgIGFuaW1hdGlvbjogJ2ZhZGUtaW4tb3V0JyxcbiAgICAgICAgY2xvc2VCdXR0b246IHRydWUsXG4gICAgICAgIGNvbnRlbnQ6ICcnLFxuICAgICAgICBzbGlkZXI6IG51bGwsXG4gICAgICAgIHNpZGVUd286IHtcbiAgICAgICAgICAgIGNvbnRlbnQ6IG51bGwsXG4gICAgICAgICAgICBhbmltYXRpb246IG51bGwsXG4gICAgICAgICAgICBidXR0b246IG51bGwsXG4gICAgICAgICAgICBidXR0b25CYWNrOiBudWxsXG4gICAgICAgIH0sXG4gICAgICB9O1xuXG4gICAgdGhpcy5zZXR0aW5ncyA9IHt9O1xuXG4gICAgdGhpcy5oYXNTbGlkZXIgPSB0aGlzLmhhc1NsaWRlciA/IHRydWUgOiBmYWxzZTtcbiAgICB0aGlzLnNsaWRlcklzT3BlbiA9IGZhbHNlO1xuICAgIHRoaXMubW9kYWxDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdtb2RhbC1mdWxsc2NyZWVuLWNvbnRhaW5lcicpO1xuXG4gICAgaWYgKGFyZ3VtZW50c1swXSAmJiB0eXBlb2YgYXJndW1lbnRzWzBdID09PSAnb2JqZWN0Jykge1xuICAgICAgICB0aGlzLm9wdGlvbnMgPSBFeHRlbmREZWZhdWx0KGRlZmF1bHRzLCBhcmd1bWVudHNbMF0pO1xuICAgIH1cblxufTtcblxuTW9kYWxibGFuYy5wcm90b3R5cGUub3BlbiA9IGZ1bmN0aW9uKCkge1xuICAgIGlmICh0aGlzLnNldHRpbmdzLm1vZGFsT3BlbikgcmV0dXJuO1xuXG4gICAgYnVpbGQuY2FsbCh0aGlzKTtcbiAgICBzZXRFdmVudHMuY2FsbCh0aGlzKTtcbn07XG5cbk1vZGFsYmxhbmMucHJvdG90eXBlLmNsb3NlID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKCF0aGlzLnNldHRpbmdzLm1vZGFsT3BlbikgcmV0dXJuO1xuXG4gICAgdmFyIG92ZXJsYXkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnb3ZlcmxheS1tb2RhbC1ibGFuYycpLFxuICAgICAgICBfdGhpcyA9IHRoaXM7XG5cbiAgICBvdmVybGF5LmNsYXNzTGlzdC5yZW1vdmUoJ2lzLWFjdGl2ZScpO1xuICAgIG92ZXJsYXkuY2xhc3NMaXN0LmFkZCgnaXMtaW5hY3RpdmUnKTtcblxuICAgIHZhciB0cmFuc1ByZWZpeCA9IHRyYW5zaXRpb25QcmVmaXgob3ZlcmxheSk7XG5cbiAgICBvdmVybGF5LmFkZEV2ZW50TGlzdGVuZXIodHJhbnNQcmVmaXguZW5kLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5yZW1vdmUoKTtcbiAgICAgICAgX3RoaXMuc2V0dGluZ3MubW9kYWxPcGVuID0gZmFsc2U7XG4gICAgfSwgZmFsc2UpO1xufTtcblxuTW9kYWxibGFuYy5wcm90b3R5cGUuc2xpZGVySW5pdCA9IGZ1bmN0aW9uKHNpZGUpIHtcbiAgICBpZiAodGhpcy5vcHRpb25zLnNsaWRlciAhPT0gbnVsbCkge1xuICAgICAgICB0aGlzLmhhc1NsaWRlciA9IHRydWU7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuaGFzU2xpZGVyKSB7XG4gICAgICAgIHRoaXMub3BlbigpO1xuICAgICAgICB0aGlzLnNsaWRlcklzT3BlbiA9IHRydWU7XG5cbiAgICAgICAgdGhpcy5zbGlkZXIgPSBuZXcgSW1hZ2VTbGlkZXIoe1xuICAgICAgICAgICAgcGFyZW50OiBzaWRlLFxuICAgICAgICAgICAgc2VsZWN0b3I6IHRoaXMub3B0aW9ucy5zbGlkZXJcbiAgICAgICAgfSk7XG4gICAgfVxufTtcblxuTW9kYWxibGFuYy5wcm90b3R5cGUuX2NvbnRlbnROZXh0ID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKHRoaXMuaGFzU2xpZGVyKSB7XG4gICAgICAgIHRoaXMuc2xpZGVySXNPcGVuID0gZmFsc2U7XG4gICAgICAgIGlmICh0aGlzLnNsaWRlci5wbGF5aW5nKSB0aGlzLnNsaWRlci5wYXVzZSgpO1xuICAgICAgICByZW1vdmVDbGFzcyh0aGlzLm1vZGFsQ29udGFpbmVyLCAnc2xpZGVyLW1vZGFsJyk7XG4gICAgICAgIGFkZENsYXNzKHRoaXMubW9kYWxDb250YWluZXIsICdiaWctbW9kYWwnKTtcbiAgICB9XG5cbiAgICB2YXIgY2FyZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjYXJkJyksXG4gICAgICAgIGN1c3RvbUNsYXNzID0gdGhpcy5vcHRpb25zLnNpZGVUd28uYW5pbWF0aW9uO1xuXG4gICAgY2FyZC5jbGFzc0xpc3QucmVtb3ZlKHR5cGVPZkFuaW1hdGlvbihjdXN0b21DbGFzcywgMikpO1xuICAgIGNhcmQuY2xhc3NMaXN0LmFkZCh0eXBlT2ZBbmltYXRpb24oY3VzdG9tQ2xhc3MpKTtcbn07XG5cbk1vZGFsYmxhbmMucHJvdG90eXBlLl9jb250ZW50UHJldmlvdXMgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAodGhpcy5oYXNTbGlkZXIpIHtcbiAgICAgICAgLy8gaWYgKCF0aGlzLnNsaWRlci5wbGF5aW5nKSB0aGlzLnNsaWRlci5wbGF5KCk7XG4gICAgICAgIHJlbW92ZUNsYXNzKHRoaXMubW9kYWxDb250YWluZXIsICdiaWctbW9kYWwnKTtcbiAgICAgICAgYWRkQ2xhc3ModGhpcy5tb2RhbENvbnRhaW5lciwgJ3NsaWRlci1tb2RhbCcpO1xuICAgIH1cblxuICAgIHZhciBjYXJkID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NhcmQnKSxcbiAgICAgICAgY3VzdG9tQ2xhc3MgPSB0aGlzLm9wdGlvbnMuc2lkZVR3by5hbmltYXRpb247XG5cbiAgICBjYXJkLmNsYXNzTGlzdC5yZW1vdmUodHlwZU9mQW5pbWF0aW9uKGN1c3RvbUNsYXNzKSk7XG4gICAgY2FyZC5jbGFzc0xpc3QuYWRkKHR5cGVPZkFuaW1hdGlvbihjdXN0b21DbGFzcywgMikpO1xufTtcblxuTW9kYWxibGFuYy5wcm90b3R5cGUuY2xhc3NFdmVudExpc3RlbmVyID0gZnVuY3Rpb24oZWxtLCBjYWxsYmFjaykge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGVsbS5sZW5ndGg7IGkrKykge1xuICAgICAgICBlbG1baV0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgIH0pO1xuICAgIH1cbn07XG5cbmZ1bmN0aW9uIHR5cGVPZkFuaW1hdGlvbih0eXBlLCB0eXBlQ2xhc3MpIHtcbiAgICB2YXIgYW5pbWF0aW9uVHlwZXMgPSB7XG4gICAgICAgICAgICAnc2xpZGUnOiBbJ3NsaWRlLW5leHQnLCAnc2xpZGUtYmFjayddLFxuICAgICAgICAgICAgJ3NjYWxlJzogWydzY2FsZS1uZXh0JywgJ3NjYWxlLWJhY2snXVxuICAgICAgICB9LFxuICAgICAgICBhbmltYXRpb25DbGFzcyA9IGFuaW1hdGlvblR5cGVzW3R5cGVdO1xuXG4gICAgICAgIGlmICh0eXBlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGlmICh0eXBlQ2xhc3MgPT09IDIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYW5pbWF0aW9uVHlwZXMuc2xpZGVbMV07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBhbmltYXRpb25UeXBlcy5zbGlkZVswXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICh0eXBlQ2xhc3MgPT09IDIpIHtcbiAgICAgICAgICAgIHJldHVybiBhbmltYXRpb25DbGFzc1sxXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBhbmltYXRpb25DbGFzc1swXTtcbiAgICAgICAgfVxufVxuXG5mdW5jdGlvbiB0cmFuc2l0aW9uUHJlZml4KGVsbSkge1xuICAgIHZhciB0cmFuc0VuZEV2ZW50TmFtZXMgPSB7XG4gICAgICAgICdXZWJraXRUcmFuc2l0aW9uJyA6ICd3ZWJraXRUcmFuc2l0aW9uRW5kJyxcbiAgICAgICAgJ01velRyYW5zaXRpb24nICAgIDogJ3RyYW5zaXRpb25lbmQnLFxuICAgICAgICAnT1RyYW5zaXRpb24nICAgICAgOiAnb1RyYW5zaXRpb25FbmQgb3RyYW5zaXRpb25lbmQnLFxuICAgICAgICAndHJhbnNpdGlvbicgICAgICAgOiAndHJhbnNpdGlvbmVuZCdcbiAgICB9O1xuXG4gICAgZm9yICh2YXIgbmFtZSBpbiB0cmFuc0VuZEV2ZW50TmFtZXMpIHtcbiAgICAgIGlmIChlbG0uc3R5bGVbbmFtZV0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZW5kOiB0cmFuc0VuZEV2ZW50TmFtZXNbbmFtZV1cbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9XG59XG5cbmZ1bmN0aW9uIHNldEV2ZW50cygpIHtcbiAgICB2YXIgbmV4dEJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtb2RhbC1idXR0b24tbmV4dCcpLFxuICAgICAgICBwcmV2QnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21vZGFsLWJ1dHRvbi1wcmV2JyksXG4gICAgICAgIGNsb3NlZCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ21vZGFsLWZ1bGxzY3JlZW4tY2xvc2UnKSxcbiAgICAgICAgX3RoaXMgPSB0aGlzO1xuXG4gICAgdGhpcy5jbGFzc0V2ZW50TGlzdGVuZXIoY2xvc2VkLCBmdW5jdGlvbigpIHtcbiAgICAgICAgX3RoaXMuY2xvc2UoKTtcbiAgICB9KTtcblxuICAgIGlmICh0aGlzLm9wdGlvbnMuc2lkZVR3by5jb250ZW50ID09PSBudWxsKSByZXR1cm47XG5cbiAgICBuZXh0QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5fY29udGVudE5leHQuYmluZCh0aGlzKSk7XG4gICAgcHJldkJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuX2NvbnRlbnRQcmV2aW91cy5iaW5kKHRoaXMpKTtcbn1cblxuZnVuY3Rpb24gYnVpbGQoKSB7XG4gICAgaWYgKHRoaXMub3B0aW9ucy5jbG9zZUJ1dHRvbikgdGhpcy5jbG9zZUJ1dHRvbiA9ICc8c3BhbiBjbGFzcz1cIm1vZGFsLWZ1bGxzY3JlZW4tY2xvc2VcIj5YPC9zcGFuPic7XG5cbiAgICB2YXIgY29udGVudFNpZGVPbmUgPSAhdGhpcy5vcHRpb25zLnNsaWRlciA/IGNvbnRlbnRUeXBlKHRoaXMub3B0aW9ucy5jb250ZW50KSA6IGNvbnRlbnRUeXBlKCc8ZGl2IGlkPVwibW9kYWwtc2xpZGVyXCI+PC9kaXY+Jyk7XG5cbiAgICB2YXIgdHlwZU1vZGFsID0gdGhpcy5vcHRpb25zLnNsaWRlciA/ICdzbGlkZXItbW9kYWwnIDogJ2JpZy1tb2RhbCc7XG4gICAgdmFyIG1vZGFsID0gJzxkaXYgaWQ9XCJvdmVybGF5LW1vZGFsLWJsYW5jXCIgY2xhc3M9XCJtb2RhbC1mdWxsc2NyZWVuLWJhY2tncm91bmQgPCV0aGlzLmFuaW1hdGlvbiU+IDwldGhpcy5zdGF0ZSU+XCI+JyArXG4gICAgICAgICAgICAgICAgICAgICc8ZGl2IGlkPVwibW9kYWwtZnVsbHNjcmVlbi1jb250YWluZXJcImNsYXNzPVwibW9kYWwtZnVsbHNjcmVlbi1jb250YWluZXIgPCV0aGlzLnR5cGUlPiBcIj4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICc8ZGl2IGlkPVwiY2FyZFwiPicrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJmcm9udFwiPicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPGRpdiBpZD1cImZyb250LWNhcmRcIiBjbGFzcz1cIm1vZGFsLWZ1bGxzY3JlZW4taXRlbVwiPicrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPCV0aGlzLmNsb3NlQnV0dG9uJT4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8JXRoaXMuY29udGVudFR5cGVTaWRlT25lJT4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJzwvZGl2PicrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJzwvZGl2PicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiYmFja1wiPicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPGRpdiAgaWQ9XCJiYWNrLWNhcmRcIiBjbGFzcz1cIm1vZGFsLWZ1bGxzY3JlZW4taXRlbVwiPicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJzwldGhpcy5jbG9zZUJ1dHRvbiU+JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPCV0aGlzLmNvbnRlbnRUeXBlU2lkZVR3byU+JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8L2Rpdj4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPC9kaXY+JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAnPC9kaXY+JyArXG4gICAgICAgICAgICAgICAgICAgICc8L2Rpdj4nICtcbiAgICAgICAgICAgICAgICAnPC9kaXY+JztcblxuICAgIHZhciBtb2RhbFRlbXBsYXRlID0gVGVtcGxhdGUobW9kYWwsIHtcbiAgICAgICAgYW5pbWF0aW9uOiB0aGlzLm9wdGlvbnMuYW5pbWF0aW9uLFxuICAgICAgICBzdGF0ZTogJ2lzLWFjdGl2ZScsXG4gICAgICAgIHR5cGU6IHR5cGVNb2RhbCxcbiAgICAgICAgY2xvc2VCdXR0b246IHRoaXMuY2xvc2VCdXR0b24sXG4gICAgICAgIGNvbnRlbnRUeXBlU2lkZU9uZTogY29udGVudFNpZGVPbmUsXG4gICAgICAgIGNvbnRlbnRUeXBlU2lkZVR3bzogY29udGVudFR5cGUodGhpcy5vcHRpb25zLnNpZGVUd28uY29udGVudClcbiAgICB9KTtcblxuICAgIHZhciBib2R5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2JvZHknKSxcbiAgICAgICAgbW9kYWxJZDtcblxuICAgIGlmIChib2R5WzBdLmlkKSB7XG4gICAgICAgIG1vZGFsSWQgPSBib2R5WzBdLmlkO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIG1vZGFsSWQgPSAnZ28tbW9kYWwnO1xuICAgICAgICBib2R5WzBdLmlkID0gbW9kYWxJZDtcbiAgICB9XG5cbiAgICBTdHJpbmdBc05vZGUoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQobW9kYWxJZCksIG1vZGFsVGVtcGxhdGUpO1xuICAgIHRoaXMuc2V0dGluZ3MubW9kYWxPcGVuID0gdHJ1ZTtcblxuICAgIGlmICh0aGlzLm9wdGlvbnMuc2xpZGVyKSB0aGlzLnNsaWRlckluaXQoJyNtb2RhbC1zbGlkZXInKTtcblxuICAgIGlmICh0aGlzLm9wdGlvbnMuc2lkZVR3by5jb250ZW50ID09PSBudWxsKSByZXR1cm47XG5cbiAgICBidWlsZEJ1dHRvbih0aGlzLm9wdGlvbnMuc2lkZVR3by5idXR0b24pO1xuICAgIGJ1aWxkQnV0dG9uKHRoaXMub3B0aW9ucy5zaWRlVHdvLmJ1dHRvbkJhY2ssICdiYWNrJyk7XG59XG5cbmZ1bmN0aW9uIGJ1aWxkRWxlbWVudChidWlsZE9wdGlvbnMpIHtcbiAgICB2YXIgY3JlYXRlRWxtLFxuICAgICAgICBwYXJlbnRFbG07XG5cbiAgICBjcmVhdGVFbG0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KGJ1aWxkT3B0aW9ucy5lbG0pO1xuICAgIGNyZWF0ZUVsbS5pZCA9IGJ1aWxkT3B0aW9ucy5idXR0b25JZDtcbiAgICBjcmVhdGVFbG0uaW5uZXJIVE1MID0gYnVpbGRPcHRpb25zLmJ1dHRvblRleHQ7XG4gICAgcGFyZW50RWxtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoYnVpbGRPcHRpb25zLnBhcmVudElkKTtcblxuICAgIHBhcmVudEVsbS5hcHBlbmRDaGlsZChjcmVhdGVFbG0pO1xufVxuXG5cbmZ1bmN0aW9uIGJ1aWxkQnV0dG9uKGVsbSkge1xuICAgIHZhciBidXR0b24sXG4gICAgICAgIGNvbXB1dGVkQnV0dG9uLFxuICAgICAgICBjb21wdXRlZEJ1dHRvbkJhY2ssXG4gICAgICAgIGZyb250Q2FyZCxcbiAgICAgICAgYmFja0NhcmQ7XG5cbiAgICBpZiAoZWxtID09PSBudWxsIHx8IGVsbSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGlmIChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbW9kYWwtYnV0dG9uLW5leHQnKSB8fCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbW9kYWwtYnV0dG9uLXByZXYnKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYnVpbGRFbGVtZW50KHtcbiAgICAgICAgICAgICAgICBlbG06ICdhJyxcbiAgICAgICAgICAgICAgICBidXR0b25JZDogJ21vZGFsLWJ1dHRvbi1uZXh0JyxcbiAgICAgICAgICAgICAgICBidXR0b25UZXh0OiAnTmV4dCBzdGVwJyxcbiAgICAgICAgICAgICAgICBwYXJlbnRJZDogJ2Zyb250LWNhcmQnXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgYnVpbGRFbGVtZW50KHtcbiAgICAgICAgICAgICAgICBlbG06ICdhJyxcbiAgICAgICAgICAgICAgICBidXR0b25JZDogJ21vZGFsLWJ1dHRvbi1wcmV2JyxcbiAgICAgICAgICAgICAgICBidXR0b25UZXh0OiAnUHJldmlvdXMgc3RlcCcsXG4gICAgICAgICAgICAgICAgcGFyZW50SWQ6ICdiYWNrLWNhcmQnXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAgIGJ1aWxkRWxlbWVudCh7XG4gICAgICAgICAgICBlbG06IGVsbS5lbGVtZW50LFxuICAgICAgICAgICAgYnV0dG9uSWQ6IGVsbS5pZCxcbiAgICAgICAgICAgIGJ1dHRvblRleHQ6IGVsbS50ZXh0LFxuICAgICAgICAgICAgcGFyZW50SWQ6IGVsbS5wYXJlbnQsXG4gICAgICAgIH0pO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gY29udGVudFR5cGUoY29udGVudFZhbHVlKSB7XG4gICAgaWYgKHR5cGVvZiBjb250ZW50VmFsdWUgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHJldHVybiBjb250ZW50VmFsdWU7XG4gICAgfSBlbHNlIGlmIChjb250ZW50VmFsdWUgPT09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuICcnO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBjb250ZW50VmFsdWUuaW5uZXJIVE1MO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gYWRkQ2xhc3Moc2VsZWN0b3IsIGNsYXNzTmFtZSkge1xuICAgIHNlbGVjdG9yWzBdLmNsYXNzTGlzdC5hZGQoY2xhc3NOYW1lKVxufVxuXG5mdW5jdGlvbiByZW1vdmVDbGFzcyhzZWxlY3RvciwgY2xhc3NOYW1lKSB7XG4gICAgc2VsZWN0b3JbMF0uY2xhc3NMaXN0LnJlbW92ZShjbGFzc05hbWUpXG59XG5tb2R1bGUuZXhwb3J0cyA9IE1vZGFsYmxhbmM7XG4iLCIndXNlIHN0cmljdCc7XG4vKiBqc2hpbnQgbm9kZTogdHJ1ZSAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHNvdXJjZSwgcHJvcGVydGllcykge1xuICAgIHZhciBwcm9wZXJ0eTtcbiAgICBmb3IgKHByb3BlcnR5IGluIHByb3BlcnRpZXMpIHtcbiAgICAgICAgaWYgKHByb3BlcnRpZXMuaGFzT3duUHJvcGVydHkocHJvcGVydHkpKSB7XG4gICAgICAgICAgICBzb3VyY2VbcHJvcGVydHldID0gcHJvcGVydGllc1twcm9wZXJ0eV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHNvdXJjZTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xuLyoganNoaW50IG5vZGU6IHRydWUgKi9cblxudmFyIEV4dGVuZERlZmF1bHQgPSByZXF1aXJlKCcuL2V4dGVuZF9kZWZhdWx0Jyk7XG52YXIgU3RyaW5nQXNOb2RlID0gcmVxdWlyZSgnLi9zdHJpbmdfYXNfbm9kZScpO1xuXG52YXIgSW1hZ2VTbGlkZXIgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAoISh0aGlzIGluc3RhbmNlb2YgSW1hZ2VTbGlkZXIpKSB7XG4gICAgICAgIHJldHVybiBuZXcgSW1hZ2VTbGlkZXIoKTtcbiAgICB9XG5cbiAgICB2YXIgZGVmYXVsdHMgPSB7XG4gICAgICAgIHNlbGVjdG9yOiAnLnNsaWRlcycsXG4gICAgICAgIHRyYW5zaXRpb246ICdmYWRlLXNsaWRlJyxcbiAgICAgICAgYXV0b1BsYXk6IGZhbHNlXG4gICAgfTtcblxuICAgIGlmIChhcmd1bWVudHNbMF0gJiYgdHlwZW9mIGFyZ3VtZW50c1swXSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgdGhpcy5vcHRpb25zID0gRXh0ZW5kRGVmYXVsdChkZWZhdWx0cywgYXJndW1lbnRzWzBdKTtcbiAgICB9XG5cbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgdGhpcy5jdXJyZW50U2xpZGUgPSAwO1xuICAgIHRoaXMucGxheWluZztcblxuICAgIHRoaXMuX2luaXQoKTtcbiAgICAvLyB0aGlzLm5leHRTbGlkZSgpXG4gICAgdGhpcy5zbGlkZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuaW1hZ2Utc2xpZGVyLWhvbGRlciAuaW1hZ2Utc2xpZGVyJyk7XG4gICAgdGhpcy5zZXRTbGlkZSgpO1xuXG4gICAgaWYgKHRoaXMub3B0aW9ucy5hdXRvUGxheSkge1xuICAgICAgICB0aGlzLnBsYXkoKTtcbiAgICB9XG59O1xuXG5JbWFnZVNsaWRlci5wcm90b3R5cGUuX2luaXQgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmNyZWF0ZVNsaWRlcygpO1xuICAgIHNldEV2ZW50cy5jYWxsKHRoaXMpO1xufTtcblxuSW1hZ2VTbGlkZXIucHJvdG90eXBlLmNyZWF0ZVNsaWRlcyA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuc2xpZGVzID0gW107XG4gICAgdmFyIHNsaWRlcyxcbiAgICAgICAgaW1hZ2VzID0gdGhpcy5vcHRpb25zLnNlbGVjdG9yO1xuXG4gICAgaWYgKGltYWdlcyBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgIHNsaWRlcyA9IGltYWdlcztcbiAgICB9IGVsc2Uge1xuICAgICAgICBzbGlkZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHRoaXMub3B0aW9ucy5zZWxlY3RvciArICcgaW1nJyk7XG4gICAgfVxuXG5cbiAgICB2YXIgcGFyZW50RWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRoaXMub3B0aW9ucy5wYXJlbnQpLFxuICAgICAgICBjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSxcbiAgICAgICAgc2xpZGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndWwnKSxcbiAgICAgICAgc2xpZGVJbWcsXG4gICAgICAgIHNsaWRlckVsbSxcbiAgICAgICAgaW1nRWxtO1xuXG4gICAgY29udGFpbmVyLmNsYXNzTmFtZSA9ICdpbWFnZS1zbGlkZXItY29udGFpbmVyJztcbiAgICBzbGlkZXIuY2xhc3NOYW1lID0gJ2ltYWdlLXNsaWRlci1ob2xkZXInO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzbGlkZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKHNsaWRlc1tpXS5zcmMpIHtcbiAgICAgICAgICAgIHNsaWRlSW1nID0gc2xpZGVzW2ldLnNyYztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNsaWRlSW1nID0gc2xpZGVzW2ldO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zbGlkZXMucHVzaCh7XG4gICAgICAgICAgICBpbmRleDogaSxcbiAgICAgICAgICAgIGVsOiBzbGlkZXNbaV0sXG4gICAgICAgICAgICBpbWFnZXM6IHNsaWRlSW1nXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHNsaWRlckVsbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XG4gICAgICAgIHNsaWRlckVsbS5jbGFzc05hbWUgPSAnaW1hZ2Utc2xpZGVyJztcblxuICAgICAgICBpbWdFbG0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKTtcbiAgICAgICAgaW1nRWxtLnNyYyA9IHNsaWRlSW1nO1xuXG4gICAgICAgIHNsaWRlckVsbS5hcHBlbmRDaGlsZChpbWdFbG0pO1xuICAgICAgICBzbGlkZXIuYXBwZW5kQ2hpbGQoc2xpZGVyRWxtKTtcbiAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKHNsaWRlcik7XG4gICAgICAgIHBhcmVudEVsLmFwcGVuZENoaWxkKGNvbnRhaW5lcik7XG4gICAgfVxuXG4gICAgdGhpcy5wbGF5QnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgIHRoaXMucGxheUJ0bi5pZCA9ICdwbGF5LWJ0bic7XG4gICAgc2xpZGVyLmFwcGVuZENoaWxkKHRoaXMucGxheUJ0bik7XG5cbiAgICB0aGlzLnByZXZpb3VzQnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgIHRoaXMucHJldmlvdXNCdG4uaWQgPSAncHJldmlvdXMtYnRuJztcbiAgICBzbGlkZXIuYXBwZW5kQ2hpbGQodGhpcy5wcmV2aW91c0J0bik7XG5cbiAgICB0aGlzLm5leHRCdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgdGhpcy5uZXh0QnRuLmlkID0gJ25leHQtYnRuJztcbiAgICBzbGlkZXIuYXBwZW5kQ2hpbGQodGhpcy5uZXh0QnRuKTtcbn07XG5cbkltYWdlU2xpZGVyLnByb3RvdHlwZS5zZXRTbGlkZSA9IGZ1bmN0aW9uKCkge1xuICAgIC8vIHNldCB0aGUgc2xpZGVyIHdpdGggaW1hZ2Ugc2xpZGVyIGVsZW1lbnRzLlxuICAgIHZhciBmaXJzdCA9IHRoaXMuc2xpZGVyWzBdO1xuICAgIGZpcnN0LmNsYXNzTGlzdC5hZGQoJ2lzLXNob3dpbmcnKTtcbn1cblxuZnVuY3Rpb24gc2V0RXZlbnRzKCkge1xuICAgIHZhciBwbGF5QnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BsYXktYnRuJyksXG4gICAgICAgIHByZXZpb3VzQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3ByZXZpb3VzLWJ0bicpLFxuICAgICAgICBuZXh0QnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ25leHQtYnRuJyksXG4gICAgICAgIF90aGlzID0gdGhpcztcblxuICAgIHBsYXlCdXR0b24ub25jbGljayA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAoX3RoaXMucGxheWluZykge1xuICAgICAgICAgICAgX3RoaXMucGF1c2UoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIF90aGlzLnBsYXkoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByZXZpb3VzQnV0dG9uLm9uY2xpY2sgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgX3RoaXMucGF1c2UoKTtcbiAgICAgICAgX3RoaXMucHJldmlvdXNTbGlkZSgpO1xuICAgIH1cblxuICAgIG5leHRCdXR0b24ub25jbGljayA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBfdGhpcy5wYXVzZSgpO1xuICAgICAgICBfdGhpcy5uZXh0U2xpZGUoKTtcbiAgICB9XG59XG5cbkltYWdlU2xpZGVyLnByb3RvdHlwZS5uZXh0U2xpZGUgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmdvVG9TbGlkZSh0aGlzLmN1cnJlbnRTbGlkZSArIDEsICduZXh0Jyk7XG59XG5cbkltYWdlU2xpZGVyLnByb3RvdHlwZS5wcmV2aW91c1NsaWRlID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5nb1RvU2xpZGUodGhpcy5jdXJyZW50U2xpZGUgLSAxLCAncHJldmlvdXMnKTtcbn1cblxuSW1hZ2VTbGlkZXIucHJvdG90eXBlLmdvVG9TbGlkZSA9IGZ1bmN0aW9uKG4sIHNpZGUpIHtcbiAgICB2YXIgc2xpZGVzID0gdGhpcy5zbGlkZXI7XG5cbiAgICBzbGlkZXNbdGhpcy5jdXJyZW50U2xpZGVdLmNsYXNzTmFtZSA9IHNpZGUgKyAnIGltYWdlLXNsaWRlcic7XG4gICAgdGhpcy5jdXJyZW50U2xpZGUgPSAobiArIHNsaWRlcy5sZW5ndGgpICUgc2xpZGVzLmxlbmd0aDtcbiAgICBzbGlkZXNbdGhpcy5jdXJyZW50U2xpZGVdLmNsYXNzTmFtZSA9IHNpZGUgKyAnIGltYWdlLXNsaWRlciBpcy1zaG93aW5nJztcblxuICAgIGlmIChzaWRlID09PSAncHJldmlvdXMnKSB7XG4gICAgICAgIHRoaXMucHJldlNsaWRlID0gKHRoaXMuY3VycmVudFNsaWRlICsgMSkgJSBzbGlkZXMubGVuZ3RoO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMucHJldlNsaWRlID0gKHRoaXMuY3VycmVudFNsaWRlIC0gMSkgJSBzbGlkZXMubGVuZ3RoO1xuICAgIH1cblxuICAgIGlmIChzaWRlID09PSAncHJldmlvdXMnKSB7XG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRTbGlkZSA9PT0gc2xpZGVzLmxlbmd0aCkge1xuICAgICAgICAgICAgc2xpZGVzW3NsaWRlcy5sZW5ndGggKyAgIDFdLmNsYXNzTmFtZSA9IHNpZGUgKyAnIGltYWdlLXNsaWRlciBpcy1oaWRpbmcnO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc2xpZGVzW3RoaXMucHJldlNsaWRlXS5jbGFzc05hbWUgPSBzaWRlICsgJyBpbWFnZS1zbGlkZXIgaXMtaGlkaW5nJztcbiAgICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRTbGlkZSA9PT0gMCkge1xuICAgICAgICAgICAgc2xpZGVzW3NsaWRlcy5sZW5ndGggLSAxXS5jbGFzc05hbWUgPSBzaWRlICsgJyBpbWFnZS1zbGlkZXIgaXMtaGlkaW5nJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNsaWRlc1t0aGlzLnByZXZTbGlkZV0uY2xhc3NOYW1lID0gc2lkZSArICcgaW1hZ2Utc2xpZGVyIGlzLWhpZGluZyc7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbkltYWdlU2xpZGVyLnByb3RvdHlwZS5wYXVzZSA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMucGxheUJ0bi5jbGFzc0xpc3QucmVtb3ZlKCdpcy1wYXVzZScpO1xuICAgIHRoaXMucGxheWluZyA9IGZhbHNlO1xuICAgIGNsZWFySW50ZXJ2YWwodGhpcy5zbGlkZUludGVydmFsKTtcbn1cblxuSW1hZ2VTbGlkZXIucHJvdG90eXBlLnBsYXkgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgdGhpcy5wbGF5QnRuLmNsYXNzTGlzdC5hZGQoJ2lzLXBhdXNlJyk7XG4gICAgdGhpcy5wbGF5aW5nID0gdHJ1ZTtcbiAgICB0aGlzLnNsaWRlSW50ZXJ2YWwgPSBzZXRJbnRlcnZhbChmdW5jdGlvbigpIHtcbiAgICAgICAgX3RoaXMubmV4dFNsaWRlKCk7XG4gICAgfSwgMjAwMCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gSW1hZ2VTbGlkZXI7XG4iLCIndXNlIHN0cmljdCc7XG4vKiBqc2hpbnQgbm9kZTogdHJ1ZSAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGVsZW1lbnQsIGh0bWwpIHtcbiAgICBpZiAoaHRtbCA9PT0gbnVsbCkgcmV0dXJuO1xuXG4gICAgdmFyIGZyYWcgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCksXG4gICAgICAgIHRtcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2JvZHknKSxcbiAgICAgICAgY2hpbGQ7XG5cbiAgICB0bXAuaW5uZXJIVE1MID0gaHRtbDtcblxuICAgIHdoaWxlIChjaGlsZCA9IHRtcC5maXJzdENoaWxkKSB7XG4gICAgICAgIGZyYWcuYXBwZW5kQ2hpbGQoY2hpbGQpO1xuICAgIH1cblxuICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQoZnJhZyk7XG4gICAgZnJhZyA9IHRtcCA9IG51bGw7XG59OyIsIid1c2Ugc3RyaWN0Jztcbi8qIGpzaGludCBub2RlOiB0cnVlICovXG5cbi8qXG4gICAgdmFyIHRlbXBsYXRlID0gJzxwPkhlbGxvLCBpayBiZW4gPCV0aGlzLm5hbWUlPi4gSWsgYmVuIDwldGhpcy5wcm9maWxlLmFnZSU+IGphYXIgb3VkIGVuIGJlbiBlcmcgPCV0aGlzLnN0YXRlJT48L3A+JztcbiAgICBjb25zb2xlLmxvZyhUZW1wbGF0ZUVuZ2luZSh0ZW1wbGF0ZSwge1xuICAgICAgICBuYW1lOiAnSmhvbiBNYWpvb3InLFxuICAgICAgICBwcm9maWxlOiB7YWdlOiAzNH0sXG4gICAgICAgIHN0YXRlOiAnbGllZidcbiAgICB9KSk7XG5cbiAgICB2YXIgc2tpbGxUZW1wbGF0ZSA9IFxuICAgICAgICAnTXkgU2tpbGxzOicgK1xuICAgICAgICAnPCVmb3IodmFyIGluZGV4IGluIHRoaXMuc2tpbGxzKSB7JT4nICtcbiAgICAgICAgJzxhIGhyZWY9XCIjXCI+PCV0aGlzLnNraWxsc1tpbmRleF0lPjwvYT4nICtcbiAgICAgICAgJzwlfSU+JztcblxuICAgIGNvbnNvbGUubG9nKFRlbXBsYXRlRW5naW5lKHNraWxsVGVtcGxhdGUsIHtcbiAgICAgICAgc2tpbGxzOiBbJ2pzJywgJ2h0bWwnLCAnY3NzJ11cbiAgICB9KSk7XG4qL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGh0bWwsIG9wdGlvbnMpIHtcbiAgICB2YXIgcmUgPSAvPCUoLis/KSU+L2csXG4gICAgICAgIHJlRXhwID0gLyheKCApPyh2YXJ8aWZ8Zm9yfGVsc2V8c3dpdGNofGNhc2V8YnJlYWt8e3x9fDspKSguKik/L2csXG4gICAgICAgIGNvZGUgPSAnd2l0aChvYmopIHsgdmFyIHI9W107XFxuJyxcbiAgICAgICAgY3Vyc29yID0gMCxcbiAgICAgICAgbWF0Y2gsXG4gICAgICAgIHJlc3VsdDtcblxuICAgIHZhciBhZGQgPSBmdW5jdGlvbihsaW5lLCBqcykge1xuICAgICAgICBqcyA/IGNvZGUgKz0gbGluZS5tYXRjaChyZUV4cCkgPyBsaW5lICsgJ1xcbicgOiAnci5wdXNoKCcgKyBsaW5lICsgJyk7XFxuJyA6XG4gICAgICAgICAgICAoY29kZSArPSBsaW5lICE9ICcnID8gJ3IucHVzaChcIicgKyBsaW5lLnJlcGxhY2UoL1wiL2csICdcXFxcXCInKSArICdcIik7XFxuJyA6ICcnKTtcbiAgICAgICAgcmV0dXJuIGFkZDtcbiAgICB9XG5cbiAgICB3aGlsZShtYXRjaCA9IHJlLmV4ZWMoaHRtbCkpIHtcbiAgICAgICAgYWRkKGh0bWwuc2xpY2UoY3Vyc29yLCBtYXRjaC5pbmRleCkpKG1hdGNoWzFdLCB0cnVlKTtcbiAgICAgICAgY3Vyc29yID0gbWF0Y2guaW5kZXggKyBtYXRjaFswXS5sZW5ndGg7XG4gICAgfVxuXG4gICAgYWRkKGh0bWwuc3Vic3RyKGN1cnNvciwgaHRtbC5sZW5ndGggLSBjdXJzb3IpKTtcbiAgICBjb2RlID0gKGNvZGUgKyAncmV0dXJuIHIuam9pbihcIlwiKTsgfScpLnJlcGxhY2UoL1tcXHJcXHRcXG5dL2csICcnKTtcblxuICAgIHRyeSB7XG4gICAgICAgIHJlc3VsdCA9IG5ldyBGdW5jdGlvbignb2JqJywgY29kZSkuYXBwbHkob3B0aW9ucywgW29wdGlvbnNdKTtcbiAgICB9IGNhdGNoKGVycikge1xuICAgICAgICBjb25zb2xlLmVycm9yKFwiJ1wiICsgZXJyLm1lc3NhZ2UgKyBcIidcIiwgXCIgaW4gXFxuXFxuQ29kZTpcXG5cIiwgY29kZSwgXCJcXG5cIik7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbn0iXX0=
