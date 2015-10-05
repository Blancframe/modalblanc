describe("Modal appearance tests", function () {
    var modal = new Modalblanc({
        content: '<h1>Welcome</h1>'
    });

    modal.open();

    var overlay = document.getElementById('overlay-modal-blanc'),
        contentDiv = document.getElementById('front-card'),
        closeButton = contentDiv.getElementsByClassName('modal-fullscreen-close');
 
    it("is a child of the body", function () {
        expect(overlay.parentElement).to.equal(document.body);
    });
 
    it("has the right html", function () {
        expect(contentDiv.innerHTML).to.equal(
                '<span class="modal-fullscreen-close">X</span>' + 
                '<h1>Welcome</h1>'
            );
    });

    it("has a close button", function() {
        expect(closeButton[0].classList[0]).to.equal('modal-fullscreen-close');
    });
});