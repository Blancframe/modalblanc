/**
 * Modalblanc
 */
Modalblanc = function() {
    if (!(this instanceof Modalblanc)) {
        return new Modalblanc();
    };

    this.closeButton = null;
    this.overlay = null;

    var defaults = {
        animation: 'fade-in-out',
        closeButton: true,
        content: '',
        sideTwo: {
            content: null,
            button: null,
            buttonBack: null
        },
    };

    this.settings = {};

    if (arguments[0] && typeof arguments[0] === 'object') {
        this.options = extendDefault(defaults, arguments[0]);
    };

};

Modalblanc.prototype.open = function() {
    if (this.settings.modalOpen) return;

    build.call(this);
    setEvents.call(this);
}

Modalblanc.prototype.close = function() {
    if (!this.settings.modalOpen) return;

    var overlay = document.getElementById('overlay-modal-blanc'),
        _this = this;

    overlay.classList.remove('is-active');
    overlay.classList.add('is-inactive');

    var transPrefix = transitionPrefix(overlay);

    overlay.addEventListener(transPrefix.end, function() {
        this.remove();
        _this.settings['modalOpen'] = false;
    }, false );
}

Modalblanc.prototype._contentNext = function() {
	var card = document.getElementById('card');

	card.classList.add('flipped');
}

function transitionPrefix(elm) {
    var transEndEventNames = {
        'WebkitTransition' : 'webkitTransitionEnd',
        'MozTransition'    : 'transitionend',
        'OTransition'      : 'oTransitionEnd otransitionend',
        'transition'       : 'transitionend'
    }

    for (var name in transEndEventNames) {
      if (elm.style[name] !== undefined) {
        return { end: transEndEventNames[name] }
      }
    }
}

function setEvents() {
    var nextButton = document.getElementById('modal-button-next'),
    	closed = document.getElementsByClassName('modal-fullscreen-close'),
		_this = this;

	this.classEventListener(closed, function() {
		_this.close();
	});

    if (this.options.sideTwo.content === null) return;

    nextButton.addEventListener('click', this._contentNext.bind(this));
}

Modalblanc.prototype.classEventListener = function(elm, callback) {
	var _this = this;

	for (i = 0; i < elm.length; i++) {
	    elm[i].addEventListener('click', function() {
            callback();
	    });
	}
}

function build() {
    if (this.options.closeButton === true) {
        this.closeButton = '<span class="modal-fullscreen-close">X</span>'
    } else {
        this.closeButton = '';
    }

    var tmpl = '<div id="overlay-modal-blanc" class="modal-fullscreen-background' + ' ' +  this.options.animation + ' ' + 'is-active">' +
                    '<div class="modal-fullscreen-container big-modal">' +
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
    this.settings['modalOpen'] = true;
    
    if (this.options.sideTwo.content === null) return;

    stringAsNode(document.getElementById('front-card'), buildButton(this.options.sideTwo.button));
    // stringAsNode(document.getElementById('back-card') ,this.options.sideTwo.buttonBack);
}


function buildButton(elm) {
    var button;

    if (elm === null || elm === undefined) {
      switch(elm) {
        case undefined:
          button = '<a id="modal-button-next">next step</a>';
        break;
        case null:
          button = '<a id="modal-button-next">next step</a>';
        break;
      }
    } else {
      return
    }

    return button;
}

function contentType(contentValue) {
    if (typeof contentValue === 'string') {
        return contentValue
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

