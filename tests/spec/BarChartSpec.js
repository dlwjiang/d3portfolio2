describe("BarChart", function() {

  var chart;
  var example1 = [
      {label: "apples", value: 10},
      {label: "oranges", value: 20},
      {label: "bananas", value: 30},
      {label: "durians", value: 20},
      {label: "watermelon", value: 10},
      {label: "grapefruit", value: 20},
      {label: "strawberries", value: 30}
   ];
  var selection = "#chart-test";

  var chart;

  beforeEach(function () {
    chart = barChart().data(example1).target(selection);
    chart();
  });

  afterEach(function() {
    $(selection).empty();
  });

  it("should have the correct data.", function() {
    expect(chart.data()).toEqual(example1);
    expect(chart.target()).toEqual(selection);
  });

  it("should have smaller bar widths when the window is made smaller.", function() {
    var originalWidth = chart.width();
    var originalBarWidth = chart.xScale().rangeBand();

    $(selection).width("50%");
    chart.update();

    var newWidth = chart.width();
    var newBarWidth = chart.xScale().rangeBand();

    expect(newWidth).toBeLessThan(originalWidth);
    expect(newBarWidth).toBeLessThan(originalBarWidth);
  });

  it("should have larger bar widths when the window is made larger.", function() {

    $(selection).width("50%");
    chart.update();
    var originalWidth = chart.width();
    var originalBarWidth = chart.xScale().rangeBand();

    $(selection).width("100%");
    chart.update();
    var newWidth = chart.width();
    var newBarWidth = chart.xScale().rangeBand();

    expect(newWidth).toBeGreaterThan(originalWidth);
    expect(newBarWidth).toBeGreaterThan(originalBarWidth);

  });


});
