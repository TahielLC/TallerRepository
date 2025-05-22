const createStatementData = require("./createStatementData");

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
  format(value) {
    switch (this.currency) {
      case "USD":
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          minimumFractionDigits: 2,
        }).format(value);
      case "ARS":
        return new Intl.NumberFormat("es-AR", {
          style: "currency",
          currency: "ARS",
          minimumFractionDigits: 2,
        }).format(value);
      default:
        return value.toFixed(2);
    }
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
      result += `  ${perf.play.name}: ${this.format(perf.amount / 100)} (${
        perf.audience
      } seats)\n`;
      // totalAmount += amountFor(perf);
    }
    result += `Amount owed is ${this.format(data.totalAmount / 100)}\n`;
    result += `You earned ${data.totalVolumeCredits} credits\n`;
    return result;
  }
}

class HtmlStatement extends StatementRenderer {
  render(data) {
    let result = `<h1>Statement for ${data.customer}</h1>\n`;
    result += "<table>\n";
    result += "<tr><th>play</th><th>seats</th><th>cost</th></tr>\n";
    for (let perf of data.performances) {
      result += `<tr><td>${perf.play.name}</td><td>${perf.audience}</td>`;
      result += `<td>${this.format(
        perf.amount / 100,
        this.currency
      )}</td></tr>\n`;
    }
    result += "</table>\n";
    result += `<p>Amount owed is <em>${this.format(
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
