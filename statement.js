const createStatementData = require("./createStatementData");

// exports.printTheBillText = function (invoice, plays, currency, tipo) {
//   return printTheBill(invoice, plays, new PlanintText(currency));
// };

// exports.printTheBillHtml = function (invoice, plays, currency, tipo) {
//   return printTheBill(invoice, plays, new HtmlStatement(currency));
// };

exports.printTheBill = function (invoice, plays, currency, type) {
  const renderer = RendererFactory.getRenderer(type, currency);
  if (!renderer) {
    throw new Error(`Renderer type "${type}" no soportado.`);
  }
  return printTheBill(invoice, plays, renderer);
};

class StatementRenderer {
  constructor(currency) {
    this.currency = currency;
  }
  render(data) {
    throw new Error("Esto no se resuelve aqui");
  }
}

function printTheBill(invoice, plays, renderer) {
  const data = createStatementData(invoice, plays);
  return renderer.render(data);
}

exports.printTheBill = function (invoice, plays, currency, type) {
  const renderer = RendererFactory.getRenderer(type, currency);
  if (!renderer) {
    throw new Error(`Renderer type "${type}" no soportado.`);
  }
  return printTheBill(invoice, plays, renderer);
};

class PlanintText extends StatementRenderer {
  render(data) {
    let result = `Statement for ${data.customer}\n`;

    for (let perf of data.performances) {
      // print line for this order
      result += `  ${perf.play.name}: ${format(perf.amount / 100, "USD")} (${
        perf.audience
      } seats)\n`;
      // totalAmount += amountFor(perf);
    }
    result += `Amount owed is ${format(data.totalAmount / 100, "USD")}\n`;
    result += `You earned ${data.totalVolumeCredits} credits\n`;
    return result;
  }
}

function format(aNumber, aCurrency) {
  switch (aCurrency) {
    case "USD":
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: aCurrency,
        minimumFractionDigits: 2,
      }).format(aNumber);
    default:
      break;
  }
}
function usd(amount) {
  return amount / 100;
}

class HtmlStatement extends StatementRenderer {
  render(data) {
    let result = `<h1>Statement for ${data.customer}</h1>\n`;
    result += "<table>\n";
    result += "<tr><th>play</th><th>seats</th><th>cost</th></tr>\n";
    for (let perf of data.performances) {
      //result += `<tr><td>${perf.play.name}</td><td>${perf.audience}</td>`;
      //result += `<td>${usd(perf.amount)}</td></tr>\n`;
      result += `<tr><td>${perf.play.name}</td><td>${perf.audience}</td>`;
      result += `<td>${format(perf.amount / 100, this.currency)}</td></tr>\n`;
    }
    result += "</table>\n";
    //result += `<p>Amount owed is <em>${usd(data.totalAmount)}</em></p>\n`;
    result += `<p>Amount owed is <em>${format(
      data.totalAmount / 100,
      this.currency
    )}</em></p>\n`;
    result += `<p>You earned <em>${data.totalVolumeCredits}</em> credits</p>\n`;
    return result;
  }
}

// Fábrica para seleccionar el renderer
class RendererFactory {
  static renderers = {
    text: PlanintText,
    html: HtmlStatement,
  };
  static getRenderer(type, currency) {
    const RendererClass = this.renderers[type];
    if (RendererClass) {
      return new RendererClass(currency);
    }
    return null;
  }
}
