const assert = require("assert");
const { Given, When, Then } = require("@cucumber/cucumber");

var print = require("../../statement");

Given("el listado de la facturación de espectáculos", function (espectaculos) {
  this.invoice = JSON.parse(espectaculos);
});

Given("la lista de obras", function (obras) {
  this.plays = JSON.parse(obras);
});

When("mando a imprimir el borderau", function () {
  this.actualAnswer = print.printTheBill(
    this.invoice,
    this.plays,
    "USD",
    "text"
  );
});

Then("debería imprimir el borderau", function (expectedAnswer) {
  assert.equal(this.actualAnswer.trim(), expectedAnswer.trim());
});

When("mando a imprimir el borderau en HTML", function () {
  this.actualAnswer = print.printTheBill(
    this.invoice,
    this.plays,
    "USD",
    "html"
  );
});

Then("debería imprimir el borderau en HTML", function (expectedAnswer) {
  assert.equal(this.actualAnswer.trim(), expectedAnswer.trim());
});
