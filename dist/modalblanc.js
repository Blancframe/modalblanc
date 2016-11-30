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
        autoPlaySlider: false,
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
        // enable scroll
        enableScroll();
    }, false);

    document.onkeyup = null;
    document.onkeydown = null;
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
            selector: this.options.slider,
            autoPlay: this.options.autoPlaySlider
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

    keyboardActions.call(this);

    if (this.options.sideTwo.content === null) return;

    nextButton.addEventListener('click', this._contentNext.bind(this));
    prevButton.addEventListener('click', this._contentPrevious.bind(this));

}

function build() {
    this.modalContainer = document.getElementsByClassName('modal-fullscreen-container');
    if (this.options.closeButton) this.closeButton = '<span class="modal-fullscreen-close"></span>';

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

    // disable scroll
    disableScroll(modalId);

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

function keyboardActions() {
    var _this = this;

    document.onkeyup = function(e) {
        e.preventDefault();
        if (_this.settings.modalOpen && e.keyCode == 27) {
            _this.close();
        }
    }
}

function disableScroll(id) {
    var $body = document.getElementById(id),
        windowWidth = window.innerWidth;
    $body.style.width = windowWidth;
    $body.classList.add('is-stopped-scrolling');
}

function enableScroll() {
    var bodyId = document.getElementsByTagName('body'),
        id = bodyId[0].id,
        $body = document.getElementById(id);

    $body.style.width = '';
    $body.classList.remove('is-stopped-scrolling');
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

    keyboardActions.call(this);
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

function keyboardActions() {
    var _this = this;
    document.onkeydown = function(e) {
        e.preventDefault();
        if (e.keyCode == 37) {
            _this.previousSlide();
        } else if (e.keyCode == 39) {
            _this.nextSlide();
        }
    }
}
module.exports = ImageSlider;

},{"./extend_default":2}],4:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJpbmRleC5qcyIsImxpYi9leHRlbmRfZGVmYXVsdC5qcyIsImxpYi9pbWFnZV9zbGlkZXIuanMiLCJsaWIvc3RyaW5nX2FzX25vZGUuanMiLCJsaWIvdGVtcGxhdGUtZW5naW5lLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaFZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIid1c2Ugc3RyaWN0Jztcbi8qIGpzaGludCBub2RlOiB0cnVlICovXG5cbnZhciBFeHRlbmREZWZhdWx0ID0gcmVxdWlyZSgnLi9saWIvZXh0ZW5kX2RlZmF1bHQnKTtcbnZhciBJbWFnZVNsaWRlciA9IHJlcXVpcmUoJy4vbGliL2ltYWdlX3NsaWRlcicpO1xudmFyIFN0cmluZ0FzTm9kZSA9IHJlcXVpcmUoJy4vbGliL3N0cmluZ19hc19ub2RlJyk7XG52YXIgVGVtcGxhdGUgPSByZXF1aXJlKCcuL2xpYi90ZW1wbGF0ZS1lbmdpbmUnKTtcblxuXG52YXIgTW9kYWxibGFuYyA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoISh0aGlzIGluc3RhbmNlb2YgTW9kYWxibGFuYykpIHtcbiAgICAgIHJldHVybiBuZXcgTW9kYWxibGFuYygpO1xuICAgIH1cblxuICAgIHRoaXMuY2xvc2VCdXR0b24gPSBudWxsO1xuICAgIHRoaXMub3ZlcmxheSA9IG51bGw7XG5cbiAgICB2YXIgZGVmYXVsdHMgPSB7XG4gICAgICAgIGFuaW1hdGlvbjogJ2ZhZGUtaW4tb3V0JyxcbiAgICAgICAgY2xvc2VCdXR0b246IHRydWUsXG4gICAgICAgIGNvbnRlbnQ6ICcnLFxuICAgICAgICBzbGlkZXI6IG51bGwsXG4gICAgICAgIGF1dG9QbGF5U2xpZGVyOiBmYWxzZSxcbiAgICAgICAgc2lkZVR3bzoge1xuICAgICAgICAgICAgY29udGVudDogbnVsbCxcbiAgICAgICAgICAgIGFuaW1hdGlvbjogbnVsbCxcbiAgICAgICAgICAgIGJ1dHRvbjogbnVsbCxcbiAgICAgICAgICAgIGJ1dHRvbkJhY2s6IG51bGxcbiAgICAgICAgfSxcbiAgICAgIH07XG5cbiAgICB0aGlzLnNldHRpbmdzID0ge307XG5cbiAgICB0aGlzLmhhc1NsaWRlciA9IHRoaXMuaGFzU2xpZGVyID8gdHJ1ZSA6IGZhbHNlO1xuICAgIHRoaXMuc2xpZGVySXNPcGVuID0gZmFsc2U7XG5cbiAgICBpZiAoYXJndW1lbnRzWzBdICYmIHR5cGVvZiBhcmd1bWVudHNbMF0gPT09ICdvYmplY3QnKSB7XG4gICAgICAgIHRoaXMub3B0aW9ucyA9IEV4dGVuZERlZmF1bHQoZGVmYXVsdHMsIGFyZ3VtZW50c1swXSk7XG4gICAgfVxuXG59O1xuXG5Nb2RhbGJsYW5jLnByb3RvdHlwZS5vcGVuID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKHRoaXMuc2V0dGluZ3MubW9kYWxPcGVuKSByZXR1cm47XG5cbiAgICBidWlsZC5jYWxsKHRoaXMpO1xuICAgIHNldEV2ZW50cy5jYWxsKHRoaXMpO1xufTtcblxuTW9kYWxibGFuYy5wcm90b3R5cGUuY2xvc2UgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAoIXRoaXMuc2V0dGluZ3MubW9kYWxPcGVuKSByZXR1cm47XG5cbiAgICB2YXIgb3ZlcmxheSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdvdmVybGF5LW1vZGFsLWJsYW5jJyksXG4gICAgICAgIF90aGlzID0gdGhpcztcblxuICAgIG92ZXJsYXkuY2xhc3NMaXN0LnJlbW92ZSgnaXMtYWN0aXZlJyk7XG4gICAgb3ZlcmxheS5jbGFzc0xpc3QuYWRkKCdpcy1pbmFjdGl2ZScpO1xuXG4gICAgdmFyIHRyYW5zUHJlZml4ID0gdHJhbnNpdGlvblByZWZpeChvdmVybGF5KTtcblxuICAgIG92ZXJsYXkuYWRkRXZlbnRMaXN0ZW5lcih0cmFuc1ByZWZpeC5lbmQsIGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLnJlbW92ZSgpO1xuICAgICAgICBfdGhpcy5zZXR0aW5ncy5tb2RhbE9wZW4gPSBmYWxzZTtcbiAgICAgICAgLy8gZW5hYmxlIHNjcm9sbFxuICAgICAgICBlbmFibGVTY3JvbGwoKTtcbiAgICB9LCBmYWxzZSk7XG5cbiAgICBkb2N1bWVudC5vbmtleXVwID0gbnVsbDtcbiAgICBkb2N1bWVudC5vbmtleWRvd24gPSBudWxsO1xufTtcblxuTW9kYWxibGFuYy5wcm90b3R5cGUuc2xpZGVySW5pdCA9IGZ1bmN0aW9uKHNpZGUpIHtcbiAgICBpZiAodGhpcy5vcHRpb25zLnNsaWRlciAhPT0gbnVsbCkge1xuICAgICAgICB0aGlzLmhhc1NsaWRlciA9IHRydWU7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuaGFzU2xpZGVyKSB7XG4gICAgICAgIHRoaXMub3BlbigpO1xuICAgICAgICB0aGlzLnNsaWRlcklzT3BlbiA9IHRydWU7XG5cbiAgICAgICAgdGhpcy5zbGlkZXIgPSBuZXcgSW1hZ2VTbGlkZXIoe1xuICAgICAgICAgICAgcGFyZW50OiBzaWRlLFxuICAgICAgICAgICAgc2VsZWN0b3I6IHRoaXMub3B0aW9ucy5zbGlkZXIsXG4gICAgICAgICAgICBhdXRvUGxheTogdGhpcy5vcHRpb25zLmF1dG9QbGF5U2xpZGVyXG4gICAgICAgIH0pO1xuICAgIH1cbn07XG5cbk1vZGFsYmxhbmMucHJvdG90eXBlLl9jb250ZW50TmV4dCA9IGZ1bmN0aW9uKCkge1xuICAgIGlmICh0aGlzLmhhc1NsaWRlcikge1xuICAgICAgICB0aGlzLnNsaWRlcklzT3BlbiA9IGZhbHNlO1xuICAgICAgICBpZiAodGhpcy5zbGlkZXIucGxheWluZykgdGhpcy5zbGlkZXIucGF1c2UoKTtcbiAgICAgICAgcmVtb3ZlQ2xhc3ModGhpcy5tb2RhbENvbnRhaW5lciwgJ3NsaWRlci1tb2RhbCcpO1xuICAgICAgICBhZGRDbGFzcyh0aGlzLm1vZGFsQ29udGFpbmVyLCAnYmlnLW1vZGFsJyk7XG4gICAgfVxuXG4gICAgdmFyIGNhcmQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2FyZCcpLFxuICAgICAgICBjdXN0b21DbGFzcyA9IHRoaXMub3B0aW9ucy5zaWRlVHdvLmFuaW1hdGlvbjtcblxuICAgIGNhcmQuY2xhc3NMaXN0LnJlbW92ZSh0eXBlT2ZBbmltYXRpb24oY3VzdG9tQ2xhc3MsIDIpKTtcbiAgICBjYXJkLmNsYXNzTGlzdC5hZGQodHlwZU9mQW5pbWF0aW9uKGN1c3RvbUNsYXNzKSk7XG59O1xuXG5Nb2RhbGJsYW5jLnByb3RvdHlwZS5fY29udGVudFByZXZpb3VzID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKHRoaXMuaGFzU2xpZGVyKSB7XG4gICAgICAgIC8vIGlmICghdGhpcy5zbGlkZXIucGxheWluZykgdGhpcy5zbGlkZXIucGxheSgpO1xuICAgICAgICByZW1vdmVDbGFzcyh0aGlzLm1vZGFsQ29udGFpbmVyLCAnYmlnLW1vZGFsJyk7XG4gICAgICAgIGFkZENsYXNzKHRoaXMubW9kYWxDb250YWluZXIsICdzbGlkZXItbW9kYWwnKTtcbiAgICB9XG5cbiAgICB2YXIgY2FyZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjYXJkJyksXG4gICAgICAgIGN1c3RvbUNsYXNzID0gdGhpcy5vcHRpb25zLnNpZGVUd28uYW5pbWF0aW9uO1xuXG4gICAgY2FyZC5jbGFzc0xpc3QucmVtb3ZlKHR5cGVPZkFuaW1hdGlvbihjdXN0b21DbGFzcykpO1xuICAgIGNhcmQuY2xhc3NMaXN0LmFkZCh0eXBlT2ZBbmltYXRpb24oY3VzdG9tQ2xhc3MsIDIpKTtcbn07XG5cbk1vZGFsYmxhbmMucHJvdG90eXBlLmNsYXNzRXZlbnRMaXN0ZW5lciA9IGZ1bmN0aW9uKGVsbSwgY2FsbGJhY2spIHtcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbG0ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgZWxtW2ldLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICB9KTtcbiAgICB9XG59O1xuXG5mdW5jdGlvbiB0eXBlT2ZBbmltYXRpb24odHlwZSwgdHlwZUNsYXNzKSB7XG4gICAgdmFyIGFuaW1hdGlvblR5cGVzID0ge1xuICAgICAgICAgICAgJ3NsaWRlJzogWydzbGlkZS1uZXh0JywgJ3NsaWRlLWJhY2snXSxcbiAgICAgICAgICAgICdzY2FsZSc6IFsnc2NhbGUtbmV4dCcsICdzY2FsZS1iYWNrJ11cbiAgICAgICAgfSxcbiAgICAgICAgYW5pbWF0aW9uQ2xhc3MgPSBhbmltYXRpb25UeXBlc1t0eXBlXTtcblxuICAgICAgICBpZiAodHlwZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBpZiAodHlwZUNsYXNzID09PSAyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGFuaW1hdGlvblR5cGVzLnNsaWRlWzFdO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYW5pbWF0aW9uVHlwZXMuc2xpZGVbMF07XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZUNsYXNzID09PSAyKSB7XG4gICAgICAgICAgICByZXR1cm4gYW5pbWF0aW9uQ2xhc3NbMV07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gYW5pbWF0aW9uQ2xhc3NbMF07XG4gICAgICAgIH1cbn1cblxuZnVuY3Rpb24gdHJhbnNpdGlvblByZWZpeChlbG0pIHtcbiAgICB2YXIgdHJhbnNFbmRFdmVudE5hbWVzID0ge1xuICAgICAgICAnV2Via2l0VHJhbnNpdGlvbicgOiAnd2Via2l0VHJhbnNpdGlvbkVuZCcsXG4gICAgICAgICdNb3pUcmFuc2l0aW9uJyAgICA6ICd0cmFuc2l0aW9uZW5kJyxcbiAgICAgICAgJ09UcmFuc2l0aW9uJyAgICAgIDogJ29UcmFuc2l0aW9uRW5kIG90cmFuc2l0aW9uZW5kJyxcbiAgICAgICAgJ3RyYW5zaXRpb24nICAgICAgIDogJ3RyYW5zaXRpb25lbmQnXG4gICAgfTtcblxuICAgIGZvciAodmFyIG5hbWUgaW4gdHJhbnNFbmRFdmVudE5hbWVzKSB7XG4gICAgICBpZiAoZWxtLnN0eWxlW25hbWVdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGVuZDogdHJhbnNFbmRFdmVudE5hbWVzW25hbWVdXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfVxufVxuXG5mdW5jdGlvbiBzZXRFdmVudHMoKSB7XG4gICAgdmFyIG5leHRCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbW9kYWwtYnV0dG9uLW5leHQnKSxcbiAgICAgICAgcHJldkJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtb2RhbC1idXR0b24tcHJldicpLFxuICAgICAgICBjbG9zZWQgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdtb2RhbC1mdWxsc2NyZWVuLWNsb3NlJyksXG4gICAgICAgIF90aGlzID0gdGhpcztcblxuICAgIHRoaXMuY2xhc3NFdmVudExpc3RlbmVyKGNsb3NlZCwgZnVuY3Rpb24oKSB7XG4gICAgICAgIF90aGlzLmNsb3NlKCk7XG4gICAgfSk7XG5cbiAgICBrZXlib2FyZEFjdGlvbnMuY2FsbCh0aGlzKTtcblxuICAgIGlmICh0aGlzLm9wdGlvbnMuc2lkZVR3by5jb250ZW50ID09PSBudWxsKSByZXR1cm47XG5cbiAgICBuZXh0QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5fY29udGVudE5leHQuYmluZCh0aGlzKSk7XG4gICAgcHJldkJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuX2NvbnRlbnRQcmV2aW91cy5iaW5kKHRoaXMpKTtcblxufVxuXG5mdW5jdGlvbiBidWlsZCgpIHtcbiAgICB0aGlzLm1vZGFsQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnbW9kYWwtZnVsbHNjcmVlbi1jb250YWluZXInKTtcbiAgICBpZiAodGhpcy5vcHRpb25zLmNsb3NlQnV0dG9uKSB0aGlzLmNsb3NlQnV0dG9uID0gJzxzcGFuIGNsYXNzPVwibW9kYWwtZnVsbHNjcmVlbi1jbG9zZVwiPjwvc3Bhbj4nO1xuXG4gICAgdmFyIGNvbnRlbnRTaWRlT25lID0gIXRoaXMub3B0aW9ucy5zbGlkZXIgPyBjb250ZW50VHlwZSh0aGlzLm9wdGlvbnMuY29udGVudCkgOiBjb250ZW50VHlwZSgnPGRpdiBpZD1cIm1vZGFsLXNsaWRlclwiPjwvZGl2PicpO1xuXG4gICAgdmFyIHR5cGVNb2RhbCA9IHRoaXMub3B0aW9ucy5zbGlkZXIgPyAnc2xpZGVyLW1vZGFsJyA6ICdiaWctbW9kYWwnO1xuICAgIHZhciBtb2RhbCA9ICc8ZGl2IGlkPVwib3ZlcmxheS1tb2RhbC1ibGFuY1wiIGNsYXNzPVwibW9kYWwtZnVsbHNjcmVlbi1iYWNrZ3JvdW5kIDwldGhpcy5hbmltYXRpb24lPiA8JXRoaXMuc3RhdGUlPlwiPicgK1xuICAgICAgICAgICAgICAgICAgICAnPGRpdiBpZD1cIm1vZGFsLWZ1bGxzY3JlZW4tY29udGFpbmVyXCJjbGFzcz1cIm1vZGFsLWZ1bGxzY3JlZW4tY29udGFpbmVyIDwldGhpcy50eXBlJT4gXCI+JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAnPGRpdiBpZD1cImNhcmRcIj4nK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiZnJvbnRcIj4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJzxkaXYgaWQ9XCJmcm9udC1jYXJkXCIgY2xhc3M9XCJtb2RhbC1mdWxsc2NyZWVuLWl0ZW1cIj4nK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJzwldGhpcy5jbG9zZUJ1dHRvbiU+JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPCV0aGlzLmNvbnRlbnRUeXBlU2lkZU9uZSU+JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8L2Rpdj4nK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8L2Rpdj4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cImJhY2tcIj4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJzxkaXYgIGlkPVwiYmFjay1jYXJkXCIgY2xhc3M9XCJtb2RhbC1mdWxsc2NyZWVuLWl0ZW1cIj4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8JXRoaXMuY2xvc2VCdXR0b24lPicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJzwldGhpcy5jb250ZW50VHlwZVNpZGVUd28lPicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPC9kaXY+JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJzwvZGl2PicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJzwvZGl2PicgK1xuICAgICAgICAgICAgICAgICAgICAnPC9kaXY+JyArXG4gICAgICAgICAgICAgICAgJzwvZGl2Pic7XG5cbiAgICB2YXIgbW9kYWxUZW1wbGF0ZSA9IFRlbXBsYXRlKG1vZGFsLCB7XG4gICAgICAgIGFuaW1hdGlvbjogdGhpcy5vcHRpb25zLmFuaW1hdGlvbixcbiAgICAgICAgc3RhdGU6ICdpcy1hY3RpdmUnLFxuICAgICAgICB0eXBlOiB0eXBlTW9kYWwsXG4gICAgICAgIGNsb3NlQnV0dG9uOiB0aGlzLmNsb3NlQnV0dG9uLFxuICAgICAgICBjb250ZW50VHlwZVNpZGVPbmU6IGNvbnRlbnRTaWRlT25lLFxuICAgICAgICBjb250ZW50VHlwZVNpZGVUd286IGNvbnRlbnRUeXBlKHRoaXMub3B0aW9ucy5zaWRlVHdvLmNvbnRlbnQpXG4gICAgfSk7XG5cbiAgICB2YXIgYm9keSA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdib2R5JyksXG4gICAgICAgIG1vZGFsSWQ7XG5cbiAgICBpZiAoYm9keVswXS5pZCkge1xuICAgICAgICBtb2RhbElkID0gYm9keVswXS5pZDtcbiAgICB9IGVsc2Uge1xuICAgICAgICBtb2RhbElkID0gJ2dvLW1vZGFsJztcbiAgICAgICAgYm9keVswXS5pZCA9IG1vZGFsSWQ7XG4gICAgfVxuXG4gICAgU3RyaW5nQXNOb2RlKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKG1vZGFsSWQpLCBtb2RhbFRlbXBsYXRlKTtcbiAgICB0aGlzLnNldHRpbmdzLm1vZGFsT3BlbiA9IHRydWU7XG5cbiAgICAvLyBkaXNhYmxlIHNjcm9sbFxuICAgIGRpc2FibGVTY3JvbGwobW9kYWxJZCk7XG5cbiAgICBpZiAodGhpcy5vcHRpb25zLnNsaWRlcikgdGhpcy5zbGlkZXJJbml0KCcjbW9kYWwtc2xpZGVyJyk7XG5cbiAgICBpZiAodGhpcy5vcHRpb25zLnNpZGVUd28uY29udGVudCA9PT0gbnVsbCkgcmV0dXJuO1xuXG4gICAgYnVpbGRCdXR0b24odGhpcy5vcHRpb25zLnNpZGVUd28uYnV0dG9uKTtcbiAgICBidWlsZEJ1dHRvbih0aGlzLm9wdGlvbnMuc2lkZVR3by5idXR0b25CYWNrLCAnYmFjaycpO1xufVxuXG5mdW5jdGlvbiBidWlsZEVsZW1lbnQoYnVpbGRPcHRpb25zKSB7XG4gICAgdmFyIGNyZWF0ZUVsbSxcbiAgICAgICAgcGFyZW50RWxtO1xuXG4gICAgY3JlYXRlRWxtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChidWlsZE9wdGlvbnMuZWxtKTtcbiAgICBjcmVhdGVFbG0uaWQgPSBidWlsZE9wdGlvbnMuYnV0dG9uSWQ7XG4gICAgY3JlYXRlRWxtLmlubmVySFRNTCA9IGJ1aWxkT3B0aW9ucy5idXR0b25UZXh0O1xuICAgIHBhcmVudEVsbSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGJ1aWxkT3B0aW9ucy5wYXJlbnRJZCk7XG5cbiAgICBwYXJlbnRFbG0uYXBwZW5kQ2hpbGQoY3JlYXRlRWxtKTtcbn1cblxuXG5mdW5jdGlvbiBidWlsZEJ1dHRvbihlbG0pIHtcbiAgICB2YXIgYnV0dG9uLFxuICAgICAgICBjb21wdXRlZEJ1dHRvbixcbiAgICAgICAgY29tcHV0ZWRCdXR0b25CYWNrLFxuICAgICAgICBmcm9udENhcmQsXG4gICAgICAgIGJhY2tDYXJkO1xuXG4gICAgaWYgKGVsbSA9PT0gbnVsbCB8fCBlbG0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBpZiAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21vZGFsLWJ1dHRvbi1uZXh0JykgfHwgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21vZGFsLWJ1dHRvbi1wcmV2JykpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGJ1aWxkRWxlbWVudCh7XG4gICAgICAgICAgICAgICAgZWxtOiAnYScsXG4gICAgICAgICAgICAgICAgYnV0dG9uSWQ6ICdtb2RhbC1idXR0b24tbmV4dCcsXG4gICAgICAgICAgICAgICAgYnV0dG9uVGV4dDogJ05leHQgc3RlcCcsXG4gICAgICAgICAgICAgICAgcGFyZW50SWQ6ICdmcm9udC1jYXJkJ1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGJ1aWxkRWxlbWVudCh7XG4gICAgICAgICAgICAgICAgZWxtOiAnYScsXG4gICAgICAgICAgICAgICAgYnV0dG9uSWQ6ICdtb2RhbC1idXR0b24tcHJldicsXG4gICAgICAgICAgICAgICAgYnV0dG9uVGV4dDogJ1ByZXZpb3VzIHN0ZXAnLFxuICAgICAgICAgICAgICAgIHBhcmVudElkOiAnYmFjay1jYXJkJ1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgICBidWlsZEVsZW1lbnQoe1xuICAgICAgICAgICAgZWxtOiBlbG0uZWxlbWVudCxcbiAgICAgICAgICAgIGJ1dHRvbklkOiBlbG0uaWQsXG4gICAgICAgICAgICBidXR0b25UZXh0OiBlbG0udGV4dCxcbiAgICAgICAgICAgIHBhcmVudElkOiBlbG0ucGFyZW50LFxuICAgICAgICB9KTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGNvbnRlbnRUeXBlKGNvbnRlbnRWYWx1ZSkge1xuICAgIGlmICh0eXBlb2YgY29udGVudFZhbHVlID09PSAnc3RyaW5nJykge1xuICAgICAgICByZXR1cm4gY29udGVudFZhbHVlO1xuICAgIH0gZWxzZSBpZiAoY29udGVudFZhbHVlID09PSBudWxsKSB7XG4gICAgICAgIHJldHVybiAnJztcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gY29udGVudFZhbHVlLmlubmVySFRNTDtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGFkZENsYXNzKHNlbGVjdG9yLCBjbGFzc05hbWUpIHtcbiAgICBzZWxlY3RvclswXS5jbGFzc0xpc3QuYWRkKGNsYXNzTmFtZSlcbn1cblxuZnVuY3Rpb24gcmVtb3ZlQ2xhc3Moc2VsZWN0b3IsIGNsYXNzTmFtZSkge1xuICAgIHNlbGVjdG9yWzBdLmNsYXNzTGlzdC5yZW1vdmUoY2xhc3NOYW1lKVxufVxuXG5mdW5jdGlvbiBrZXlib2FyZEFjdGlvbnMoKSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIGRvY3VtZW50Lm9ua2V5dXAgPSBmdW5jdGlvbihlKSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgaWYgKF90aGlzLnNldHRpbmdzLm1vZGFsT3BlbiAmJiBlLmtleUNvZGUgPT0gMjcpIHtcbiAgICAgICAgICAgIF90aGlzLmNsb3NlKCk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmZ1bmN0aW9uIGRpc2FibGVTY3JvbGwoaWQpIHtcbiAgICB2YXIgJGJvZHkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCksXG4gICAgICAgIHdpbmRvd1dpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XG4gICAgJGJvZHkuc3R5bGUud2lkdGggPSB3aW5kb3dXaWR0aDtcbiAgICAkYm9keS5jbGFzc0xpc3QuYWRkKCdpcy1zdG9wcGVkLXNjcm9sbGluZycpO1xufVxuXG5mdW5jdGlvbiBlbmFibGVTY3JvbGwoKSB7XG4gICAgdmFyIGJvZHlJZCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdib2R5JyksXG4gICAgICAgIGlkID0gYm9keUlkWzBdLmlkLFxuICAgICAgICAkYm9keSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTtcblxuICAgICRib2R5LnN0eWxlLndpZHRoID0gJyc7XG4gICAgJGJvZHkuY2xhc3NMaXN0LnJlbW92ZSgnaXMtc3RvcHBlZC1zY3JvbGxpbmcnKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBNb2RhbGJsYW5jO1xuIiwiJ3VzZSBzdHJpY3QnO1xuLyoganNoaW50IG5vZGU6IHRydWUgKi9cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihzb3VyY2UsIHByb3BlcnRpZXMpIHtcbiAgICB2YXIgcHJvcGVydHk7XG4gICAgZm9yIChwcm9wZXJ0eSBpbiBwcm9wZXJ0aWVzKSB7XG4gICAgICAgIGlmIChwcm9wZXJ0aWVzLmhhc093blByb3BlcnR5KHByb3BlcnR5KSkge1xuICAgICAgICAgICAgc291cmNlW3Byb3BlcnR5XSA9IHByb3BlcnRpZXNbcHJvcGVydHldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBzb3VyY2U7XG59OyIsIid1c2Ugc3RyaWN0Jztcbi8qIGpzaGludCBub2RlOiB0cnVlICovXG5cbnZhciBFeHRlbmREZWZhdWx0ID0gcmVxdWlyZSgnLi9leHRlbmRfZGVmYXVsdCcpO1xuXG52YXIgSW1hZ2VTbGlkZXIgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAoISh0aGlzIGluc3RhbmNlb2YgSW1hZ2VTbGlkZXIpKSB7XG4gICAgICAgIHJldHVybiBuZXcgSW1hZ2VTbGlkZXIoKTtcbiAgICB9XG5cbiAgICB2YXIgZGVmYXVsdHMgPSB7XG4gICAgICAgIHNlbGVjdG9yOiAnLnNsaWRlcycsXG4gICAgICAgIHRyYW5zaXRpb246ICdmYWRlLXNsaWRlJyxcbiAgICAgICAgYXV0b1BsYXk6IGZhbHNlXG4gICAgfTtcblxuICAgIGlmIChhcmd1bWVudHNbMF0gJiYgdHlwZW9mIGFyZ3VtZW50c1swXSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgdGhpcy5vcHRpb25zID0gRXh0ZW5kRGVmYXVsdChkZWZhdWx0cywgYXJndW1lbnRzWzBdKTtcbiAgICB9XG5cbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgdGhpcy5jdXJyZW50U2xpZGUgPSAwO1xuICAgIHRoaXMucGxheWluZztcbiAgICB0aGlzLl9pbml0KCk7XG4gICAgdGhpcy5zbGlkZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuaW1hZ2Utc2xpZGVyLWhvbGRlciAuaW1hZ2Utc2xpZGVyJyk7XG4gICAgdGhpcy5zZXRTbGlkZSgpO1xuXG4gICAgaWYgKHRoaXMub3B0aW9ucy5hdXRvUGxheSkge1xuICAgICAgICB0aGlzLnBsYXkoKTtcbiAgICB9XG59O1xuXG5JbWFnZVNsaWRlci5wcm90b3R5cGUuX2luaXQgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmNyZWF0ZVNsaWRlcygpO1xuICAgIHNldEV2ZW50cy5jYWxsKHRoaXMpO1xufTtcblxuSW1hZ2VTbGlkZXIucHJvdG90eXBlLmNyZWF0ZVNsaWRlcyA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuc2xpZGVzID0gW107XG4gICAgdmFyIHNsaWRlcyxcbiAgICAgICAgaW1hZ2VzID0gdGhpcy5vcHRpb25zLnNlbGVjdG9yO1xuXG4gICAgaWYgKGltYWdlcyBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgIHNsaWRlcyA9IGltYWdlcztcbiAgICB9IGVsc2Uge1xuICAgICAgICBzbGlkZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHRoaXMub3B0aW9ucy5zZWxlY3RvciArICcgaW1nJyk7XG4gICAgfVxuXG5cbiAgICB2YXIgcGFyZW50RWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRoaXMub3B0aW9ucy5wYXJlbnQpLFxuICAgICAgICBjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSxcbiAgICAgICAgc2xpZGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndWwnKSxcbiAgICAgICAgc2xpZGVJbWcsXG4gICAgICAgIHNsaWRlckVsbSxcbiAgICAgICAgaW1nRWxtO1xuXG4gICAgY29udGFpbmVyLmNsYXNzTmFtZSA9ICdpbWFnZS1zbGlkZXItY29udGFpbmVyJztcbiAgICBzbGlkZXIuY2xhc3NOYW1lID0gJ2ltYWdlLXNsaWRlci1ob2xkZXInO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzbGlkZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKHNsaWRlc1tpXS5zcmMpIHtcbiAgICAgICAgICAgIHNsaWRlSW1nID0gc2xpZGVzW2ldLnNyYztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNsaWRlSW1nID0gc2xpZGVzW2ldO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zbGlkZXMucHVzaCh7XG4gICAgICAgICAgICBpbmRleDogaSxcbiAgICAgICAgICAgIGVsOiBzbGlkZXNbaV0sXG4gICAgICAgICAgICBpbWFnZXM6IHNsaWRlSW1nXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHNsaWRlckVsbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XG4gICAgICAgIHNsaWRlckVsbS5jbGFzc05hbWUgPSAnaW1hZ2Utc2xpZGVyJztcblxuICAgICAgICBpbWdFbG0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKTtcbiAgICAgICAgaW1nRWxtLnNyYyA9IHNsaWRlSW1nO1xuXG4gICAgICAgIHNsaWRlckVsbS5hcHBlbmRDaGlsZChpbWdFbG0pO1xuICAgICAgICBzbGlkZXIuYXBwZW5kQ2hpbGQoc2xpZGVyRWxtKTtcbiAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKHNsaWRlcik7XG4gICAgICAgIHBhcmVudEVsLmFwcGVuZENoaWxkKGNvbnRhaW5lcik7XG4gICAgfVxuXG4gICAgdGhpcy5wbGF5QnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgIHRoaXMucGxheUJ0bi5pZCA9ICdwbGF5LWJ0bic7XG4gICAgc2xpZGVyLmFwcGVuZENoaWxkKHRoaXMucGxheUJ0bik7XG5cbiAgICB0aGlzLnByZXZpb3VzQnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgIHRoaXMucHJldmlvdXNCdG4uaWQgPSAncHJldmlvdXMtYnRuJztcbiAgICBzbGlkZXIuYXBwZW5kQ2hpbGQodGhpcy5wcmV2aW91c0J0bik7XG5cbiAgICB0aGlzLm5leHRCdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgdGhpcy5uZXh0QnRuLmlkID0gJ25leHQtYnRuJztcbiAgICBzbGlkZXIuYXBwZW5kQ2hpbGQodGhpcy5uZXh0QnRuKTtcbn07XG5cbkltYWdlU2xpZGVyLnByb3RvdHlwZS5zZXRTbGlkZSA9IGZ1bmN0aW9uKCkge1xuICAgIC8vIHNldCB0aGUgc2xpZGVyIHdpdGggaW1hZ2Ugc2xpZGVyIGVsZW1lbnRzLlxuICAgIHZhciBmaXJzdCA9IHRoaXMuc2xpZGVyWzBdO1xuICAgIGZpcnN0LmNsYXNzTGlzdC5hZGQoJ2lzLXNob3dpbmcnKTtcbn1cblxuZnVuY3Rpb24gc2V0RXZlbnRzKCkge1xuICAgIHZhciBwbGF5QnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BsYXktYnRuJyksXG4gICAgICAgIHByZXZpb3VzQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3ByZXZpb3VzLWJ0bicpLFxuICAgICAgICBuZXh0QnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ25leHQtYnRuJyksXG4gICAgICAgIF90aGlzID0gdGhpcztcblxuICAgIHBsYXlCdXR0b24ub25jbGljayA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAoX3RoaXMucGxheWluZykge1xuICAgICAgICAgICAgX3RoaXMucGF1c2UoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIF90aGlzLnBsYXkoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByZXZpb3VzQnV0dG9uLm9uY2xpY2sgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgX3RoaXMucGF1c2UoKTtcbiAgICAgICAgX3RoaXMucHJldmlvdXNTbGlkZSgpO1xuICAgIH1cblxuICAgIG5leHRCdXR0b24ub25jbGljayA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBfdGhpcy5wYXVzZSgpO1xuICAgICAgICBfdGhpcy5uZXh0U2xpZGUoKTtcbiAgICB9XG5cbiAgICBrZXlib2FyZEFjdGlvbnMuY2FsbCh0aGlzKTtcbn1cblxuSW1hZ2VTbGlkZXIucHJvdG90eXBlLm5leHRTbGlkZSA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuZ29Ub1NsaWRlKHRoaXMuY3VycmVudFNsaWRlICsgMSwgJ25leHQnKTtcbn1cblxuSW1hZ2VTbGlkZXIucHJvdG90eXBlLnByZXZpb3VzU2xpZGUgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmdvVG9TbGlkZSh0aGlzLmN1cnJlbnRTbGlkZSAtIDEsICdwcmV2aW91cycpO1xufVxuXG5JbWFnZVNsaWRlci5wcm90b3R5cGUuZ29Ub1NsaWRlID0gZnVuY3Rpb24obiwgc2lkZSkge1xuICAgIHZhciBzbGlkZXMgPSB0aGlzLnNsaWRlcjtcblxuICAgIHNsaWRlc1t0aGlzLmN1cnJlbnRTbGlkZV0uY2xhc3NOYW1lID0gc2lkZSArICcgaW1hZ2Utc2xpZGVyJztcbiAgICB0aGlzLmN1cnJlbnRTbGlkZSA9IChuICsgc2xpZGVzLmxlbmd0aCkgJSBzbGlkZXMubGVuZ3RoO1xuICAgIHNsaWRlc1t0aGlzLmN1cnJlbnRTbGlkZV0uY2xhc3NOYW1lID0gc2lkZSArICcgaW1hZ2Utc2xpZGVyIGlzLXNob3dpbmcnO1xuXG4gICAgaWYgKHNpZGUgPT09ICdwcmV2aW91cycpIHtcbiAgICAgICAgdGhpcy5wcmV2U2xpZGUgPSAodGhpcy5jdXJyZW50U2xpZGUgKyAxKSAlIHNsaWRlcy5sZW5ndGg7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5wcmV2U2xpZGUgPSAodGhpcy5jdXJyZW50U2xpZGUgLSAxKSAlIHNsaWRlcy5sZW5ndGg7XG4gICAgfVxuXG4gICAgaWYgKHNpZGUgPT09ICdwcmV2aW91cycpIHtcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFNsaWRlID09PSBzbGlkZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICBzbGlkZXNbc2xpZGVzLmxlbmd0aCArICAgMV0uY2xhc3NOYW1lID0gc2lkZSArICcgaW1hZ2Utc2xpZGVyIGlzLWhpZGluZyc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzbGlkZXNbdGhpcy5wcmV2U2xpZGVdLmNsYXNzTmFtZSA9IHNpZGUgKyAnIGltYWdlLXNsaWRlciBpcy1oaWRpbmcnO1xuICAgICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFNsaWRlID09PSAwKSB7XG4gICAgICAgICAgICBzbGlkZXNbc2xpZGVzLmxlbmd0aCAtIDFdLmNsYXNzTmFtZSA9IHNpZGUgKyAnIGltYWdlLXNsaWRlciBpcy1oaWRpbmcnO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc2xpZGVzW3RoaXMucHJldlNsaWRlXS5jbGFzc05hbWUgPSBzaWRlICsgJyBpbWFnZS1zbGlkZXIgaXMtaGlkaW5nJztcbiAgICAgICAgfVxuICAgIH1cbn1cblxuSW1hZ2VTbGlkZXIucHJvdG90eXBlLnBhdXNlID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5wbGF5QnRuLmNsYXNzTGlzdC5yZW1vdmUoJ2lzLXBhdXNlJyk7XG4gICAgdGhpcy5wbGF5aW5nID0gZmFsc2U7XG4gICAgY2xlYXJJbnRlcnZhbCh0aGlzLnNsaWRlSW50ZXJ2YWwpO1xufVxuXG5JbWFnZVNsaWRlci5wcm90b3R5cGUucGxheSA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICB0aGlzLnBsYXlCdG4uY2xhc3NMaXN0LmFkZCgnaXMtcGF1c2UnKTtcbiAgICB0aGlzLnBsYXlpbmcgPSB0cnVlO1xuICAgIHRoaXMuc2xpZGVJbnRlcnZhbCA9IHNldEludGVydmFsKGZ1bmN0aW9uKCkge1xuICAgICAgICBfdGhpcy5uZXh0U2xpZGUoKTtcbiAgICB9LCAyMDAwKTtcbn1cblxuZnVuY3Rpb24ga2V5Ym9hcmRBY3Rpb25zKCkge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgZG9jdW1lbnQub25rZXlkb3duID0gZnVuY3Rpb24oZSkge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGlmIChlLmtleUNvZGUgPT0gMzcpIHtcbiAgICAgICAgICAgIF90aGlzLnByZXZpb3VzU2xpZGUoKTtcbiAgICAgICAgfSBlbHNlIGlmIChlLmtleUNvZGUgPT0gMzkpIHtcbiAgICAgICAgICAgIF90aGlzLm5leHRTbGlkZSgpO1xuICAgICAgICB9XG4gICAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSBJbWFnZVNsaWRlcjtcbiIsIid1c2Ugc3RyaWN0Jztcbi8qIGpzaGludCBub2RlOiB0cnVlICovXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZWxlbWVudCwgaHRtbCkge1xuICAgIGlmIChodG1sID09PSBudWxsKSByZXR1cm47XG5cbiAgICB2YXIgZnJhZyA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKSxcbiAgICAgICAgdG1wID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYm9keScpLFxuICAgICAgICBjaGlsZDtcblxuICAgIHRtcC5pbm5lckhUTUwgPSBodG1sO1xuXG4gICAgd2hpbGUgKGNoaWxkID0gdG1wLmZpcnN0Q2hpbGQpIHtcbiAgICAgICAgZnJhZy5hcHBlbmRDaGlsZChjaGlsZCk7XG4gICAgfVxuXG4gICAgZWxlbWVudC5hcHBlbmRDaGlsZChmcmFnKTtcbiAgICBmcmFnID0gdG1wID0gbnVsbDtcbn07IiwiJ3VzZSBzdHJpY3QnO1xuLyoganNoaW50IG5vZGU6IHRydWUgKi9cblxuLypcbiAgICB2YXIgdGVtcGxhdGUgPSAnPHA+SGVsbG8sIGlrIGJlbiA8JXRoaXMubmFtZSU+LiBJayBiZW4gPCV0aGlzLnByb2ZpbGUuYWdlJT4gamFhciBvdWQgZW4gYmVuIGVyZyA8JXRoaXMuc3RhdGUlPjwvcD4nO1xuICAgIGNvbnNvbGUubG9nKFRlbXBsYXRlRW5naW5lKHRlbXBsYXRlLCB7XG4gICAgICAgIG5hbWU6ICdKaG9uIE1ham9vcicsXG4gICAgICAgIHByb2ZpbGU6IHthZ2U6IDM0fSxcbiAgICAgICAgc3RhdGU6ICdsaWVmJ1xuICAgIH0pKTtcblxuICAgIHZhciBza2lsbFRlbXBsYXRlID0gXG4gICAgICAgICdNeSBTa2lsbHM6JyArXG4gICAgICAgICc8JWZvcih2YXIgaW5kZXggaW4gdGhpcy5za2lsbHMpIHslPicgK1xuICAgICAgICAnPGEgaHJlZj1cIiNcIj48JXRoaXMuc2tpbGxzW2luZGV4XSU+PC9hPicgK1xuICAgICAgICAnPCV9JT4nO1xuXG4gICAgY29uc29sZS5sb2coVGVtcGxhdGVFbmdpbmUoc2tpbGxUZW1wbGF0ZSwge1xuICAgICAgICBza2lsbHM6IFsnanMnLCAnaHRtbCcsICdjc3MnXVxuICAgIH0pKTtcbiovXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaHRtbCwgb3B0aW9ucykge1xuICAgIHZhciByZSA9IC88JSguKz8pJT4vZyxcbiAgICAgICAgcmVFeHAgPSAvKF4oICk/KHZhcnxpZnxmb3J8ZWxzZXxzd2l0Y2h8Y2FzZXxicmVha3x7fH18OykpKC4qKT8vZyxcbiAgICAgICAgY29kZSA9ICd3aXRoKG9iaikgeyB2YXIgcj1bXTtcXG4nLFxuICAgICAgICBjdXJzb3IgPSAwLFxuICAgICAgICBtYXRjaCxcbiAgICAgICAgcmVzdWx0O1xuXG4gICAgdmFyIGFkZCA9IGZ1bmN0aW9uKGxpbmUsIGpzKSB7XG4gICAgICAgIGpzID8gY29kZSArPSBsaW5lLm1hdGNoKHJlRXhwKSA/IGxpbmUgKyAnXFxuJyA6ICdyLnB1c2goJyArIGxpbmUgKyAnKTtcXG4nIDpcbiAgICAgICAgICAgIChjb2RlICs9IGxpbmUgIT0gJycgPyAnci5wdXNoKFwiJyArIGxpbmUucmVwbGFjZSgvXCIvZywgJ1xcXFxcIicpICsgJ1wiKTtcXG4nIDogJycpO1xuICAgICAgICByZXR1cm4gYWRkO1xuICAgIH1cblxuICAgIHdoaWxlKG1hdGNoID0gcmUuZXhlYyhodG1sKSkge1xuICAgICAgICBhZGQoaHRtbC5zbGljZShjdXJzb3IsIG1hdGNoLmluZGV4KSkobWF0Y2hbMV0sIHRydWUpO1xuICAgICAgICBjdXJzb3IgPSBtYXRjaC5pbmRleCArIG1hdGNoWzBdLmxlbmd0aDtcbiAgICB9XG5cbiAgICBhZGQoaHRtbC5zdWJzdHIoY3Vyc29yLCBodG1sLmxlbmd0aCAtIGN1cnNvcikpO1xuICAgIGNvZGUgPSAoY29kZSArICdyZXR1cm4gci5qb2luKFwiXCIpOyB9JykucmVwbGFjZSgvW1xcclxcdFxcbl0vZywgJycpO1xuXG4gICAgdHJ5IHtcbiAgICAgICAgcmVzdWx0ID0gbmV3IEZ1bmN0aW9uKCdvYmonLCBjb2RlKS5hcHBseShvcHRpb25zLCBbb3B0aW9uc10pO1xuICAgIH0gY2F0Y2goZXJyKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCInXCIgKyBlcnIubWVzc2FnZSArIFwiJ1wiLCBcIiBpbiBcXG5cXG5Db2RlOlxcblwiLCBjb2RlLCBcIlxcblwiKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xufSJdfQ==
