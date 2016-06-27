var should = require("chai").should(),
    TemplateEngine = require("../lib/template-engine");

describe("#Template Engine equals", function() {
    var template = "<h1> This is <%this.name%>! </h1>";

    var result = TemplateEngine(template, {
        name: "HTML"
    });

    it("verified that the result is same as <h1> This is HTML! </h1>", function() {
        result.should.equal("<h1> This is HTML! </h1>");
    });
});
