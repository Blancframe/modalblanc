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
        overlay: true
    };

    if (arguments[0] && typeof arguments[0] === 'object') {
        this.options = extendDefault(defaults, arguments[0]);
    };

};

Modalblanc.prototype.open = function() {
    build.call(this);
    setEvents.call(this);
}

Modalblanc.prototype.close = function() {
    var overlay = document.getElementById('overlay-modal-blanc');

    overlay.classList.remove('is-active');
    overlay.classList.add('is-inactive');

    var transPrefix = transitionPrefix(overlay);

    overlay.addEventListener(transPrefix.end, function() {
        this.remove();
    }, false );
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
    var overlay = document.getElementById('overlay-modal-blanc'),
        close = document.getElementById('close-modal-blanc');

    if (this.closeButton) {
        close.addEventListener('click', this.close.bind(this));
    }

    if (this.overlay) {
        overlay.addEventListener('click', this.close.bind(this));
    }

}

function build() {
    var content;

    if (typeof this.options.content === 'string') {
        content = this.options.content
    } else {
        content = this.options.content.innerHTML;
    }

    if (this.options.closeButton === true) {
        this.closeButton = '<span class="modal-fullscreen-close" id="close-modal-blanc">X</span>'
    } else {
        this.closeButton = '';
    }

    if (this.options.overlay === true) {
        this.overlay = 'style="background: rbga(255,255,255, 0);"';
    } else {
        this.overlay = '';
    }

    var tmpl = '<div id="overlay-modal-blanc" class="modal-fullscreen-background' + ' ' +  this.options.animation + ' ' + 'is-active"'+ this.overlay + '>' +
                    '<div class="modal-fullscreen-container big-modal">' +
                        '<div id="card">'+
                            this.closeButton +
                            '<div class="front">' +
                                '<div class="modal-fullscreen-item">' + 
                                content +
                                '</div>'+
                            '</div>' +
                            '<div class="back">' +
                                '<div class="modal-fullscreen-item"></div>' +
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
}

function stringAsNode(element, html) {
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

