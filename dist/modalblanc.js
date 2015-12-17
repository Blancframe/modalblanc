(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Modalblanc = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';
/* jshint node: true */

var ExtendDefault = require('./lib/extend_default');

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
        sideTwo: {
            content: null,
            images: ['http://placehold.it/350x150', 'http://placehold.it/350x150', 'http://placehold.it/350x150'],
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

    stringAsNode(document.getElementById(modalId), tmpl);
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

function stringAsNode(element, html) {
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
}

module.exports = Modalblanc;
},{"./lib/extend_default":2}],2:[function(require,module,exports){
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
},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJpbmRleC5qcyIsImxpYi9leHRlbmRfZGVmYXVsdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9QQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJ3VzZSBzdHJpY3QnO1xuLyoganNoaW50IG5vZGU6IHRydWUgKi9cblxudmFyIEV4dGVuZERlZmF1bHQgPSByZXF1aXJlKCcuL2xpYi9leHRlbmRfZGVmYXVsdCcpO1xuXG52YXIgTW9kYWxibGFuYyA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoISh0aGlzIGluc3RhbmNlb2YgTW9kYWxibGFuYykpIHtcbiAgICAgIHJldHVybiBuZXcgTW9kYWxibGFuYygpO1xuICAgIH1cblxuICAgIHRoaXMuY2xvc2VCdXR0b24gPSBudWxsO1xuICAgIHRoaXMub3ZlcmxheSA9IG51bGw7XG5cbiAgICB2YXIgZGVmYXVsdHMgPSB7XG4gICAgICAgIGFuaW1hdGlvbjogJ2ZhZGUtaW4tb3V0JyxcbiAgICAgICAgY2xvc2VCdXR0b246IHRydWUsXG4gICAgICAgIGNvbnRlbnQ6ICcnLFxuICAgICAgICBzaWRlVHdvOiB7XG4gICAgICAgICAgICBjb250ZW50OiBudWxsLFxuICAgICAgICAgICAgaW1hZ2VzOiBbJ2h0dHA6Ly9wbGFjZWhvbGQuaXQvMzUweDE1MCcsICdodHRwOi8vcGxhY2Vob2xkLml0LzM1MHgxNTAnLCAnaHR0cDovL3BsYWNlaG9sZC5pdC8zNTB4MTUwJ10sXG4gICAgICAgICAgICBhbmltYXRpb246IG51bGwsXG4gICAgICAgICAgICBidXR0b246IG51bGwsXG4gICAgICAgICAgICBidXR0b25CYWNrOiBudWxsXG4gICAgICAgIH0sXG4gICAgICB9O1xuXG4gICAgdGhpcy5zZXR0aW5ncyA9IHt9O1xuXG4gICAgaWYgKGFyZ3VtZW50c1swXSAmJiB0eXBlb2YgYXJndW1lbnRzWzBdID09PSAnb2JqZWN0Jykge1xuICAgICAgICB0aGlzLm9wdGlvbnMgPSBFeHRlbmREZWZhdWx0KGRlZmF1bHRzLCBhcmd1bWVudHNbMF0pO1xuICAgIH1cbn07XG5cbk1vZGFsYmxhbmMucHJvdG90eXBlLm9wZW4gPSBmdW5jdGlvbigpIHtcbiAgICBpZiAodGhpcy5zZXR0aW5ncy5tb2RhbE9wZW4pIHJldHVybjtcblxuICAgIGJ1aWxkLmNhbGwodGhpcyk7XG4gICAgc2V0RXZlbnRzLmNhbGwodGhpcyk7XG59O1xuXG5Nb2RhbGJsYW5jLnByb3RvdHlwZS5jbG9zZSA9IGZ1bmN0aW9uKCkge1xuICAgIGlmICghdGhpcy5zZXR0aW5ncy5tb2RhbE9wZW4pIHJldHVybjtcblxuICAgIHZhciBvdmVybGF5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ292ZXJsYXktbW9kYWwtYmxhbmMnKSxcbiAgICAgICAgX3RoaXMgPSB0aGlzO1xuXG4gICAgb3ZlcmxheS5jbGFzc0xpc3QucmVtb3ZlKCdpcy1hY3RpdmUnKTtcbiAgICBvdmVybGF5LmNsYXNzTGlzdC5hZGQoJ2lzLWluYWN0aXZlJyk7XG5cbiAgICB2YXIgdHJhbnNQcmVmaXggPSB0cmFuc2l0aW9uUHJlZml4KG92ZXJsYXkpO1xuXG4gICAgb3ZlcmxheS5hZGRFdmVudExpc3RlbmVyKHRyYW5zUHJlZml4LmVuZCwgZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMucmVtb3ZlKCk7XG4gICAgICAgIF90aGlzLnNldHRpbmdzLm1vZGFsT3BlbiA9IGZhbHNlO1xuICAgIH0sIGZhbHNlKTtcbn07XG5cbk1vZGFsYmxhbmMucHJvdG90eXBlLl9jb250ZW50TmV4dCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBjYXJkID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NhcmQnKSxcbiAgICAgICAgY3VzdG9tQ2xhc3MgPSB0aGlzLm9wdGlvbnMuc2lkZVR3by5hbmltYXRpb247XG5cbiAgICBjYXJkLmNsYXNzTGlzdC5yZW1vdmUodHlwZU9mQW5pbWF0aW9uKGN1c3RvbUNsYXNzLCAyKSk7XG4gICAgY2FyZC5jbGFzc0xpc3QuYWRkKHR5cGVPZkFuaW1hdGlvbihjdXN0b21DbGFzcykpO1xufTtcblxuTW9kYWxibGFuYy5wcm90b3R5cGUuX2NvbnRlbnRQcmV2aW91cyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBjYXJkID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NhcmQnKSxcbiAgICAgICAgY3VzdG9tQ2xhc3MgPSB0aGlzLm9wdGlvbnMuc2lkZVR3by5hbmltYXRpb247XG5cbiAgICBjYXJkLmNsYXNzTGlzdC5yZW1vdmUodHlwZU9mQW5pbWF0aW9uKGN1c3RvbUNsYXNzKSk7XG4gICAgY2FyZC5jbGFzc0xpc3QuYWRkKHR5cGVPZkFuaW1hdGlvbihjdXN0b21DbGFzcywgMikpO1xufTtcblxuTW9kYWxibGFuYy5wcm90b3R5cGUuY2xhc3NFdmVudExpc3RlbmVyID0gZnVuY3Rpb24oZWxtLCBjYWxsYmFjaykge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGVsbS5sZW5ndGg7IGkrKykge1xuICAgICAgICBlbG1baV0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgIH0pO1xuICAgIH1cbn07XG5cbmZ1bmN0aW9uIHR5cGVPZkFuaW1hdGlvbih0eXBlLCB0eXBlQ2xhc3MpIHtcbiAgICB2YXIgYW5pbWF0aW9uVHlwZXMgPSB7XG4gICAgICAgICAgICAnc2xpZGUnOiBbJ3NsaWRlLW5leHQnLCAnc2xpZGUtYmFjayddLFxuICAgICAgICAgICAgJ3NjYWxlJzogWydzY2FsZS1uZXh0JywgJ3NjYWxlLWJhY2snXVxuICAgICAgICB9LFxuICAgICAgICBhbmltYXRpb25DbGFzcyA9IGFuaW1hdGlvblR5cGVzW3R5cGVdO1xuXG4gICAgICAgIGlmICh0eXBlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGlmICh0eXBlQ2xhc3MgPT09IDIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYW5pbWF0aW9uVHlwZXMuc2xpZGVbMV07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBhbmltYXRpb25UeXBlcy5zbGlkZVswXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICh0eXBlQ2xhc3MgPT09IDIpIHtcbiAgICAgICAgICAgIHJldHVybiBhbmltYXRpb25DbGFzc1sxXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBhbmltYXRpb25DbGFzc1swXTtcbiAgICAgICAgfVxufVxuXG5mdW5jdGlvbiB0cmFuc2l0aW9uUHJlZml4KGVsbSkge1xuICAgIHZhciB0cmFuc0VuZEV2ZW50TmFtZXMgPSB7XG4gICAgICAgICdXZWJraXRUcmFuc2l0aW9uJyA6ICd3ZWJraXRUcmFuc2l0aW9uRW5kJyxcbiAgICAgICAgJ01velRyYW5zaXRpb24nICAgIDogJ3RyYW5zaXRpb25lbmQnLFxuICAgICAgICAnT1RyYW5zaXRpb24nICAgICAgOiAnb1RyYW5zaXRpb25FbmQgb3RyYW5zaXRpb25lbmQnLFxuICAgICAgICAndHJhbnNpdGlvbicgICAgICAgOiAndHJhbnNpdGlvbmVuZCdcbiAgICB9O1xuXG4gICAgZm9yICh2YXIgbmFtZSBpbiB0cmFuc0VuZEV2ZW50TmFtZXMpIHtcbiAgICAgIGlmIChlbG0uc3R5bGVbbmFtZV0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZW5kOiB0cmFuc0VuZEV2ZW50TmFtZXNbbmFtZV1cbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9XG59XG5cbmZ1bmN0aW9uIHNldEV2ZW50cygpIHtcbiAgICB2YXIgbmV4dEJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtb2RhbC1idXR0b24tbmV4dCcpLFxuICAgICAgICBwcmV2QnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21vZGFsLWJ1dHRvbi1wcmV2JyksXG4gICAgICAgIGNsb3NlZCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ21vZGFsLWZ1bGxzY3JlZW4tY2xvc2UnKSxcbiAgICAgICAgX3RoaXMgPSB0aGlzO1xuXG4gICAgdGhpcy5jbGFzc0V2ZW50TGlzdGVuZXIoY2xvc2VkLCBmdW5jdGlvbigpIHtcbiAgICAgICAgX3RoaXMuY2xvc2UoKTtcbiAgICB9KTtcblxuICAgIGlmICh0aGlzLm9wdGlvbnMuc2lkZVR3by5jb250ZW50ID09PSBudWxsKSByZXR1cm47XG5cbiAgICBuZXh0QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5fY29udGVudE5leHQuYmluZCh0aGlzKSk7XG4gICAgcHJldkJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuX2NvbnRlbnRQcmV2aW91cy5iaW5kKHRoaXMpKTtcbn1cblxuZnVuY3Rpb24gYnVpbGQoKSB7XG4gICAgaWYgKHRoaXMub3B0aW9ucy5jbG9zZUJ1dHRvbiA9PT0gdHJ1ZSkge1xuICAgICAgICB0aGlzLmNsb3NlQnV0dG9uID0gJzxzcGFuIGNsYXNzPVwibW9kYWwtZnVsbHNjcmVlbi1jbG9zZVwiPlg8L3NwYW4+JztcbiAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmNsb3NlQnV0dG9uID0gJyc7XG4gICAgfVxuXG4gICAgdmFyIHRtcGwgPSAnPGRpdiBpZD1cIm92ZXJsYXktbW9kYWwtYmxhbmNcIiBjbGFzcz1cIm1vZGFsLWZ1bGxzY3JlZW4tYmFja2dyb3VuZCcgKyAnICcgKyAgdGhpcy5vcHRpb25zLmFuaW1hdGlvbiArICcgJyArICdpcy1hY3RpdmVcIj4nICtcbiAgICAgICAgICAgICAgICAgICAgJzxkaXYgaWQ9XCJtb2RhbC1mdWxsc2NyZWVuLWNvbnRhaW5lclwiY2xhc3M9XCJtb2RhbC1mdWxsc2NyZWVuLWNvbnRhaW5lciBiaWctbW9kYWxcIj4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICc8ZGl2IGlkPVwiY2FyZFwiPicrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJmcm9udFwiPicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPGRpdiBpZD1cImZyb250LWNhcmRcIiBjbGFzcz1cIm1vZGFsLWZ1bGxzY3JlZW4taXRlbVwiPicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jbG9zZUJ1dHRvbiArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50VHlwZSh0aGlzLm9wdGlvbnMuY29udGVudCkgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPC9kaXY+JytcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPC9kaXY+JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJiYWNrXCI+JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8ZGl2ICBpZD1cImJhY2stY2FyZFwiIGNsYXNzPVwibW9kYWwtZnVsbHNjcmVlbi1pdGVtXCI+JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNsb3NlQnV0dG9uICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnRUeXBlKHRoaXMub3B0aW9ucy5zaWRlVHdvLmNvbnRlbnQpICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJzwvZGl2PicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8L2Rpdj4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICc8L2Rpdj4nICtcbiAgICAgICAgICAgICAgICAgICAgJzwvZGl2PicgK1xuICAgICAgICAgICAgICAgICc8L2Rpdj4nLFxuICAgICAgICBtb2RhbElkLFxuICAgICAgICBib2R5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2JvZHknKTtcblxuICAgIGlmIChib2R5WzBdLmlkKSB7XG4gICAgICAgIG1vZGFsSWQgPSBib2R5WzBdLmlkO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIG1vZGFsSWQgPSAnZ28tbW9kYWwnO1xuICAgICAgICBib2R5WzBdLmlkID0gbW9kYWxJZDtcbiAgICB9XG5cbiAgICBzdHJpbmdBc05vZGUoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQobW9kYWxJZCksIHRtcGwpO1xuICAgIHRoaXMuc2V0dGluZ3MubW9kYWxPcGVuID0gdHJ1ZTtcblxuICAgIGlmICh0aGlzLm9wdGlvbnMuc2lkZVR3by5jb250ZW50ID09PSBudWxsKSByZXR1cm47XG5cbiAgICBidWlsZEJ1dHRvbih0aGlzLm9wdGlvbnMuc2lkZVR3by5idXR0b24pO1xuICAgIGJ1aWxkQnV0dG9uKHRoaXMub3B0aW9ucy5zaWRlVHdvLmJ1dHRvbkJhY2ssICdiYWNrJyk7XG59XG5cbmZ1bmN0aW9uIGJ1aWxkRWxlbWVudChidWlsZE9wdGlvbnMpIHtcbiAgICB2YXIgY3JlYXRlRWxtLFxuICAgICAgICBwYXJlbnRFbG07XG5cbiAgICBjcmVhdGVFbG0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KGJ1aWxkT3B0aW9ucy5lbG0pO1xuICAgIGNyZWF0ZUVsbS5pZCA9IGJ1aWxkT3B0aW9ucy5idXR0b25JZDtcbiAgICBjcmVhdGVFbG0uaW5uZXJIVE1MID0gYnVpbGRPcHRpb25zLmJ1dHRvblRleHQ7XG4gICAgcGFyZW50RWxtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoYnVpbGRPcHRpb25zLnBhcmVudElkKTtcblxuICAgIHBhcmVudEVsbS5hcHBlbmRDaGlsZChjcmVhdGVFbG0pO1xufVxuXG5cbmZ1bmN0aW9uIGJ1aWxkQnV0dG9uKGVsbSkge1xuICAgIHZhciBidXR0b24sXG4gICAgICAgIGNvbXB1dGVkQnV0dG9uLFxuICAgICAgICBjb21wdXRlZEJ1dHRvbkJhY2ssXG4gICAgICAgIGZyb250Q2FyZCxcbiAgICAgICAgYmFja0NhcmQ7XG5cbiAgICBpZiAoZWxtID09PSBudWxsIHx8IGVsbSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGlmIChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbW9kYWwtYnV0dG9uLW5leHQnKSB8fCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbW9kYWwtYnV0dG9uLXByZXYnKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYnVpbGRFbGVtZW50KHtcbiAgICAgICAgICAgICAgICBlbG06ICdhJyxcbiAgICAgICAgICAgICAgICBidXR0b25JZDogJ21vZGFsLWJ1dHRvbi1uZXh0JyxcbiAgICAgICAgICAgICAgICBidXR0b25UZXh0OiAnTmV4dCBzdGVwJyxcbiAgICAgICAgICAgICAgICBwYXJlbnRJZDogJ2Zyb250LWNhcmQnXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgYnVpbGRFbGVtZW50KHtcbiAgICAgICAgICAgICAgICBlbG06ICdhJyxcbiAgICAgICAgICAgICAgICBidXR0b25JZDogJ21vZGFsLWJ1dHRvbi1wcmV2JyxcbiAgICAgICAgICAgICAgICBidXR0b25UZXh0OiAnUHJldmlvdXMgc3RlcCcsXG4gICAgICAgICAgICAgICAgcGFyZW50SWQ6ICdiYWNrLWNhcmQnXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAgIGJ1aWxkRWxlbWVudCh7XG4gICAgICAgICAgICBlbG06IGVsbS5lbGVtZW50LFxuICAgICAgICAgICAgYnV0dG9uSWQ6IGVsbS5pZCxcbiAgICAgICAgICAgIGJ1dHRvblRleHQ6IGVsbS50ZXh0LFxuICAgICAgICAgICAgcGFyZW50SWQ6IGVsbS5wYXJlbnQsXG4gICAgICAgIH0pO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gY29udGVudFR5cGUoY29udGVudFZhbHVlKSB7XG4gICAgaWYgKHR5cGVvZiBjb250ZW50VmFsdWUgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHJldHVybiBjb250ZW50VmFsdWU7XG4gICAgfSBlbHNlIGlmIChjb250ZW50VmFsdWUgPT09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuICcnO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBjb250ZW50VmFsdWUuaW5uZXJIVE1MO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gc3RyaW5nQXNOb2RlKGVsZW1lbnQsIGh0bWwpIHtcbiAgICBpZiAoaHRtbCA9PT0gbnVsbCkgcmV0dXJuO1xuXG4gICAgdmFyIGZyYWcgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCksXG4gICAgICAgIHRtcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2JvZHknKSxcbiAgICAgICAgY2hpbGQ7XG5cbiAgICB0bXAuaW5uZXJIVE1MID0gaHRtbDtcblxuICAgIHdoaWxlIChjaGlsZCA9IHRtcC5maXJzdENoaWxkKSB7XG4gICAgICAgIGZyYWcuYXBwZW5kQ2hpbGQoY2hpbGQpO1xuICAgIH1cblxuICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQoZnJhZyk7XG4gICAgZnJhZyA9IHRtcCA9IG51bGw7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gTW9kYWxibGFuYzsiLCIndXNlIHN0cmljdCc7XG4vKiBqc2hpbnQgbm9kZTogdHJ1ZSAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHNvdXJjZSwgcHJvcGVydGllcykge1xuICAgIHZhciBwcm9wZXJ0eTtcbiAgICBmb3IgKHByb3BlcnR5IGluIHByb3BlcnRpZXMpIHtcbiAgICAgICAgaWYgKHByb3BlcnRpZXMuaGFzT3duUHJvcGVydHkocHJvcGVydHkpKSB7XG4gICAgICAgICAgICBzb3VyY2VbcHJvcGVydHldID0gcHJvcGVydGllc1twcm9wZXJ0eV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHNvdXJjZTtcbn07Il19
