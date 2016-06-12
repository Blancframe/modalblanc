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
        this.slider = new ImageSlider({
            selector: this.options.slider,
            parent: side
        });
    }
};

Modalblanc.prototype._contentNext = function() {
    if (this.hasSlider) {
        if (this.slider.playing) this.slider.pause();
    }

    var card = document.getElementById('card'),
        customClass = this.options.sideTwo.animation;

    card.classList.remove(typeOfAnimation(customClass, 2));
    card.classList.add(typeOfAnimation(customClass));
};

Modalblanc.prototype._contentPrevious = function() {
    if (this.hasSlider) {
        if (!this.slider.playing) this.slider.play();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJpbmRleC5qcyIsImxpYi9leHRlbmRfZGVmYXVsdC5qcyIsImxpYi9pbWFnZV9zbGlkZXIuanMiLCJsaWIvc3RyaW5nX2FzX25vZGUuanMiLCJsaWIvdGVtcGxhdGUtZW5naW5lLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdlJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIid1c2Ugc3RyaWN0Jztcbi8qIGpzaGludCBub2RlOiB0cnVlICovXG5cbnZhciBFeHRlbmREZWZhdWx0ID0gcmVxdWlyZSgnLi9saWIvZXh0ZW5kX2RlZmF1bHQnKTtcbnZhciBJbWFnZVNsaWRlciA9IHJlcXVpcmUoJy4vbGliL2ltYWdlX3NsaWRlcicpO1xudmFyIFN0cmluZ0FzTm9kZSA9IHJlcXVpcmUoJy4vbGliL3N0cmluZ19hc19ub2RlJyk7XG52YXIgVGVtcGxhdGUgPSByZXF1aXJlKCcuL2xpYi90ZW1wbGF0ZS1lbmdpbmUnKTtcblxuXG52YXIgTW9kYWxibGFuYyA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoISh0aGlzIGluc3RhbmNlb2YgTW9kYWxibGFuYykpIHtcbiAgICAgIHJldHVybiBuZXcgTW9kYWxibGFuYygpO1xuICAgIH1cblxuICAgIHRoaXMuY2xvc2VCdXR0b24gPSBudWxsO1xuICAgIHRoaXMub3ZlcmxheSA9IG51bGw7XG5cbiAgICB2YXIgZGVmYXVsdHMgPSB7XG4gICAgICAgIGFuaW1hdGlvbjogJ2ZhZGUtaW4tb3V0JyxcbiAgICAgICAgY2xvc2VCdXR0b246IHRydWUsXG4gICAgICAgIGNvbnRlbnQ6ICcnLFxuICAgICAgICBzbGlkZXI6IG51bGwsXG4gICAgICAgIHNpZGVUd286IHtcbiAgICAgICAgICAgIGNvbnRlbnQ6IG51bGwsXG4gICAgICAgICAgICBhbmltYXRpb246IG51bGwsXG4gICAgICAgICAgICBidXR0b246IG51bGwsXG4gICAgICAgICAgICBidXR0b25CYWNrOiBudWxsXG4gICAgICAgIH0sXG4gICAgICB9O1xuXG4gICAgdGhpcy5zZXR0aW5ncyA9IHt9O1xuXG4gICAgdGhpcy5oYXNTbGlkZXIgPSB0aGlzLmhhc1NsaWRlciA/IHRydWUgOiBmYWxzZTtcblxuICAgIGlmIChhcmd1bWVudHNbMF0gJiYgdHlwZW9mIGFyZ3VtZW50c1swXSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgdGhpcy5vcHRpb25zID0gRXh0ZW5kRGVmYXVsdChkZWZhdWx0cywgYXJndW1lbnRzWzBdKTtcbiAgICB9XG5cbn07XG5cbk1vZGFsYmxhbmMucHJvdG90eXBlLm9wZW4gPSBmdW5jdGlvbigpIHtcbiAgICBpZiAodGhpcy5zZXR0aW5ncy5tb2RhbE9wZW4pIHJldHVybjtcblxuICAgIGJ1aWxkLmNhbGwodGhpcyk7XG4gICAgc2V0RXZlbnRzLmNhbGwodGhpcyk7XG59O1xuXG5Nb2RhbGJsYW5jLnByb3RvdHlwZS5jbG9zZSA9IGZ1bmN0aW9uKCkge1xuICAgIGlmICghdGhpcy5zZXR0aW5ncy5tb2RhbE9wZW4pIHJldHVybjtcblxuICAgIHZhciBvdmVybGF5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ292ZXJsYXktbW9kYWwtYmxhbmMnKSxcbiAgICAgICAgX3RoaXMgPSB0aGlzO1xuXG4gICAgb3ZlcmxheS5jbGFzc0xpc3QucmVtb3ZlKCdpcy1hY3RpdmUnKTtcbiAgICBvdmVybGF5LmNsYXNzTGlzdC5hZGQoJ2lzLWluYWN0aXZlJyk7XG5cbiAgICB2YXIgdHJhbnNQcmVmaXggPSB0cmFuc2l0aW9uUHJlZml4KG92ZXJsYXkpO1xuXG4gICAgb3ZlcmxheS5hZGRFdmVudExpc3RlbmVyKHRyYW5zUHJlZml4LmVuZCwgZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMucmVtb3ZlKCk7XG4gICAgICAgIF90aGlzLnNldHRpbmdzLm1vZGFsT3BlbiA9IGZhbHNlO1xuICAgIH0sIGZhbHNlKTtcbn07XG5cbk1vZGFsYmxhbmMucHJvdG90eXBlLnNsaWRlckluaXQgPSBmdW5jdGlvbihzaWRlKSB7XG4gICAgaWYgKHRoaXMub3B0aW9ucy5zbGlkZXIgIT09IG51bGwpIHtcbiAgICAgICAgdGhpcy5oYXNTbGlkZXIgPSB0cnVlO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmhhc1NsaWRlcikge1xuICAgICAgICB0aGlzLm9wZW4oKTtcbiAgICAgICAgdGhpcy5zbGlkZXIgPSBuZXcgSW1hZ2VTbGlkZXIoe1xuICAgICAgICAgICAgc2VsZWN0b3I6IHRoaXMub3B0aW9ucy5zbGlkZXIsXG4gICAgICAgICAgICBwYXJlbnQ6IHNpZGVcbiAgICAgICAgfSk7XG4gICAgfVxufTtcblxuTW9kYWxibGFuYy5wcm90b3R5cGUuX2NvbnRlbnROZXh0ID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKHRoaXMuaGFzU2xpZGVyKSB7XG4gICAgICAgIGlmICh0aGlzLnNsaWRlci5wbGF5aW5nKSB0aGlzLnNsaWRlci5wYXVzZSgpO1xuICAgIH1cblxuICAgIHZhciBjYXJkID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NhcmQnKSxcbiAgICAgICAgY3VzdG9tQ2xhc3MgPSB0aGlzLm9wdGlvbnMuc2lkZVR3by5hbmltYXRpb247XG5cbiAgICBjYXJkLmNsYXNzTGlzdC5yZW1vdmUodHlwZU9mQW5pbWF0aW9uKGN1c3RvbUNsYXNzLCAyKSk7XG4gICAgY2FyZC5jbGFzc0xpc3QuYWRkKHR5cGVPZkFuaW1hdGlvbihjdXN0b21DbGFzcykpO1xufTtcblxuTW9kYWxibGFuYy5wcm90b3R5cGUuX2NvbnRlbnRQcmV2aW91cyA9IGZ1bmN0aW9uKCkge1xuICAgIGlmICh0aGlzLmhhc1NsaWRlcikge1xuICAgICAgICBpZiAoIXRoaXMuc2xpZGVyLnBsYXlpbmcpIHRoaXMuc2xpZGVyLnBsYXkoKTtcbiAgICB9XG5cbiAgICB2YXIgY2FyZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjYXJkJyksXG4gICAgICAgIGN1c3RvbUNsYXNzID0gdGhpcy5vcHRpb25zLnNpZGVUd28uYW5pbWF0aW9uO1xuXG4gICAgY2FyZC5jbGFzc0xpc3QucmVtb3ZlKHR5cGVPZkFuaW1hdGlvbihjdXN0b21DbGFzcykpO1xuICAgIGNhcmQuY2xhc3NMaXN0LmFkZCh0eXBlT2ZBbmltYXRpb24oY3VzdG9tQ2xhc3MsIDIpKTtcbn07XG5cbk1vZGFsYmxhbmMucHJvdG90eXBlLmNsYXNzRXZlbnRMaXN0ZW5lciA9IGZ1bmN0aW9uKGVsbSwgY2FsbGJhY2spIHtcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbG0ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgZWxtW2ldLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICB9KTtcbiAgICB9XG59O1xuXG5mdW5jdGlvbiB0eXBlT2ZBbmltYXRpb24odHlwZSwgdHlwZUNsYXNzKSB7XG4gICAgdmFyIGFuaW1hdGlvblR5cGVzID0ge1xuICAgICAgICAgICAgJ3NsaWRlJzogWydzbGlkZS1uZXh0JywgJ3NsaWRlLWJhY2snXSxcbiAgICAgICAgICAgICdzY2FsZSc6IFsnc2NhbGUtbmV4dCcsICdzY2FsZS1iYWNrJ11cbiAgICAgICAgfSxcbiAgICAgICAgYW5pbWF0aW9uQ2xhc3MgPSBhbmltYXRpb25UeXBlc1t0eXBlXTtcblxuICAgICAgICBpZiAodHlwZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBpZiAodHlwZUNsYXNzID09PSAyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGFuaW1hdGlvblR5cGVzLnNsaWRlWzFdO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYW5pbWF0aW9uVHlwZXMuc2xpZGVbMF07XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZUNsYXNzID09PSAyKSB7XG4gICAgICAgICAgICByZXR1cm4gYW5pbWF0aW9uQ2xhc3NbMV07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gYW5pbWF0aW9uQ2xhc3NbMF07XG4gICAgICAgIH1cbn1cblxuZnVuY3Rpb24gdHJhbnNpdGlvblByZWZpeChlbG0pIHtcbiAgICB2YXIgdHJhbnNFbmRFdmVudE5hbWVzID0ge1xuICAgICAgICAnV2Via2l0VHJhbnNpdGlvbicgOiAnd2Via2l0VHJhbnNpdGlvbkVuZCcsXG4gICAgICAgICdNb3pUcmFuc2l0aW9uJyAgICA6ICd0cmFuc2l0aW9uZW5kJyxcbiAgICAgICAgJ09UcmFuc2l0aW9uJyAgICAgIDogJ29UcmFuc2l0aW9uRW5kIG90cmFuc2l0aW9uZW5kJyxcbiAgICAgICAgJ3RyYW5zaXRpb24nICAgICAgIDogJ3RyYW5zaXRpb25lbmQnXG4gICAgfTtcblxuICAgIGZvciAodmFyIG5hbWUgaW4gdHJhbnNFbmRFdmVudE5hbWVzKSB7XG4gICAgICBpZiAoZWxtLnN0eWxlW25hbWVdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGVuZDogdHJhbnNFbmRFdmVudE5hbWVzW25hbWVdXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfVxufVxuXG5mdW5jdGlvbiBzZXRFdmVudHMoKSB7XG4gICAgdmFyIG5leHRCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbW9kYWwtYnV0dG9uLW5leHQnKSxcbiAgICAgICAgcHJldkJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtb2RhbC1idXR0b24tcHJldicpLFxuICAgICAgICBjbG9zZWQgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdtb2RhbC1mdWxsc2NyZWVuLWNsb3NlJyksXG4gICAgICAgIF90aGlzID0gdGhpcztcblxuICAgIHRoaXMuY2xhc3NFdmVudExpc3RlbmVyKGNsb3NlZCwgZnVuY3Rpb24oKSB7XG4gICAgICAgIF90aGlzLmNsb3NlKCk7XG4gICAgfSk7XG5cbiAgICBpZiAodGhpcy5vcHRpb25zLnNpZGVUd28uY29udGVudCA9PT0gbnVsbCkgcmV0dXJuO1xuXG4gICAgbmV4dEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuX2NvbnRlbnROZXh0LmJpbmQodGhpcykpO1xuICAgIHByZXZCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLl9jb250ZW50UHJldmlvdXMuYmluZCh0aGlzKSk7XG59XG5cbmZ1bmN0aW9uIGJ1aWxkKCkge1xuICAgIGlmICh0aGlzLm9wdGlvbnMuY2xvc2VCdXR0b24pIHRoaXMuY2xvc2VCdXR0b24gPSAnPHNwYW4gY2xhc3M9XCJtb2RhbC1mdWxsc2NyZWVuLWNsb3NlXCI+WDwvc3Bhbj4nO1xuXG4gICAgdmFyIGNvbnRlbnRTaWRlT25lID0gIXRoaXMub3B0aW9ucy5zbGlkZXIgPyBjb250ZW50VHlwZSh0aGlzLm9wdGlvbnMuY29udGVudCkgOiBjb250ZW50VHlwZSgnPGRpdiBpZD1cIm1vZGFsLXNsaWRlclwiPjwvZGl2PicpO1xuXG4gICAgdmFyIHR5cGVNb2RhbCA9IHRoaXMub3B0aW9ucy5zbGlkZXIgPyAnc2xpZGVyLW1vZGFsJyA6ICdiaWctbW9kYWwnO1xuICAgIHZhciBtb2RhbCA9ICc8ZGl2IGlkPVwib3ZlcmxheS1tb2RhbC1ibGFuY1wiIGNsYXNzPVwibW9kYWwtZnVsbHNjcmVlbi1iYWNrZ3JvdW5kIDwldGhpcy5hbmltYXRpb24lPiA8JXRoaXMuc3RhdGUlPlwiPicgK1xuICAgICAgICAgICAgICAgICAgICAnPGRpdiBpZD1cIm1vZGFsLWZ1bGxzY3JlZW4tY29udGFpbmVyXCJjbGFzcz1cIm1vZGFsLWZ1bGxzY3JlZW4tY29udGFpbmVyIDwldGhpcy50eXBlJT4gXCI+JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAnPGRpdiBpZD1cImNhcmRcIj4nK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiZnJvbnRcIj4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJzxkaXYgaWQ9XCJmcm9udC1jYXJkXCIgY2xhc3M9XCJtb2RhbC1mdWxsc2NyZWVuLWl0ZW1cIj4nK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJzwldGhpcy5jbG9zZUJ1dHRvbiU+JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPCV0aGlzLmNvbnRlbnRUeXBlU2lkZU9uZSU+JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8L2Rpdj4nK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8L2Rpdj4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cImJhY2tcIj4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJzxkaXYgIGlkPVwiYmFjay1jYXJkXCIgY2xhc3M9XCJtb2RhbC1mdWxsc2NyZWVuLWl0ZW1cIj4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8JXRoaXMuY2xvc2VCdXR0b24lPicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJzwldGhpcy5jb250ZW50VHlwZVNpZGVUd28lPicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPC9kaXY+JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJzwvZGl2PicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJzwvZGl2PicgK1xuICAgICAgICAgICAgICAgICAgICAnPC9kaXY+JyArXG4gICAgICAgICAgICAgICAgJzwvZGl2Pic7XG5cbiAgICB2YXIgbW9kYWxUZW1wbGF0ZSA9IFRlbXBsYXRlKG1vZGFsLCB7XG4gICAgICAgIGFuaW1hdGlvbjogdGhpcy5vcHRpb25zLmFuaW1hdGlvbixcbiAgICAgICAgc3RhdGU6ICdpcy1hY3RpdmUnLFxuICAgICAgICB0eXBlOiB0eXBlTW9kYWwsXG4gICAgICAgIGNsb3NlQnV0dG9uOiB0aGlzLmNsb3NlQnV0dG9uLFxuICAgICAgICBjb250ZW50VHlwZVNpZGVPbmU6IGNvbnRlbnRTaWRlT25lLFxuICAgICAgICBjb250ZW50VHlwZVNpZGVUd286IGNvbnRlbnRUeXBlKHRoaXMub3B0aW9ucy5zaWRlVHdvLmNvbnRlbnQpXG4gICAgfSk7XG5cbiAgICB2YXIgYm9keSA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdib2R5JyksXG4gICAgICAgIG1vZGFsSWQ7XG5cbiAgICBpZiAoYm9keVswXS5pZCkge1xuICAgICAgICBtb2RhbElkID0gYm9keVswXS5pZDtcbiAgICB9IGVsc2Uge1xuICAgICAgICBtb2RhbElkID0gJ2dvLW1vZGFsJztcbiAgICAgICAgYm9keVswXS5pZCA9IG1vZGFsSWQ7XG4gICAgfVxuXG4gICAgU3RyaW5nQXNOb2RlKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKG1vZGFsSWQpLCBtb2RhbFRlbXBsYXRlKTtcbiAgICB0aGlzLnNldHRpbmdzLm1vZGFsT3BlbiA9IHRydWU7XG5cbiAgICBpZiAodGhpcy5vcHRpb25zLnNsaWRlcikgdGhpcy5zbGlkZXJJbml0KCcjbW9kYWwtc2xpZGVyJyk7XG5cbiAgICBpZiAodGhpcy5vcHRpb25zLnNpZGVUd28uY29udGVudCA9PT0gbnVsbCkgcmV0dXJuO1xuXG4gICAgYnVpbGRCdXR0b24odGhpcy5vcHRpb25zLnNpZGVUd28uYnV0dG9uKTtcbiAgICBidWlsZEJ1dHRvbih0aGlzLm9wdGlvbnMuc2lkZVR3by5idXR0b25CYWNrLCAnYmFjaycpO1xufVxuXG5mdW5jdGlvbiBidWlsZEVsZW1lbnQoYnVpbGRPcHRpb25zKSB7XG4gICAgdmFyIGNyZWF0ZUVsbSxcbiAgICAgICAgcGFyZW50RWxtO1xuXG4gICAgY3JlYXRlRWxtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChidWlsZE9wdGlvbnMuZWxtKTtcbiAgICBjcmVhdGVFbG0uaWQgPSBidWlsZE9wdGlvbnMuYnV0dG9uSWQ7XG4gICAgY3JlYXRlRWxtLmlubmVySFRNTCA9IGJ1aWxkT3B0aW9ucy5idXR0b25UZXh0O1xuICAgIHBhcmVudEVsbSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGJ1aWxkT3B0aW9ucy5wYXJlbnRJZCk7XG5cbiAgICBwYXJlbnRFbG0uYXBwZW5kQ2hpbGQoY3JlYXRlRWxtKTtcbn1cblxuXG5mdW5jdGlvbiBidWlsZEJ1dHRvbihlbG0pIHtcbiAgICB2YXIgYnV0dG9uLFxuICAgICAgICBjb21wdXRlZEJ1dHRvbixcbiAgICAgICAgY29tcHV0ZWRCdXR0b25CYWNrLFxuICAgICAgICBmcm9udENhcmQsXG4gICAgICAgIGJhY2tDYXJkO1xuXG4gICAgaWYgKGVsbSA9PT0gbnVsbCB8fCBlbG0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBpZiAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21vZGFsLWJ1dHRvbi1uZXh0JykgfHwgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21vZGFsLWJ1dHRvbi1wcmV2JykpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGJ1aWxkRWxlbWVudCh7XG4gICAgICAgICAgICAgICAgZWxtOiAnYScsXG4gICAgICAgICAgICAgICAgYnV0dG9uSWQ6ICdtb2RhbC1idXR0b24tbmV4dCcsXG4gICAgICAgICAgICAgICAgYnV0dG9uVGV4dDogJ05leHQgc3RlcCcsXG4gICAgICAgICAgICAgICAgcGFyZW50SWQ6ICdmcm9udC1jYXJkJ1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGJ1aWxkRWxlbWVudCh7XG4gICAgICAgICAgICAgICAgZWxtOiAnYScsXG4gICAgICAgICAgICAgICAgYnV0dG9uSWQ6ICdtb2RhbC1idXR0b24tcHJldicsXG4gICAgICAgICAgICAgICAgYnV0dG9uVGV4dDogJ1ByZXZpb3VzIHN0ZXAnLFxuICAgICAgICAgICAgICAgIHBhcmVudElkOiAnYmFjay1jYXJkJ1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgICBidWlsZEVsZW1lbnQoe1xuICAgICAgICAgICAgZWxtOiBlbG0uZWxlbWVudCxcbiAgICAgICAgICAgIGJ1dHRvbklkOiBlbG0uaWQsXG4gICAgICAgICAgICBidXR0b25UZXh0OiBlbG0udGV4dCxcbiAgICAgICAgICAgIHBhcmVudElkOiBlbG0ucGFyZW50LFxuICAgICAgICB9KTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGNvbnRlbnRUeXBlKGNvbnRlbnRWYWx1ZSkge1xuICAgIGlmICh0eXBlb2YgY29udGVudFZhbHVlID09PSAnc3RyaW5nJykge1xuICAgICAgICByZXR1cm4gY29udGVudFZhbHVlO1xuICAgIH0gZWxzZSBpZiAoY29udGVudFZhbHVlID09PSBudWxsKSB7XG4gICAgICAgIHJldHVybiAnJztcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gY29udGVudFZhbHVlLmlubmVySFRNTDtcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gTW9kYWxibGFuYztcbiIsIid1c2Ugc3RyaWN0Jztcbi8qIGpzaGludCBub2RlOiB0cnVlICovXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oc291cmNlLCBwcm9wZXJ0aWVzKSB7XG4gICAgdmFyIHByb3BlcnR5O1xuICAgIGZvciAocHJvcGVydHkgaW4gcHJvcGVydGllcykge1xuICAgICAgICBpZiAocHJvcGVydGllcy5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eSkpIHtcbiAgICAgICAgICAgIHNvdXJjZVtwcm9wZXJ0eV0gPSBwcm9wZXJ0aWVzW3Byb3BlcnR5XTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gc291cmNlO1xufTsiLCIndXNlIHN0cmljdCc7XG4vKiBqc2hpbnQgbm9kZTogdHJ1ZSAqL1xuXG52YXIgRXh0ZW5kRGVmYXVsdCA9IHJlcXVpcmUoJy4vZXh0ZW5kX2RlZmF1bHQnKTtcbnZhciBTdHJpbmdBc05vZGUgPSByZXF1aXJlKCcuL3N0cmluZ19hc19ub2RlJyk7XG5cbnZhciBJbWFnZVNsaWRlciA9IGZ1bmN0aW9uKCkge1xuICAgIGlmICghKHRoaXMgaW5zdGFuY2VvZiBJbWFnZVNsaWRlcikpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBJbWFnZVNsaWRlcigpO1xuICAgIH1cblxuICAgIHZhciBkZWZhdWx0cyA9IHtcbiAgICAgICAgc2VsZWN0b3I6ICcuc2xpZGVzJyxcbiAgICAgICAgdHJhbnNpdGlvbjogJ2ZhZGUtc2xpZGUnLFxuICAgICAgICBhdXRvUGxheTogZmFsc2VcbiAgICB9O1xuXG4gICAgaWYgKGFyZ3VtZW50c1swXSAmJiB0eXBlb2YgYXJndW1lbnRzWzBdID09PSAnb2JqZWN0Jykge1xuICAgICAgICB0aGlzLm9wdGlvbnMgPSBFeHRlbmREZWZhdWx0KGRlZmF1bHRzLCBhcmd1bWVudHNbMF0pO1xuICAgIH1cblxuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICB0aGlzLmN1cnJlbnRTbGlkZSA9IDA7XG4gICAgdGhpcy5wbGF5aW5nID0gdHJ1ZTtcblxuICAgIHRoaXMuX2luaXQoKTtcbiAgICAvLyB0aGlzLm5leHRTbGlkZSgpXG4gICAgdGhpcy5zbGlkZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuaW1hZ2Utc2xpZGVyLWhvbGRlciAuaW1hZ2Utc2xpZGVyJyk7XG4gICAgdGhpcy5zZXRTbGlkZSgpO1xuICAgIHRoaXMucGxheSgpO1xufTtcblxuSW1hZ2VTbGlkZXIucHJvdG90eXBlLl9pbml0ID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5jcmVhdGVTbGlkZXMoKTtcbiAgICBzZXRFdmVudHMuY2FsbCh0aGlzKTtcbn07XG5cbkltYWdlU2xpZGVyLnByb3RvdHlwZS5jcmVhdGVTbGlkZXMgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnNsaWRlcyA9IFtdO1xuICAgIHZhciBzbGlkZXMsXG4gICAgICAgIGltYWdlcyA9IHRoaXMub3B0aW9ucy5zZWxlY3RvcjtcblxuICAgIGlmIChpbWFnZXMgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICBzbGlkZXMgPSBpbWFnZXM7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgc2xpZGVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCh0aGlzLm9wdGlvbnMuc2VsZWN0b3IgKyAnIGltZycpO1xuICAgIH1cblxuXG4gICAgdmFyIHBhcmVudEVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0aGlzLm9wdGlvbnMucGFyZW50KSxcbiAgICAgICAgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndWwnKSxcbiAgICAgICAgc2xpZGVJbWcsXG4gICAgICAgIHNsaWRlckVsbSxcbiAgICAgICAgaW1nRWxtO1xuXG4gICAgY29udGFpbmVyLmNsYXNzTmFtZSA9ICdpbWFnZS1zbGlkZXItaG9sZGVyJztcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2xpZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChzbGlkZXNbaV0uc3JjKSB7XG4gICAgICAgICAgICBzbGlkZUltZyA9IHNsaWRlc1tpXS5zcmM7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzbGlkZUltZyA9IHNsaWRlc1tpXTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2xpZGVzLnB1c2goe1xuICAgICAgICAgICAgaW5kZXg6IGksXG4gICAgICAgICAgICBlbDogc2xpZGVzW2ldLFxuICAgICAgICAgICAgaW1hZ2VzOiBzbGlkZUltZ1xuICAgICAgICB9KTtcblxuICAgICAgICBzbGlkZXJFbG0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xuICAgICAgICBzbGlkZXJFbG0uY2xhc3NOYW1lID0gJ2ltYWdlLXNsaWRlcic7XG5cbiAgICAgICAgaW1nRWxtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XG4gICAgICAgIGltZ0VsbS5zcmMgPSBzbGlkZUltZztcblxuICAgICAgICBzbGlkZXJFbG0uYXBwZW5kQ2hpbGQoaW1nRWxtKTtcbiAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKHNsaWRlckVsbSk7XG4gICAgICAgIHBhcmVudEVsLmFwcGVuZENoaWxkKGNvbnRhaW5lcik7XG4gICAgfVxuXG4gICAgdGhpcy5wYXVzZUJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICB0aGlzLnBhdXNlQnRuLmlkID0gJ3BhdXNlLWJ0bic7XG4gICAgdGhpcy5wYXVzZUJ0bi5pbm5lckhUTUwgPSAncGF1c2UnO1xuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLnBhdXNlQnRuKTtcbn07XG5cbkltYWdlU2xpZGVyLnByb3RvdHlwZS5zZXRTbGlkZSA9IGZ1bmN0aW9uKCkge1xuICAgIC8vIHNldCB0aGUgc2xpZGVyIHdpdGggaW1hZ2Ugc2xpZGVyIGVsZW1lbnRzLlxuICAgIHZhciBmaXJzdCA9IHRoaXMuc2xpZGVyWzBdO1xuICAgIGZpcnN0LmNsYXNzTGlzdC5hZGQoJ2lzLXNob3dpbmcnKTtcbn1cblxuZnVuY3Rpb24gc2V0RXZlbnRzKCkge1xuICAgIHZhciBwYXVzZUJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYXVzZS1idG4nKSxcbiAgICAgICAgX3RoaXMgPSB0aGlzOztcblxuICAgIHBhdXNlQnV0dG9uLm9uY2xpY2sgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKF90aGlzLnBsYXlpbmcpIHtcbiAgICAgICAgICAgIF90aGlzLnBhdXNlKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBfdGhpcy5wbGF5KCk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbkltYWdlU2xpZGVyLnByb3RvdHlwZS5uZXh0U2xpZGUgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgc2xpZGVzID0gdGhpcy5zbGlkZXI7XG5cbiAgICBzbGlkZXNbdGhpcy5jdXJyZW50U2xpZGVdLmNsYXNzTmFtZSA9ICdpbWFnZS1zbGlkZXInO1xuICAgIHRoaXMuY3VycmVudFNsaWRlID0gKHRoaXMuY3VycmVudFNsaWRlICsgMSkgJSBzbGlkZXMubGVuZ3RoO1xuICAgIHNsaWRlc1t0aGlzLmN1cnJlbnRTbGlkZV0uY2xhc3NOYW1lID0gJ2ltYWdlLXNsaWRlciBpcy1zaG93aW5nJztcbn1cblxuSW1hZ2VTbGlkZXIucHJvdG90eXBlLnBhdXNlID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5wYXVzZUJ0bi5pbm5lckhUTUwgPSAncGxheSc7XG4gICAgdGhpcy5wbGF5aW5nID0gZmFsc2U7XG4gICAgY2xlYXJJbnRlcnZhbCh0aGlzLnNsaWRlSW50ZXJ2YWwpO1xufVxuXG5JbWFnZVNsaWRlci5wcm90b3R5cGUucGxheSA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICB0aGlzLnBhdXNlQnRuLmlubmVySFRNTCA9ICdwYXVzZSc7XG4gICAgdGhpcy5wbGF5aW5nID0gdHJ1ZTtcbiAgICB0aGlzLnNsaWRlSW50ZXJ2YWwgPSBzZXRJbnRlcnZhbChmdW5jdGlvbigpIHtcbiAgICAgICAgX3RoaXMubmV4dFNsaWRlKCk7XG4gICAgfSwgMjAwMCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gSW1hZ2VTbGlkZXI7XG4iLCIndXNlIHN0cmljdCc7XG4vKiBqc2hpbnQgbm9kZTogdHJ1ZSAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGVsZW1lbnQsIGh0bWwpIHtcbiAgICBpZiAoaHRtbCA9PT0gbnVsbCkgcmV0dXJuO1xuXG4gICAgdmFyIGZyYWcgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCksXG4gICAgICAgIHRtcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2JvZHknKSxcbiAgICAgICAgY2hpbGQ7XG5cbiAgICB0bXAuaW5uZXJIVE1MID0gaHRtbDtcblxuICAgIHdoaWxlIChjaGlsZCA9IHRtcC5maXJzdENoaWxkKSB7XG4gICAgICAgIGZyYWcuYXBwZW5kQ2hpbGQoY2hpbGQpO1xuICAgIH1cblxuICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQoZnJhZyk7XG4gICAgZnJhZyA9IHRtcCA9IG51bGw7XG59OyIsIid1c2Ugc3RyaWN0Jztcbi8qIGpzaGludCBub2RlOiB0cnVlICovXG5cbi8qXG4gICAgdmFyIHRlbXBsYXRlID0gJzxwPkhlbGxvLCBpayBiZW4gPCV0aGlzLm5hbWUlPi4gSWsgYmVuIDwldGhpcy5wcm9maWxlLmFnZSU+IGphYXIgb3VkIGVuIGJlbiBlcmcgPCV0aGlzLnN0YXRlJT48L3A+JztcbiAgICBjb25zb2xlLmxvZyhUZW1wbGF0ZUVuZ2luZSh0ZW1wbGF0ZSwge1xuICAgICAgICBuYW1lOiAnSmhvbiBNYWpvb3InLFxuICAgICAgICBwcm9maWxlOiB7YWdlOiAzNH0sXG4gICAgICAgIHN0YXRlOiAnbGllZidcbiAgICB9KSk7XG5cbiAgICB2YXIgc2tpbGxUZW1wbGF0ZSA9IFxuICAgICAgICAnTXkgU2tpbGxzOicgK1xuICAgICAgICAnPCVmb3IodmFyIGluZGV4IGluIHRoaXMuc2tpbGxzKSB7JT4nICtcbiAgICAgICAgJzxhIGhyZWY9XCIjXCI+PCV0aGlzLnNraWxsc1tpbmRleF0lPjwvYT4nICtcbiAgICAgICAgJzwlfSU+JztcblxuICAgIGNvbnNvbGUubG9nKFRlbXBsYXRlRW5naW5lKHNraWxsVGVtcGxhdGUsIHtcbiAgICAgICAgc2tpbGxzOiBbJ2pzJywgJ2h0bWwnLCAnY3NzJ11cbiAgICB9KSk7XG4qL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGh0bWwsIG9wdGlvbnMpIHtcbiAgICB2YXIgcmUgPSAvPCUoLis/KSU+L2csXG4gICAgICAgIHJlRXhwID0gLyheKCApPyh2YXJ8aWZ8Zm9yfGVsc2V8c3dpdGNofGNhc2V8YnJlYWt8e3x9fDspKSguKik/L2csXG4gICAgICAgIGNvZGUgPSAnd2l0aChvYmopIHsgdmFyIHI9W107XFxuJyxcbiAgICAgICAgY3Vyc29yID0gMCxcbiAgICAgICAgbWF0Y2gsXG4gICAgICAgIHJlc3VsdDtcblxuICAgIHZhciBhZGQgPSBmdW5jdGlvbihsaW5lLCBqcykge1xuICAgICAgICBqcyA/IGNvZGUgKz0gbGluZS5tYXRjaChyZUV4cCkgPyBsaW5lICsgJ1xcbicgOiAnci5wdXNoKCcgKyBsaW5lICsgJyk7XFxuJyA6XG4gICAgICAgICAgICAoY29kZSArPSBsaW5lICE9ICcnID8gJ3IucHVzaChcIicgKyBsaW5lLnJlcGxhY2UoL1wiL2csICdcXFxcXCInKSArICdcIik7XFxuJyA6ICcnKTtcbiAgICAgICAgcmV0dXJuIGFkZDtcbiAgICB9XG5cbiAgICB3aGlsZShtYXRjaCA9IHJlLmV4ZWMoaHRtbCkpIHtcbiAgICAgICAgYWRkKGh0bWwuc2xpY2UoY3Vyc29yLCBtYXRjaC5pbmRleCkpKG1hdGNoWzFdLCB0cnVlKTtcbiAgICAgICAgY3Vyc29yID0gbWF0Y2guaW5kZXggKyBtYXRjaFswXS5sZW5ndGg7XG4gICAgfVxuXG4gICAgYWRkKGh0bWwuc3Vic3RyKGN1cnNvciwgaHRtbC5sZW5ndGggLSBjdXJzb3IpKTtcbiAgICBjb2RlID0gKGNvZGUgKyAncmV0dXJuIHIuam9pbihcIlwiKTsgfScpLnJlcGxhY2UoL1tcXHJcXHRcXG5dL2csICcnKTtcblxuICAgIHRyeSB7XG4gICAgICAgIHJlc3VsdCA9IG5ldyBGdW5jdGlvbignb2JqJywgY29kZSkuYXBwbHkob3B0aW9ucywgW29wdGlvbnNdKTtcbiAgICB9IGNhdGNoKGVycikge1xuICAgICAgICBjb25zb2xlLmVycm9yKFwiJ1wiICsgZXJyLm1lc3NhZ2UgKyBcIidcIiwgXCIgaW4gXFxuXFxuQ29kZTpcXG5cIiwgY29kZSwgXCJcXG5cIik7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbn0iXX0=
