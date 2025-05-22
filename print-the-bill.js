module.exports = statement = function (invoice, plays) {
  let statementData = {};
  statementData.customer = invoice.customer;
  statementData.performances = invoice.performances.map(enrichPerformances);
  statementData.totalAmount = totalAmount(statementData.performances);
  statementData.totalVolumeCredits = totalVolumeCredits(
    statementData.performances
  );
  return renderPlanintText(statementData);

  function enrichPerformances(aPerformance) {
    const result = Object.assign({}, aPerformance);
    result.play = playFor(result);
    result.amount = amountFor(result);
    result.volumeCredits = volumeCreditsFor(result);

    return result;
  }

  function amountFor(aPerformance) {
    let result = 0;

    switch (aPerformance.play.type) {
      case "tragedy":
        result = 40000;
        if (aPerformance.audience > 30) {
          result += 1000 * (aPerformance.audience - 30);
        }
        break;
      case "comedy":
        result = 30000;
        if (aPerformance.audience > 20) {
          result += 10000 + 500 * (aPerformance.audience - 20);
        }
        result += 300 * aPerformance.audience;
        break;
      default:
        throw new Error(`unknown type: ${aPerformance.play.type}`);
    }
    return result;
  }
  function totalAmount(somePerformances) {
    return somePerformances.reduce((total, p) => total + p.amount, 0);
  }

  function volumeCreditsFor(aPerformance) {
    let result = 0;
    result += Math.max(aPerformance.audience - 30, 0);
    // add extra credit for every ten comedy attendees
    if ("comedy" === aPerformance.play.type)
      result += Math.floor(aPerformance.audience / 5);

    return result;
  }
  function totalVolumeCredits(somePerformances) {
    return somePerformances.reduce((total, p) => total + p.volumeCredits, 0);
  }
  function playFor(aPerformance) {
    let result = plays[aPerformance.playID];
    return result;
  }
};

function renderPlanintText(data) {
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
}
