# Modalblanc

[![Build Status](https://travis-ci.org/Blancframe/modalblanc.svg?branch=master)](https://travis-ci.org/Blancframe/modalblanc)

## Simple Modalbox

### Getting started

**Add script to head or to bottom of body.**

```<script src="dist/modalblanc.js"></script>```

**Minified version.**

```<script src="dist/modalblanc.min.js"></script>```

**Add stylesheet to head**

```<link rel="stylesheet" href="dist/modalblanc.css">```

**Set content and animation**

```
<script>
    var modal = new Modalblanc({
        content: <h1>Hello world</h1>,
        animation: 'slide-in-right',
        closeButton: false,
        sideTwo: {
            content: '<h2>Hello universe!</h2>',
            animation: 'scale',
            button: {element: 'a', text: 'Next step!!', type: 'nextStep', id: 'modal-button-next', parent: 'front-card'},
            buttonBack: {element: 'a', text: 'GO BACK!!', type: 'prevStep', id: 'modal-button-prev', parent: 'back-card'}
        }
    });

    modal.open();
    modal.close();
</script>
```

### Install with [npm](https://www.npmjs.com)
`npm install modalblanc --save-dev`

#### Usage
```
var Modalblanc = require('modalblanc');

var modal = new Modalblanc({
    content: <h1>Hello world</h1>,
    animation: 'slide-in-right',
    closeButton: false,
    sideTwo: {
        content: '<h2>Hello universe!</h2>',
        animation: 'scale',
        button: {element: 'a', text: 'Next step!!', type: 'nextStep', id: 'modal-button-next', parent: 'front-card'},
        buttonBack: {element: 'a', text: 'GO BACK!!', type: 'prevStep', id: 'modal-button-prev', parent: 'back-card'}
    }
});

modal.open();
modal.close();
```

### General options
* **content** (String - default=null)
> Displays your content in the modal

* **animation** (String - default=fade-in-out)
> Type of animation (fade-in-out, slide-in-right)

* **slider** (Array - optional)
> Enable photo slider

```
var photos = [
    'image.jpg',
    'image.jpg',
    'image.jpg'
];

var modal = new Modalblanc({
    slider: photos
});
```

* **closeButton** (Boolean - default=true)
> Show or hide the close button

* **sideTwo: content** (String - default=null)
> Displays your content on the backside of the modal

* **sideTwo: animation** (String - default=slide)
> Type of modal content animation (slide, scale)

* **sideTwo: button** (Object - default=null)
> Custom elements (a, button, li e.g.) `id` always have to be `modal-button-next` and `parent` always `front-card`. Fix this on short term.

* **sideTwo: buttonBack** (Object - default=null)
> Custom elements (a, button, li e.g.) `id` always have to be `modal-button-prev` and `parent` always `back-card`. Fix this on short term.
