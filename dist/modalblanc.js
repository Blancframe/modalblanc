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
    this.goToSlide(this.currentSlide + 1);
}

ImageSlider.prototype.previousSlide = function() {
    this.goToSlide(this.currentSlide - 1);
}

ImageSlider.prototype.goToSlide = function(n) {
    var slides = this.slider;

    slides[this.currentSlide].className = 'image-slider';
    this.currentSlide = (n + slides.length) % slides.length;
    slides[this.currentSlide].className = 'image-slider is-showing';
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJpbmRleC5qcyIsImxpYi9leHRlbmRfZGVmYXVsdC5qcyIsImxpYi9pbWFnZV9zbGlkZXIuanMiLCJsaWIvc3RyaW5nX2FzX25vZGUuanMiLCJsaWIvdGVtcGxhdGUtZW5naW5lLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2U0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJ3VzZSBzdHJpY3QnO1xuLyoganNoaW50IG5vZGU6IHRydWUgKi9cblxudmFyIEV4dGVuZERlZmF1bHQgPSByZXF1aXJlKCcuL2xpYi9leHRlbmRfZGVmYXVsdCcpO1xudmFyIEltYWdlU2xpZGVyID0gcmVxdWlyZSgnLi9saWIvaW1hZ2Vfc2xpZGVyJyk7XG52YXIgU3RyaW5nQXNOb2RlID0gcmVxdWlyZSgnLi9saWIvc3RyaW5nX2FzX25vZGUnKTtcbnZhciBUZW1wbGF0ZSA9IHJlcXVpcmUoJy4vbGliL3RlbXBsYXRlLWVuZ2luZScpO1xuXG5cbnZhciBNb2RhbGJsYW5jID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICghKHRoaXMgaW5zdGFuY2VvZiBNb2RhbGJsYW5jKSkge1xuICAgICAgcmV0dXJuIG5ldyBNb2RhbGJsYW5jKCk7XG4gICAgfVxuXG4gICAgdGhpcy5jbG9zZUJ1dHRvbiA9IG51bGw7XG4gICAgdGhpcy5vdmVybGF5ID0gbnVsbDtcblxuICAgIHZhciBkZWZhdWx0cyA9IHtcbiAgICAgICAgYW5pbWF0aW9uOiAnZmFkZS1pbi1vdXQnLFxuICAgICAgICBjbG9zZUJ1dHRvbjogdHJ1ZSxcbiAgICAgICAgY29udGVudDogJycsXG4gICAgICAgIHNsaWRlcjogbnVsbCxcbiAgICAgICAgc2lkZVR3bzoge1xuICAgICAgICAgICAgY29udGVudDogbnVsbCxcbiAgICAgICAgICAgIGFuaW1hdGlvbjogbnVsbCxcbiAgICAgICAgICAgIGJ1dHRvbjogbnVsbCxcbiAgICAgICAgICAgIGJ1dHRvbkJhY2s6IG51bGxcbiAgICAgICAgfSxcbiAgICAgIH07XG5cbiAgICB0aGlzLnNldHRpbmdzID0ge307XG5cbiAgICB0aGlzLmhhc1NsaWRlciA9IHRoaXMuaGFzU2xpZGVyID8gdHJ1ZSA6IGZhbHNlO1xuICAgIHRoaXMuc2xpZGVySXNPcGVuID0gZmFsc2U7XG4gICAgdGhpcy5tb2RhbENvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ21vZGFsLWZ1bGxzY3JlZW4tY29udGFpbmVyJyk7XG5cbiAgICBpZiAoYXJndW1lbnRzWzBdICYmIHR5cGVvZiBhcmd1bWVudHNbMF0gPT09ICdvYmplY3QnKSB7XG4gICAgICAgIHRoaXMub3B0aW9ucyA9IEV4dGVuZERlZmF1bHQoZGVmYXVsdHMsIGFyZ3VtZW50c1swXSk7XG4gICAgfVxuXG59O1xuXG5Nb2RhbGJsYW5jLnByb3RvdHlwZS5vcGVuID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKHRoaXMuc2V0dGluZ3MubW9kYWxPcGVuKSByZXR1cm47XG5cbiAgICBidWlsZC5jYWxsKHRoaXMpO1xuICAgIHNldEV2ZW50cy5jYWxsKHRoaXMpO1xufTtcblxuTW9kYWxibGFuYy5wcm90b3R5cGUuY2xvc2UgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAoIXRoaXMuc2V0dGluZ3MubW9kYWxPcGVuKSByZXR1cm47XG5cbiAgICB2YXIgb3ZlcmxheSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdvdmVybGF5LW1vZGFsLWJsYW5jJyksXG4gICAgICAgIF90aGlzID0gdGhpcztcblxuICAgIG92ZXJsYXkuY2xhc3NMaXN0LnJlbW92ZSgnaXMtYWN0aXZlJyk7XG4gICAgb3ZlcmxheS5jbGFzc0xpc3QuYWRkKCdpcy1pbmFjdGl2ZScpO1xuXG4gICAgdmFyIHRyYW5zUHJlZml4ID0gdHJhbnNpdGlvblByZWZpeChvdmVybGF5KTtcblxuICAgIG92ZXJsYXkuYWRkRXZlbnRMaXN0ZW5lcih0cmFuc1ByZWZpeC5lbmQsIGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLnJlbW92ZSgpO1xuICAgICAgICBfdGhpcy5zZXR0aW5ncy5tb2RhbE9wZW4gPSBmYWxzZTtcbiAgICB9LCBmYWxzZSk7XG59O1xuXG5Nb2RhbGJsYW5jLnByb3RvdHlwZS5zbGlkZXJJbml0ID0gZnVuY3Rpb24oc2lkZSkge1xuICAgIGlmICh0aGlzLm9wdGlvbnMuc2xpZGVyICE9PSBudWxsKSB7XG4gICAgICAgIHRoaXMuaGFzU2xpZGVyID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5oYXNTbGlkZXIpIHtcbiAgICAgICAgdGhpcy5vcGVuKCk7XG4gICAgICAgIHRoaXMuc2xpZGVySXNPcGVuID0gdHJ1ZTtcblxuICAgICAgICB0aGlzLnNsaWRlciA9IG5ldyBJbWFnZVNsaWRlcih7XG4gICAgICAgICAgICBwYXJlbnQ6IHNpZGUsXG4gICAgICAgICAgICBzZWxlY3RvcjogdGhpcy5vcHRpb25zLnNsaWRlclxuICAgICAgICB9KTtcbiAgICB9XG59O1xuXG5Nb2RhbGJsYW5jLnByb3RvdHlwZS5fY29udGVudE5leHQgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAodGhpcy5oYXNTbGlkZXIpIHtcbiAgICAgICAgdGhpcy5zbGlkZXJJc09wZW4gPSBmYWxzZTtcbiAgICAgICAgaWYgKHRoaXMuc2xpZGVyLnBsYXlpbmcpIHRoaXMuc2xpZGVyLnBhdXNlKCk7XG4gICAgICAgIHJlbW92ZUNsYXNzKHRoaXMubW9kYWxDb250YWluZXIsICdzbGlkZXItbW9kYWwnKTtcbiAgICAgICAgYWRkQ2xhc3ModGhpcy5tb2RhbENvbnRhaW5lciwgJ2JpZy1tb2RhbCcpO1xuICAgIH1cblxuICAgIHZhciBjYXJkID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NhcmQnKSxcbiAgICAgICAgY3VzdG9tQ2xhc3MgPSB0aGlzLm9wdGlvbnMuc2lkZVR3by5hbmltYXRpb247XG5cbiAgICBjYXJkLmNsYXNzTGlzdC5yZW1vdmUodHlwZU9mQW5pbWF0aW9uKGN1c3RvbUNsYXNzLCAyKSk7XG4gICAgY2FyZC5jbGFzc0xpc3QuYWRkKHR5cGVPZkFuaW1hdGlvbihjdXN0b21DbGFzcykpO1xufTtcblxuTW9kYWxibGFuYy5wcm90b3R5cGUuX2NvbnRlbnRQcmV2aW91cyA9IGZ1bmN0aW9uKCkge1xuICAgIGlmICh0aGlzLmhhc1NsaWRlcikge1xuICAgICAgICAvLyBpZiAoIXRoaXMuc2xpZGVyLnBsYXlpbmcpIHRoaXMuc2xpZGVyLnBsYXkoKTtcbiAgICAgICAgcmVtb3ZlQ2xhc3ModGhpcy5tb2RhbENvbnRhaW5lciwgJ2JpZy1tb2RhbCcpO1xuICAgICAgICBhZGRDbGFzcyh0aGlzLm1vZGFsQ29udGFpbmVyLCAnc2xpZGVyLW1vZGFsJyk7XG4gICAgfVxuXG4gICAgdmFyIGNhcmQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2FyZCcpLFxuICAgICAgICBjdXN0b21DbGFzcyA9IHRoaXMub3B0aW9ucy5zaWRlVHdvLmFuaW1hdGlvbjtcblxuICAgIGNhcmQuY2xhc3NMaXN0LnJlbW92ZSh0eXBlT2ZBbmltYXRpb24oY3VzdG9tQ2xhc3MpKTtcbiAgICBjYXJkLmNsYXNzTGlzdC5hZGQodHlwZU9mQW5pbWF0aW9uKGN1c3RvbUNsYXNzLCAyKSk7XG59O1xuXG5Nb2RhbGJsYW5jLnByb3RvdHlwZS5jbGFzc0V2ZW50TGlzdGVuZXIgPSBmdW5jdGlvbihlbG0sIGNhbGxiYWNrKSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZWxtLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGVsbVtpXS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgfSk7XG4gICAgfVxufTtcblxuZnVuY3Rpb24gdHlwZU9mQW5pbWF0aW9uKHR5cGUsIHR5cGVDbGFzcykge1xuICAgIHZhciBhbmltYXRpb25UeXBlcyA9IHtcbiAgICAgICAgICAgICdzbGlkZSc6IFsnc2xpZGUtbmV4dCcsICdzbGlkZS1iYWNrJ10sXG4gICAgICAgICAgICAnc2NhbGUnOiBbJ3NjYWxlLW5leHQnLCAnc2NhbGUtYmFjayddXG4gICAgICAgIH0sXG4gICAgICAgIGFuaW1hdGlvbkNsYXNzID0gYW5pbWF0aW9uVHlwZXNbdHlwZV07XG5cbiAgICAgICAgaWYgKHR5cGUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgaWYgKHR5cGVDbGFzcyA9PT0gMikge1xuICAgICAgICAgICAgICAgIHJldHVybiBhbmltYXRpb25UeXBlcy5zbGlkZVsxXTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGFuaW1hdGlvblR5cGVzLnNsaWRlWzBdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKHR5cGVDbGFzcyA9PT0gMikge1xuICAgICAgICAgICAgcmV0dXJuIGFuaW1hdGlvbkNsYXNzWzFdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGFuaW1hdGlvbkNsYXNzWzBdO1xuICAgICAgICB9XG59XG5cbmZ1bmN0aW9uIHRyYW5zaXRpb25QcmVmaXgoZWxtKSB7XG4gICAgdmFyIHRyYW5zRW5kRXZlbnROYW1lcyA9IHtcbiAgICAgICAgJ1dlYmtpdFRyYW5zaXRpb24nIDogJ3dlYmtpdFRyYW5zaXRpb25FbmQnLFxuICAgICAgICAnTW96VHJhbnNpdGlvbicgICAgOiAndHJhbnNpdGlvbmVuZCcsXG4gICAgICAgICdPVHJhbnNpdGlvbicgICAgICA6ICdvVHJhbnNpdGlvbkVuZCBvdHJhbnNpdGlvbmVuZCcsXG4gICAgICAgICd0cmFuc2l0aW9uJyAgICAgICA6ICd0cmFuc2l0aW9uZW5kJ1xuICAgIH07XG5cbiAgICBmb3IgKHZhciBuYW1lIGluIHRyYW5zRW5kRXZlbnROYW1lcykge1xuICAgICAgaWYgKGVsbS5zdHlsZVtuYW1lXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBlbmQ6IHRyYW5zRW5kRXZlbnROYW1lc1tuYW1lXVxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH1cbn1cblxuZnVuY3Rpb24gc2V0RXZlbnRzKCkge1xuICAgIHZhciBuZXh0QnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21vZGFsLWJ1dHRvbi1uZXh0JyksXG4gICAgICAgIHByZXZCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbW9kYWwtYnV0dG9uLXByZXYnKSxcbiAgICAgICAgY2xvc2VkID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnbW9kYWwtZnVsbHNjcmVlbi1jbG9zZScpLFxuICAgICAgICBfdGhpcyA9IHRoaXM7XG5cbiAgICB0aGlzLmNsYXNzRXZlbnRMaXN0ZW5lcihjbG9zZWQsIGZ1bmN0aW9uKCkge1xuICAgICAgICBfdGhpcy5jbG9zZSgpO1xuICAgIH0pO1xuXG4gICAgaWYgKHRoaXMub3B0aW9ucy5zaWRlVHdvLmNvbnRlbnQgPT09IG51bGwpIHJldHVybjtcblxuICAgIG5leHRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLl9jb250ZW50TmV4dC5iaW5kKHRoaXMpKTtcbiAgICBwcmV2QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5fY29udGVudFByZXZpb3VzLmJpbmQodGhpcykpO1xufVxuXG5mdW5jdGlvbiBidWlsZCgpIHtcbiAgICBpZiAodGhpcy5vcHRpb25zLmNsb3NlQnV0dG9uKSB0aGlzLmNsb3NlQnV0dG9uID0gJzxzcGFuIGNsYXNzPVwibW9kYWwtZnVsbHNjcmVlbi1jbG9zZVwiPlg8L3NwYW4+JztcblxuICAgIHZhciBjb250ZW50U2lkZU9uZSA9ICF0aGlzLm9wdGlvbnMuc2xpZGVyID8gY29udGVudFR5cGUodGhpcy5vcHRpb25zLmNvbnRlbnQpIDogY29udGVudFR5cGUoJzxkaXYgaWQ9XCJtb2RhbC1zbGlkZXJcIj48L2Rpdj4nKTtcblxuICAgIHZhciB0eXBlTW9kYWwgPSB0aGlzLm9wdGlvbnMuc2xpZGVyID8gJ3NsaWRlci1tb2RhbCcgOiAnYmlnLW1vZGFsJztcbiAgICB2YXIgbW9kYWwgPSAnPGRpdiBpZD1cIm92ZXJsYXktbW9kYWwtYmxhbmNcIiBjbGFzcz1cIm1vZGFsLWZ1bGxzY3JlZW4tYmFja2dyb3VuZCA8JXRoaXMuYW5pbWF0aW9uJT4gPCV0aGlzLnN0YXRlJT5cIj4nICtcbiAgICAgICAgICAgICAgICAgICAgJzxkaXYgaWQ9XCJtb2RhbC1mdWxsc2NyZWVuLWNvbnRhaW5lclwiY2xhc3M9XCJtb2RhbC1mdWxsc2NyZWVuLWNvbnRhaW5lciA8JXRoaXMudHlwZSU+IFwiPicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJzxkaXYgaWQ9XCJjYXJkXCI+JytcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cImZyb250XCI+JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8ZGl2IGlkPVwiZnJvbnQtY2FyZFwiIGNsYXNzPVwibW9kYWwtZnVsbHNjcmVlbi1pdGVtXCI+JytcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8JXRoaXMuY2xvc2VCdXR0b24lPicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJzwldGhpcy5jb250ZW50VHlwZVNpZGVPbmUlPicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPC9kaXY+JytcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPC9kaXY+JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJiYWNrXCI+JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8ZGl2ICBpZD1cImJhY2stY2FyZFwiIGNsYXNzPVwibW9kYWwtZnVsbHNjcmVlbi1pdGVtXCI+JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPCV0aGlzLmNsb3NlQnV0dG9uJT4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8JXRoaXMuY29udGVudFR5cGVTaWRlVHdvJT4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJzwvZGl2PicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8L2Rpdj4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICc8L2Rpdj4nICtcbiAgICAgICAgICAgICAgICAgICAgJzwvZGl2PicgK1xuICAgICAgICAgICAgICAgICc8L2Rpdj4nO1xuXG4gICAgdmFyIG1vZGFsVGVtcGxhdGUgPSBUZW1wbGF0ZShtb2RhbCwge1xuICAgICAgICBhbmltYXRpb246IHRoaXMub3B0aW9ucy5hbmltYXRpb24sXG4gICAgICAgIHN0YXRlOiAnaXMtYWN0aXZlJyxcbiAgICAgICAgdHlwZTogdHlwZU1vZGFsLFxuICAgICAgICBjbG9zZUJ1dHRvbjogdGhpcy5jbG9zZUJ1dHRvbixcbiAgICAgICAgY29udGVudFR5cGVTaWRlT25lOiBjb250ZW50U2lkZU9uZSxcbiAgICAgICAgY29udGVudFR5cGVTaWRlVHdvOiBjb250ZW50VHlwZSh0aGlzLm9wdGlvbnMuc2lkZVR3by5jb250ZW50KVxuICAgIH0pO1xuXG4gICAgdmFyIGJvZHkgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnYm9keScpLFxuICAgICAgICBtb2RhbElkO1xuXG4gICAgaWYgKGJvZHlbMF0uaWQpIHtcbiAgICAgICAgbW9kYWxJZCA9IGJvZHlbMF0uaWQ7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgbW9kYWxJZCA9ICdnby1tb2RhbCc7XG4gICAgICAgIGJvZHlbMF0uaWQgPSBtb2RhbElkO1xuICAgIH1cblxuICAgIFN0cmluZ0FzTm9kZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZChtb2RhbElkKSwgbW9kYWxUZW1wbGF0ZSk7XG4gICAgdGhpcy5zZXR0aW5ncy5tb2RhbE9wZW4gPSB0cnVlO1xuXG4gICAgaWYgKHRoaXMub3B0aW9ucy5zbGlkZXIpIHRoaXMuc2xpZGVySW5pdCgnI21vZGFsLXNsaWRlcicpO1xuXG4gICAgaWYgKHRoaXMub3B0aW9ucy5zaWRlVHdvLmNvbnRlbnQgPT09IG51bGwpIHJldHVybjtcblxuICAgIGJ1aWxkQnV0dG9uKHRoaXMub3B0aW9ucy5zaWRlVHdvLmJ1dHRvbik7XG4gICAgYnVpbGRCdXR0b24odGhpcy5vcHRpb25zLnNpZGVUd28uYnV0dG9uQmFjaywgJ2JhY2snKTtcbn1cblxuZnVuY3Rpb24gYnVpbGRFbGVtZW50KGJ1aWxkT3B0aW9ucykge1xuICAgIHZhciBjcmVhdGVFbG0sXG4gICAgICAgIHBhcmVudEVsbTtcblxuICAgIGNyZWF0ZUVsbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoYnVpbGRPcHRpb25zLmVsbSk7XG4gICAgY3JlYXRlRWxtLmlkID0gYnVpbGRPcHRpb25zLmJ1dHRvbklkO1xuICAgIGNyZWF0ZUVsbS5pbm5lckhUTUwgPSBidWlsZE9wdGlvbnMuYnV0dG9uVGV4dDtcbiAgICBwYXJlbnRFbG0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChidWlsZE9wdGlvbnMucGFyZW50SWQpO1xuXG4gICAgcGFyZW50RWxtLmFwcGVuZENoaWxkKGNyZWF0ZUVsbSk7XG59XG5cblxuZnVuY3Rpb24gYnVpbGRCdXR0b24oZWxtKSB7XG4gICAgdmFyIGJ1dHRvbixcbiAgICAgICAgY29tcHV0ZWRCdXR0b24sXG4gICAgICAgIGNvbXB1dGVkQnV0dG9uQmFjayxcbiAgICAgICAgZnJvbnRDYXJkLFxuICAgICAgICBiYWNrQ2FyZDtcblxuICAgIGlmIChlbG0gPT09IG51bGwgfHwgZWxtID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgaWYgKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtb2RhbC1idXR0b24tbmV4dCcpIHx8IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtb2RhbC1idXR0b24tcHJldicpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBidWlsZEVsZW1lbnQoe1xuICAgICAgICAgICAgICAgIGVsbTogJ2EnLFxuICAgICAgICAgICAgICAgIGJ1dHRvbklkOiAnbW9kYWwtYnV0dG9uLW5leHQnLFxuICAgICAgICAgICAgICAgIGJ1dHRvblRleHQ6ICdOZXh0IHN0ZXAnLFxuICAgICAgICAgICAgICAgIHBhcmVudElkOiAnZnJvbnQtY2FyZCdcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBidWlsZEVsZW1lbnQoe1xuICAgICAgICAgICAgICAgIGVsbTogJ2EnLFxuICAgICAgICAgICAgICAgIGJ1dHRvbklkOiAnbW9kYWwtYnV0dG9uLXByZXYnLFxuICAgICAgICAgICAgICAgIGJ1dHRvblRleHQ6ICdQcmV2aW91cyBzdGVwJyxcbiAgICAgICAgICAgICAgICBwYXJlbnRJZDogJ2JhY2stY2FyZCdcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgICAgYnVpbGRFbGVtZW50KHtcbiAgICAgICAgICAgIGVsbTogZWxtLmVsZW1lbnQsXG4gICAgICAgICAgICBidXR0b25JZDogZWxtLmlkLFxuICAgICAgICAgICAgYnV0dG9uVGV4dDogZWxtLnRleHQsXG4gICAgICAgICAgICBwYXJlbnRJZDogZWxtLnBhcmVudCxcbiAgICAgICAgfSk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBjb250ZW50VHlwZShjb250ZW50VmFsdWUpIHtcbiAgICBpZiAodHlwZW9mIGNvbnRlbnRWYWx1ZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgcmV0dXJuIGNvbnRlbnRWYWx1ZTtcbiAgICB9IGVsc2UgaWYgKGNvbnRlbnRWYWx1ZSA9PT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gJyc7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGNvbnRlbnRWYWx1ZS5pbm5lckhUTUw7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBhZGRDbGFzcyhzZWxlY3RvciwgY2xhc3NOYW1lKSB7XG4gICAgc2VsZWN0b3JbMF0uY2xhc3NMaXN0LmFkZChjbGFzc05hbWUpXG59XG5cbmZ1bmN0aW9uIHJlbW92ZUNsYXNzKHNlbGVjdG9yLCBjbGFzc05hbWUpIHtcbiAgICBzZWxlY3RvclswXS5jbGFzc0xpc3QucmVtb3ZlKGNsYXNzTmFtZSlcbn1cbm1vZHVsZS5leHBvcnRzID0gTW9kYWxibGFuYztcbiIsIid1c2Ugc3RyaWN0Jztcbi8qIGpzaGludCBub2RlOiB0cnVlICovXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oc291cmNlLCBwcm9wZXJ0aWVzKSB7XG4gICAgdmFyIHByb3BlcnR5O1xuICAgIGZvciAocHJvcGVydHkgaW4gcHJvcGVydGllcykge1xuICAgICAgICBpZiAocHJvcGVydGllcy5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eSkpIHtcbiAgICAgICAgICAgIHNvdXJjZVtwcm9wZXJ0eV0gPSBwcm9wZXJ0aWVzW3Byb3BlcnR5XTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gc291cmNlO1xufTsiLCIndXNlIHN0cmljdCc7XG4vKiBqc2hpbnQgbm9kZTogdHJ1ZSAqL1xuXG52YXIgRXh0ZW5kRGVmYXVsdCA9IHJlcXVpcmUoJy4vZXh0ZW5kX2RlZmF1bHQnKTtcbnZhciBTdHJpbmdBc05vZGUgPSByZXF1aXJlKCcuL3N0cmluZ19hc19ub2RlJyk7XG5cbnZhciBJbWFnZVNsaWRlciA9IGZ1bmN0aW9uKCkge1xuICAgIGlmICghKHRoaXMgaW5zdGFuY2VvZiBJbWFnZVNsaWRlcikpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBJbWFnZVNsaWRlcigpO1xuICAgIH1cblxuICAgIHZhciBkZWZhdWx0cyA9IHtcbiAgICAgICAgc2VsZWN0b3I6ICcuc2xpZGVzJyxcbiAgICAgICAgdHJhbnNpdGlvbjogJ2ZhZGUtc2xpZGUnLFxuICAgICAgICBhdXRvUGxheTogZmFsc2VcbiAgICB9O1xuXG4gICAgaWYgKGFyZ3VtZW50c1swXSAmJiB0eXBlb2YgYXJndW1lbnRzWzBdID09PSAnb2JqZWN0Jykge1xuICAgICAgICB0aGlzLm9wdGlvbnMgPSBFeHRlbmREZWZhdWx0KGRlZmF1bHRzLCBhcmd1bWVudHNbMF0pO1xuICAgIH1cblxuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICB0aGlzLmN1cnJlbnRTbGlkZSA9IDA7XG4gICAgdGhpcy5wbGF5aW5nO1xuXG4gICAgdGhpcy5faW5pdCgpO1xuICAgIC8vIHRoaXMubmV4dFNsaWRlKClcbiAgICB0aGlzLnNsaWRlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5pbWFnZS1zbGlkZXItaG9sZGVyIC5pbWFnZS1zbGlkZXInKTtcbiAgICB0aGlzLnNldFNsaWRlKCk7XG5cbiAgICBpZiAodGhpcy5vcHRpb25zLmF1dG9QbGF5KSB7XG4gICAgICAgIHRoaXMucGxheSgpO1xuICAgIH1cbn07XG5cbkltYWdlU2xpZGVyLnByb3RvdHlwZS5faW5pdCA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuY3JlYXRlU2xpZGVzKCk7XG4gICAgc2V0RXZlbnRzLmNhbGwodGhpcyk7XG59O1xuXG5JbWFnZVNsaWRlci5wcm90b3R5cGUuY3JlYXRlU2xpZGVzID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5zbGlkZXMgPSBbXTtcbiAgICB2YXIgc2xpZGVzLFxuICAgICAgICBpbWFnZXMgPSB0aGlzLm9wdGlvbnMuc2VsZWN0b3I7XG5cbiAgICBpZiAoaW1hZ2VzIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgc2xpZGVzID0gaW1hZ2VzO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHNsaWRlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwodGhpcy5vcHRpb25zLnNlbGVjdG9yICsgJyBpbWcnKTtcbiAgICB9XG5cblxuICAgIHZhciBwYXJlbnRFbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGhpcy5vcHRpb25zLnBhcmVudCksXG4gICAgICAgIGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpLFxuICAgICAgICBzbGlkZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd1bCcpLFxuICAgICAgICBzbGlkZUltZyxcbiAgICAgICAgc2xpZGVyRWxtLFxuICAgICAgICBpbWdFbG07XG5cbiAgICBjb250YWluZXIuY2xhc3NOYW1lID0gJ2ltYWdlLXNsaWRlci1jb250YWluZXInO1xuICAgIHNsaWRlci5jbGFzc05hbWUgPSAnaW1hZ2Utc2xpZGVyLWhvbGRlcic7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNsaWRlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoc2xpZGVzW2ldLnNyYykge1xuICAgICAgICAgICAgc2xpZGVJbWcgPSBzbGlkZXNbaV0uc3JjO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc2xpZGVJbWcgPSBzbGlkZXNbaV07XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnNsaWRlcy5wdXNoKHtcbiAgICAgICAgICAgIGluZGV4OiBpLFxuICAgICAgICAgICAgZWw6IHNsaWRlc1tpXSxcbiAgICAgICAgICAgIGltYWdlczogc2xpZGVJbWdcbiAgICAgICAgfSk7XG5cbiAgICAgICAgc2xpZGVyRWxtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcbiAgICAgICAgc2xpZGVyRWxtLmNsYXNzTmFtZSA9ICdpbWFnZS1zbGlkZXInO1xuXG4gICAgICAgIGltZ0VsbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xuICAgICAgICBpbWdFbG0uc3JjID0gc2xpZGVJbWc7XG5cbiAgICAgICAgc2xpZGVyRWxtLmFwcGVuZENoaWxkKGltZ0VsbSk7XG4gICAgICAgIHNsaWRlci5hcHBlbmRDaGlsZChzbGlkZXJFbG0pO1xuICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoc2xpZGVyKTtcbiAgICAgICAgcGFyZW50RWwuYXBwZW5kQ2hpbGQoY29udGFpbmVyKTtcbiAgICB9XG5cbiAgICB0aGlzLnBsYXlCdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgdGhpcy5wbGF5QnRuLmlkID0gJ3BsYXktYnRuJztcbiAgICBzbGlkZXIuYXBwZW5kQ2hpbGQodGhpcy5wbGF5QnRuKTtcblxuICAgIHRoaXMucHJldmlvdXNCdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgdGhpcy5wcmV2aW91c0J0bi5pZCA9ICdwcmV2aW91cy1idG4nO1xuICAgIHNsaWRlci5hcHBlbmRDaGlsZCh0aGlzLnByZXZpb3VzQnRuKTtcblxuICAgIHRoaXMubmV4dEJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICB0aGlzLm5leHRCdG4uaWQgPSAnbmV4dC1idG4nO1xuICAgIHNsaWRlci5hcHBlbmRDaGlsZCh0aGlzLm5leHRCdG4pO1xufTtcblxuSW1hZ2VTbGlkZXIucHJvdG90eXBlLnNldFNsaWRlID0gZnVuY3Rpb24oKSB7XG4gICAgLy8gc2V0IHRoZSBzbGlkZXIgd2l0aCBpbWFnZSBzbGlkZXIgZWxlbWVudHMuXG4gICAgdmFyIGZpcnN0ID0gdGhpcy5zbGlkZXJbMF07XG4gICAgZmlyc3QuY2xhc3NMaXN0LmFkZCgnaXMtc2hvd2luZycpO1xufVxuXG5mdW5jdGlvbiBzZXRFdmVudHMoKSB7XG4gICAgdmFyIHBsYXlCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGxheS1idG4nKSxcbiAgICAgICAgcHJldmlvdXNCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncHJldmlvdXMtYnRuJyksXG4gICAgICAgIG5leHRCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbmV4dC1idG4nKSxcbiAgICAgICAgX3RoaXMgPSB0aGlzO1xuXG4gICAgcGxheUJ1dHRvbi5vbmNsaWNrID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmIChfdGhpcy5wbGF5aW5nKSB7XG4gICAgICAgICAgICBfdGhpcy5wYXVzZSgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgX3RoaXMucGxheSgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJldmlvdXNCdXR0b24ub25jbGljayA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBfdGhpcy5wYXVzZSgpO1xuICAgICAgICBfdGhpcy5wcmV2aW91c1NsaWRlKCk7XG4gICAgfVxuXG4gICAgbmV4dEJ1dHRvbi5vbmNsaWNrID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIF90aGlzLnBhdXNlKCk7XG4gICAgICAgIF90aGlzLm5leHRTbGlkZSgpO1xuICAgIH1cbn1cblxuSW1hZ2VTbGlkZXIucHJvdG90eXBlLm5leHRTbGlkZSA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuZ29Ub1NsaWRlKHRoaXMuY3VycmVudFNsaWRlICsgMSk7XG59XG5cbkltYWdlU2xpZGVyLnByb3RvdHlwZS5wcmV2aW91c1NsaWRlID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5nb1RvU2xpZGUodGhpcy5jdXJyZW50U2xpZGUgLSAxKTtcbn1cblxuSW1hZ2VTbGlkZXIucHJvdG90eXBlLmdvVG9TbGlkZSA9IGZ1bmN0aW9uKG4pIHtcbiAgICB2YXIgc2xpZGVzID0gdGhpcy5zbGlkZXI7XG5cbiAgICBzbGlkZXNbdGhpcy5jdXJyZW50U2xpZGVdLmNsYXNzTmFtZSA9ICdpbWFnZS1zbGlkZXInO1xuICAgIHRoaXMuY3VycmVudFNsaWRlID0gKG4gKyBzbGlkZXMubGVuZ3RoKSAlIHNsaWRlcy5sZW5ndGg7XG4gICAgc2xpZGVzW3RoaXMuY3VycmVudFNsaWRlXS5jbGFzc05hbWUgPSAnaW1hZ2Utc2xpZGVyIGlzLXNob3dpbmcnO1xufVxuXG5JbWFnZVNsaWRlci5wcm90b3R5cGUucGF1c2UgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnBsYXlCdG4uY2xhc3NMaXN0LnJlbW92ZSgnaXMtcGF1c2UnKTtcbiAgICB0aGlzLnBsYXlpbmcgPSBmYWxzZTtcbiAgICBjbGVhckludGVydmFsKHRoaXMuc2xpZGVJbnRlcnZhbCk7XG59XG5cbkltYWdlU2xpZGVyLnByb3RvdHlwZS5wbGF5ID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIHRoaXMucGxheUJ0bi5jbGFzc0xpc3QuYWRkKCdpcy1wYXVzZScpO1xuICAgIHRoaXMucGxheWluZyA9IHRydWU7XG4gICAgdGhpcy5zbGlkZUludGVydmFsID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKSB7XG4gICAgICAgIF90aGlzLm5leHRTbGlkZSgpO1xuICAgIH0sIDIwMDApO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEltYWdlU2xpZGVyO1xuIiwiJ3VzZSBzdHJpY3QnO1xuLyoganNoaW50IG5vZGU6IHRydWUgKi9cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihlbGVtZW50LCBodG1sKSB7XG4gICAgaWYgKGh0bWwgPT09IG51bGwpIHJldHVybjtcblxuICAgIHZhciBmcmFnID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpLFxuICAgICAgICB0bXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdib2R5JyksXG4gICAgICAgIGNoaWxkO1xuXG4gICAgdG1wLmlubmVySFRNTCA9IGh0bWw7XG5cbiAgICB3aGlsZSAoY2hpbGQgPSB0bXAuZmlyc3RDaGlsZCkge1xuICAgICAgICBmcmFnLmFwcGVuZENoaWxkKGNoaWxkKTtcbiAgICB9XG5cbiAgICBlbGVtZW50LmFwcGVuZENoaWxkKGZyYWcpO1xuICAgIGZyYWcgPSB0bXAgPSBudWxsO1xufTsiLCIndXNlIHN0cmljdCc7XG4vKiBqc2hpbnQgbm9kZTogdHJ1ZSAqL1xuXG4vKlxuICAgIHZhciB0ZW1wbGF0ZSA9ICc8cD5IZWxsbywgaWsgYmVuIDwldGhpcy5uYW1lJT4uIElrIGJlbiA8JXRoaXMucHJvZmlsZS5hZ2UlPiBqYWFyIG91ZCBlbiBiZW4gZXJnIDwldGhpcy5zdGF0ZSU+PC9wPic7XG4gICAgY29uc29sZS5sb2coVGVtcGxhdGVFbmdpbmUodGVtcGxhdGUsIHtcbiAgICAgICAgbmFtZTogJ0pob24gTWFqb29yJyxcbiAgICAgICAgcHJvZmlsZToge2FnZTogMzR9LFxuICAgICAgICBzdGF0ZTogJ2xpZWYnXG4gICAgfSkpO1xuXG4gICAgdmFyIHNraWxsVGVtcGxhdGUgPSBcbiAgICAgICAgJ015IFNraWxsczonICtcbiAgICAgICAgJzwlZm9yKHZhciBpbmRleCBpbiB0aGlzLnNraWxscykgeyU+JyArXG4gICAgICAgICc8YSBocmVmPVwiI1wiPjwldGhpcy5za2lsbHNbaW5kZXhdJT48L2E+JyArXG4gICAgICAgICc8JX0lPic7XG5cbiAgICBjb25zb2xlLmxvZyhUZW1wbGF0ZUVuZ2luZShza2lsbFRlbXBsYXRlLCB7XG4gICAgICAgIHNraWxsczogWydqcycsICdodG1sJywgJ2NzcyddXG4gICAgfSkpO1xuKi9cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihodG1sLCBvcHRpb25zKSB7XG4gICAgdmFyIHJlID0gLzwlKC4rPyklPi9nLFxuICAgICAgICByZUV4cCA9IC8oXiggKT8odmFyfGlmfGZvcnxlbHNlfHN3aXRjaHxjYXNlfGJyZWFrfHt8fXw7KSkoLiopPy9nLFxuICAgICAgICBjb2RlID0gJ3dpdGgob2JqKSB7IHZhciByPVtdO1xcbicsXG4gICAgICAgIGN1cnNvciA9IDAsXG4gICAgICAgIG1hdGNoLFxuICAgICAgICByZXN1bHQ7XG5cbiAgICB2YXIgYWRkID0gZnVuY3Rpb24obGluZSwganMpIHtcbiAgICAgICAganMgPyBjb2RlICs9IGxpbmUubWF0Y2gocmVFeHApID8gbGluZSArICdcXG4nIDogJ3IucHVzaCgnICsgbGluZSArICcpO1xcbicgOlxuICAgICAgICAgICAgKGNvZGUgKz0gbGluZSAhPSAnJyA/ICdyLnB1c2goXCInICsgbGluZS5yZXBsYWNlKC9cIi9nLCAnXFxcXFwiJykgKyAnXCIpO1xcbicgOiAnJyk7XG4gICAgICAgIHJldHVybiBhZGQ7XG4gICAgfVxuXG4gICAgd2hpbGUobWF0Y2ggPSByZS5leGVjKGh0bWwpKSB7XG4gICAgICAgIGFkZChodG1sLnNsaWNlKGN1cnNvciwgbWF0Y2guaW5kZXgpKShtYXRjaFsxXSwgdHJ1ZSk7XG4gICAgICAgIGN1cnNvciA9IG1hdGNoLmluZGV4ICsgbWF0Y2hbMF0ubGVuZ3RoO1xuICAgIH1cblxuICAgIGFkZChodG1sLnN1YnN0cihjdXJzb3IsIGh0bWwubGVuZ3RoIC0gY3Vyc29yKSk7XG4gICAgY29kZSA9IChjb2RlICsgJ3JldHVybiByLmpvaW4oXCJcIik7IH0nKS5yZXBsYWNlKC9bXFxyXFx0XFxuXS9nLCAnJyk7XG5cbiAgICB0cnkge1xuICAgICAgICByZXN1bHQgPSBuZXcgRnVuY3Rpb24oJ29iaicsIGNvZGUpLmFwcGx5KG9wdGlvbnMsIFtvcHRpb25zXSk7XG4gICAgfSBjYXRjaChlcnIpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihcIidcIiArIGVyci5tZXNzYWdlICsgXCInXCIsIFwiIGluIFxcblxcbkNvZGU6XFxuXCIsIGNvZGUsIFwiXFxuXCIpO1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG59Il19
