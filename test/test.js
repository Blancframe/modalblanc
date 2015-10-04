describe("DOM Tests", function () {
    var btn = document.createElement("button");
    btn.id = "modal-blanc-button";
    btn.innerHTML = "Open modal blanc";
    document.body.appendChild(btn);

    var modal = new Modalblanc({
        content: '<h1>Welcome</h1>'
    });
 
    var myEl = document.getElementById('modal-blanc-button');

    setTimeout(function() {
        myEl.click();
    }, 500)

    myEl.onclick = function() {
        modal.open();
    }

    it("is in the DOM", function () {
        expect(myEl).to.not.equal(null);
    });
 
    it("is a child of the body", function () {
        expect(myEl.parentElement).to.equal(document.body);
    });
 
    it("has the right text", function () {
        expect(myEl.innerHTML).to.equal("Open modal blanc");
    });
});