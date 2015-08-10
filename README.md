# modalblanc
Simple Modalbox 

### Getting stared

**Add script to head or to bottom of body.**

```<script src="js/modal-blanc-min.js"></script>```

**Add stylesheet to head**

```<link rel="stylesheet" href="css/modal-blanc.css">```

**Set content and animation**

```
<script>
    var modal = new Modalblanc({
        content: <h1>Hello world</h1>,
        animation: 'slide-in-right',
        closeButton: false,
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
});

modal.open();
modal.close();
```

### General options
* **content** (String - default=null)
> Displays your content in the modal

* **animation** (String - default=fade-in-out)
> Type of animation

* **closeButton** (Boolean - default=true)
> Show or hide the close button