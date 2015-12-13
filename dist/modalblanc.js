(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Modalblanc = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';
/* jshint node: true */

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
        this.options = extendDefault(defaults, arguments[0]);
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

function extendDefault(source, properties) {
    var property;
    for (property in properties) {
        if (properties.hasOwnProperty(property)) {
            source[property] = properties[property];
        }
    }
    return source;
}


module.exports = Modalblanc;
},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJpbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIid1c2Ugc3RyaWN0Jztcbi8qIGpzaGludCBub2RlOiB0cnVlICovXG5cbnZhciBNb2RhbGJsYW5jID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICghKHRoaXMgaW5zdGFuY2VvZiBNb2RhbGJsYW5jKSkge1xuICAgICAgcmV0dXJuIG5ldyBNb2RhbGJsYW5jKCk7XG4gICAgfVxuXG4gICAgdGhpcy5jbG9zZUJ1dHRvbiA9IG51bGw7XG4gICAgdGhpcy5vdmVybGF5ID0gbnVsbDtcblxuICAgIHZhciBkZWZhdWx0cyA9IHtcbiAgICAgICAgYW5pbWF0aW9uOiAnZmFkZS1pbi1vdXQnLFxuICAgICAgICBjbG9zZUJ1dHRvbjogdHJ1ZSxcbiAgICAgICAgY29udGVudDogJycsXG4gICAgICAgIHNpZGVUd286IHtcbiAgICAgICAgICAgIGNvbnRlbnQ6IG51bGwsXG4gICAgICAgICAgICBpbWFnZXM6IFsnaHR0cDovL3BsYWNlaG9sZC5pdC8zNTB4MTUwJywgJ2h0dHA6Ly9wbGFjZWhvbGQuaXQvMzUweDE1MCcsICdodHRwOi8vcGxhY2Vob2xkLml0LzM1MHgxNTAnXSxcbiAgICAgICAgICAgIGFuaW1hdGlvbjogbnVsbCxcbiAgICAgICAgICAgIGJ1dHRvbjogbnVsbCxcbiAgICAgICAgICAgIGJ1dHRvbkJhY2s6IG51bGxcbiAgICAgICAgfSxcbiAgICAgIH07XG5cbiAgICB0aGlzLnNldHRpbmdzID0ge307XG5cbiAgICBpZiAoYXJndW1lbnRzWzBdICYmIHR5cGVvZiBhcmd1bWVudHNbMF0gPT09ICdvYmplY3QnKSB7XG4gICAgICAgIHRoaXMub3B0aW9ucyA9IGV4dGVuZERlZmF1bHQoZGVmYXVsdHMsIGFyZ3VtZW50c1swXSk7XG4gICAgfVxufTtcblxuTW9kYWxibGFuYy5wcm90b3R5cGUub3BlbiA9IGZ1bmN0aW9uKCkge1xuICAgIGlmICh0aGlzLnNldHRpbmdzLm1vZGFsT3BlbikgcmV0dXJuO1xuXG4gICAgYnVpbGQuY2FsbCh0aGlzKTtcbiAgICBzZXRFdmVudHMuY2FsbCh0aGlzKTtcbn07XG5cbk1vZGFsYmxhbmMucHJvdG90eXBlLmNsb3NlID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKCF0aGlzLnNldHRpbmdzLm1vZGFsT3BlbikgcmV0dXJuO1xuXG4gICAgdmFyIG92ZXJsYXkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnb3ZlcmxheS1tb2RhbC1ibGFuYycpLFxuICAgICAgICBfdGhpcyA9IHRoaXM7XG5cbiAgICBvdmVybGF5LmNsYXNzTGlzdC5yZW1vdmUoJ2lzLWFjdGl2ZScpO1xuICAgIG92ZXJsYXkuY2xhc3NMaXN0LmFkZCgnaXMtaW5hY3RpdmUnKTtcblxuICAgIHZhciB0cmFuc1ByZWZpeCA9IHRyYW5zaXRpb25QcmVmaXgob3ZlcmxheSk7XG5cbiAgICBvdmVybGF5LmFkZEV2ZW50TGlzdGVuZXIodHJhbnNQcmVmaXguZW5kLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5yZW1vdmUoKTtcbiAgICAgICAgX3RoaXMuc2V0dGluZ3MubW9kYWxPcGVuID0gZmFsc2U7XG4gICAgfSwgZmFsc2UpO1xufTtcblxuTW9kYWxibGFuYy5wcm90b3R5cGUuX2NvbnRlbnROZXh0ID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGNhcmQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2FyZCcpLFxuICAgICAgICBjdXN0b21DbGFzcyA9IHRoaXMub3B0aW9ucy5zaWRlVHdvLmFuaW1hdGlvbjtcblxuICAgIGNhcmQuY2xhc3NMaXN0LnJlbW92ZSh0eXBlT2ZBbmltYXRpb24oY3VzdG9tQ2xhc3MsIDIpKTtcbiAgICBjYXJkLmNsYXNzTGlzdC5hZGQodHlwZU9mQW5pbWF0aW9uKGN1c3RvbUNsYXNzKSk7XG59O1xuXG5Nb2RhbGJsYW5jLnByb3RvdHlwZS5fY29udGVudFByZXZpb3VzID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGNhcmQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2FyZCcpLFxuICAgICAgICBjdXN0b21DbGFzcyA9IHRoaXMub3B0aW9ucy5zaWRlVHdvLmFuaW1hdGlvbjtcblxuICAgIGNhcmQuY2xhc3NMaXN0LnJlbW92ZSh0eXBlT2ZBbmltYXRpb24oY3VzdG9tQ2xhc3MpKTtcbiAgICBjYXJkLmNsYXNzTGlzdC5hZGQodHlwZU9mQW5pbWF0aW9uKGN1c3RvbUNsYXNzLCAyKSk7XG59O1xuXG5Nb2RhbGJsYW5jLnByb3RvdHlwZS5jbGFzc0V2ZW50TGlzdGVuZXIgPSBmdW5jdGlvbihlbG0sIGNhbGxiYWNrKSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZWxtLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGVsbVtpXS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgfSk7XG4gICAgfVxufTtcblxuZnVuY3Rpb24gdHlwZU9mQW5pbWF0aW9uKHR5cGUsIHR5cGVDbGFzcykge1xuICAgIHZhciBhbmltYXRpb25UeXBlcyA9IHtcbiAgICAgICAgICAgICdzbGlkZSc6IFsnc2xpZGUtbmV4dCcsICdzbGlkZS1iYWNrJ10sXG4gICAgICAgICAgICAnc2NhbGUnOiBbJ3NjYWxlLW5leHQnLCAnc2NhbGUtYmFjayddXG4gICAgICAgIH0sXG4gICAgICAgIGFuaW1hdGlvbkNsYXNzID0gYW5pbWF0aW9uVHlwZXNbdHlwZV07XG5cbiAgICAgICAgaWYgKHR5cGUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgaWYgKHR5cGVDbGFzcyA9PT0gMikge1xuICAgICAgICAgICAgICAgIHJldHVybiBhbmltYXRpb25UeXBlcy5zbGlkZVsxXTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGFuaW1hdGlvblR5cGVzLnNsaWRlWzBdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKHR5cGVDbGFzcyA9PT0gMikge1xuICAgICAgICAgICAgcmV0dXJuIGFuaW1hdGlvbkNsYXNzWzFdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGFuaW1hdGlvbkNsYXNzWzBdO1xuICAgICAgICB9XG59XG5cbmZ1bmN0aW9uIHRyYW5zaXRpb25QcmVmaXgoZWxtKSB7XG4gICAgdmFyIHRyYW5zRW5kRXZlbnROYW1lcyA9IHtcbiAgICAgICAgJ1dlYmtpdFRyYW5zaXRpb24nIDogJ3dlYmtpdFRyYW5zaXRpb25FbmQnLFxuICAgICAgICAnTW96VHJhbnNpdGlvbicgICAgOiAndHJhbnNpdGlvbmVuZCcsXG4gICAgICAgICdPVHJhbnNpdGlvbicgICAgICA6ICdvVHJhbnNpdGlvbkVuZCBvdHJhbnNpdGlvbmVuZCcsXG4gICAgICAgICd0cmFuc2l0aW9uJyAgICAgICA6ICd0cmFuc2l0aW9uZW5kJ1xuICAgIH07XG5cbiAgICBmb3IgKHZhciBuYW1lIGluIHRyYW5zRW5kRXZlbnROYW1lcykge1xuICAgICAgaWYgKGVsbS5zdHlsZVtuYW1lXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBlbmQ6IHRyYW5zRW5kRXZlbnROYW1lc1tuYW1lXVxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH1cbn1cblxuZnVuY3Rpb24gc2V0RXZlbnRzKCkge1xuICAgIHZhciBuZXh0QnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21vZGFsLWJ1dHRvbi1uZXh0JyksXG4gICAgICAgIHByZXZCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbW9kYWwtYnV0dG9uLXByZXYnKSxcbiAgICAgICAgY2xvc2VkID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnbW9kYWwtZnVsbHNjcmVlbi1jbG9zZScpLFxuICAgICAgICBfdGhpcyA9IHRoaXM7XG5cbiAgICB0aGlzLmNsYXNzRXZlbnRMaXN0ZW5lcihjbG9zZWQsIGZ1bmN0aW9uKCkge1xuICAgICAgICBfdGhpcy5jbG9zZSgpO1xuICAgIH0pO1xuXG4gICAgaWYgKHRoaXMub3B0aW9ucy5zaWRlVHdvLmNvbnRlbnQgPT09IG51bGwpIHJldHVybjtcblxuICAgIG5leHRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLl9jb250ZW50TmV4dC5iaW5kKHRoaXMpKTtcbiAgICBwcmV2QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5fY29udGVudFByZXZpb3VzLmJpbmQodGhpcykpO1xufVxuXG5mdW5jdGlvbiBidWlsZCgpIHtcbiAgICBpZiAodGhpcy5vcHRpb25zLmNsb3NlQnV0dG9uID09PSB0cnVlKSB7XG4gICAgICAgIHRoaXMuY2xvc2VCdXR0b24gPSAnPHNwYW4gY2xhc3M9XCJtb2RhbC1mdWxsc2NyZWVuLWNsb3NlXCI+WDwvc3Bhbj4nO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuY2xvc2VCdXR0b24gPSAnJztcbiAgICB9XG5cbiAgICB2YXIgdG1wbCA9ICc8ZGl2IGlkPVwib3ZlcmxheS1tb2RhbC1ibGFuY1wiIGNsYXNzPVwibW9kYWwtZnVsbHNjcmVlbi1iYWNrZ3JvdW5kJyArICcgJyArICB0aGlzLm9wdGlvbnMuYW5pbWF0aW9uICsgJyAnICsgJ2lzLWFjdGl2ZVwiPicgK1xuICAgICAgICAgICAgICAgICAgICAnPGRpdiBpZD1cIm1vZGFsLWZ1bGxzY3JlZW4tY29udGFpbmVyXCJjbGFzcz1cIm1vZGFsLWZ1bGxzY3JlZW4tY29udGFpbmVyIGJpZy1tb2RhbFwiPicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJzxkaXYgaWQ9XCJjYXJkXCI+JytcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cImZyb250XCI+JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8ZGl2IGlkPVwiZnJvbnQtY2FyZFwiIGNsYXNzPVwibW9kYWwtZnVsbHNjcmVlbi1pdGVtXCI+JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNsb3NlQnV0dG9uICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnRUeXBlKHRoaXMub3B0aW9ucy5jb250ZW50KSArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8L2Rpdj4nK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8L2Rpdj4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cImJhY2tcIj4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJzxkaXYgIGlkPVwiYmFjay1jYXJkXCIgY2xhc3M9XCJtb2RhbC1mdWxsc2NyZWVuLWl0ZW1cIj4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2xvc2VCdXR0b24gK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudFR5cGUodGhpcy5vcHRpb25zLnNpZGVUd28uY29udGVudCkgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPC9kaXY+JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJzwvZGl2PicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJzwvZGl2PicgK1xuICAgICAgICAgICAgICAgICAgICAnPC9kaXY+JyArXG4gICAgICAgICAgICAgICAgJzwvZGl2PicsXG4gICAgICAgIG1vZGFsSWQsXG4gICAgICAgIGJvZHkgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnYm9keScpO1xuXG4gICAgaWYgKGJvZHlbMF0uaWQpIHtcbiAgICAgICAgbW9kYWxJZCA9IGJvZHlbMF0uaWQ7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgbW9kYWxJZCA9ICdnby1tb2RhbCc7XG4gICAgICAgIGJvZHlbMF0uaWQgPSBtb2RhbElkO1xuICAgIH1cblxuICAgIHN0cmluZ0FzTm9kZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZChtb2RhbElkKSwgdG1wbCk7XG4gICAgdGhpcy5zZXR0aW5ncy5tb2RhbE9wZW4gPSB0cnVlO1xuXG4gICAgaWYgKHRoaXMub3B0aW9ucy5zaWRlVHdvLmNvbnRlbnQgPT09IG51bGwpIHJldHVybjtcblxuICAgIGJ1aWxkQnV0dG9uKHRoaXMub3B0aW9ucy5zaWRlVHdvLmJ1dHRvbik7XG4gICAgYnVpbGRCdXR0b24odGhpcy5vcHRpb25zLnNpZGVUd28uYnV0dG9uQmFjaywgJ2JhY2snKTtcbn1cblxuZnVuY3Rpb24gYnVpbGRFbGVtZW50KGJ1aWxkT3B0aW9ucykge1xuICAgIHZhciBjcmVhdGVFbG0sXG4gICAgICAgIHBhcmVudEVsbTtcblxuICAgIGNyZWF0ZUVsbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoYnVpbGRPcHRpb25zLmVsbSk7XG4gICAgY3JlYXRlRWxtLmlkID0gYnVpbGRPcHRpb25zLmJ1dHRvbklkO1xuICAgIGNyZWF0ZUVsbS5pbm5lckhUTUwgPSBidWlsZE9wdGlvbnMuYnV0dG9uVGV4dDtcbiAgICBwYXJlbnRFbG0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChidWlsZE9wdGlvbnMucGFyZW50SWQpO1xuXG4gICAgcGFyZW50RWxtLmFwcGVuZENoaWxkKGNyZWF0ZUVsbSk7XG59XG5cblxuZnVuY3Rpb24gYnVpbGRCdXR0b24oZWxtKSB7XG4gICAgdmFyIGJ1dHRvbixcbiAgICAgICAgY29tcHV0ZWRCdXR0b24sXG4gICAgICAgIGNvbXB1dGVkQnV0dG9uQmFjayxcbiAgICAgICAgZnJvbnRDYXJkLFxuICAgICAgICBiYWNrQ2FyZDtcblxuICAgIGlmIChlbG0gPT09IG51bGwgfHwgZWxtID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgaWYgKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtb2RhbC1idXR0b24tbmV4dCcpIHx8IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtb2RhbC1idXR0b24tcHJldicpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBidWlsZEVsZW1lbnQoe1xuICAgICAgICAgICAgICAgIGVsbTogJ2EnLFxuICAgICAgICAgICAgICAgIGJ1dHRvbklkOiAnbW9kYWwtYnV0dG9uLW5leHQnLFxuICAgICAgICAgICAgICAgIGJ1dHRvblRleHQ6ICdOZXh0IHN0ZXAnLFxuICAgICAgICAgICAgICAgIHBhcmVudElkOiAnZnJvbnQtY2FyZCdcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBidWlsZEVsZW1lbnQoe1xuICAgICAgICAgICAgICAgIGVsbTogJ2EnLFxuICAgICAgICAgICAgICAgIGJ1dHRvbklkOiAnbW9kYWwtYnV0dG9uLXByZXYnLFxuICAgICAgICAgICAgICAgIGJ1dHRvblRleHQ6ICdQcmV2aW91cyBzdGVwJyxcbiAgICAgICAgICAgICAgICBwYXJlbnRJZDogJ2JhY2stY2FyZCdcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgICAgYnVpbGRFbGVtZW50KHtcbiAgICAgICAgICAgIGVsbTogZWxtLmVsZW1lbnQsXG4gICAgICAgICAgICBidXR0b25JZDogZWxtLmlkLFxuICAgICAgICAgICAgYnV0dG9uVGV4dDogZWxtLnRleHQsXG4gICAgICAgICAgICBwYXJlbnRJZDogZWxtLnBhcmVudCxcbiAgICAgICAgfSk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBjb250ZW50VHlwZShjb250ZW50VmFsdWUpIHtcbiAgICBpZiAodHlwZW9mIGNvbnRlbnRWYWx1ZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgcmV0dXJuIGNvbnRlbnRWYWx1ZTtcbiAgICB9IGVsc2UgaWYgKGNvbnRlbnRWYWx1ZSA9PT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gJyc7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGNvbnRlbnRWYWx1ZS5pbm5lckhUTUw7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBzdHJpbmdBc05vZGUoZWxlbWVudCwgaHRtbCkge1xuICAgIGlmIChodG1sID09PSBudWxsKSByZXR1cm47XG5cbiAgICB2YXIgZnJhZyA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKSxcbiAgICAgICAgdG1wID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYm9keScpLFxuICAgICAgICBjaGlsZDtcblxuICAgIHRtcC5pbm5lckhUTUwgPSBodG1sO1xuXG4gICAgd2hpbGUgKGNoaWxkID0gdG1wLmZpcnN0Q2hpbGQpIHtcbiAgICAgICAgZnJhZy5hcHBlbmRDaGlsZChjaGlsZCk7XG4gICAgfVxuXG4gICAgZWxlbWVudC5hcHBlbmRDaGlsZChmcmFnKTtcbiAgICBmcmFnID0gdG1wID0gbnVsbDtcbn1cblxuZnVuY3Rpb24gZXh0ZW5kRGVmYXVsdChzb3VyY2UsIHByb3BlcnRpZXMpIHtcbiAgICB2YXIgcHJvcGVydHk7XG4gICAgZm9yIChwcm9wZXJ0eSBpbiBwcm9wZXJ0aWVzKSB7XG4gICAgICAgIGlmIChwcm9wZXJ0aWVzLmhhc093blByb3BlcnR5KHByb3BlcnR5KSkge1xuICAgICAgICAgICAgc291cmNlW3Byb3BlcnR5XSA9IHByb3BlcnRpZXNbcHJvcGVydHldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBzb3VyY2U7XG59XG5cblxubW9kdWxlLmV4cG9ydHMgPSBNb2RhbGJsYW5jOyJdfQ==
