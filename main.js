var fs = require("fs");
var dataPlays = fs.readFileSync("plays.json", "utf8");
var plays = JSON.parse(dataPlays);
var dataInvoices = fs.readFileSync("invoices.json", "utf8");
var invoices = JSON.parse(dataInvoices);
var print_the_bill = require("./statement.js");

for (let invoice of invoices) {
  console.log(print_the_bill.printTheBillText(invoice, plays));
}
