// Generated by CoffeeScript 2.3.1
(function() {
  var _, arrayData, moment, objData, ohlc, test;

  require('source-map-support').install();

  _ = require('lodash');

  moment = require('moment');

  ({test} = require('ava'));

  ohlc = require('../');

  // ohlc = require '../dist/ohlc.js'
  objData = require('./objData.json');

  arrayData = require('./arrayData.json');

  test('constructor with array', function(t) {
    var prices, sample;
    prices = ohlc(arrayData).toDaily();
    sample = prices[0];
    return t.deepEqual(sample, {
      "Date": '2017-01-04',
      Open: 348,
      High: 350,
      Low: 346,
      Close: 350,
      Volume: 68700
    });
  });

  test('constructor with object', function(t) {
    var pricesArray, pricesObject;
    pricesArray = ohlc(arrayData).toDaily();
    pricesObject = ohlc(objData).toDaily();
    return t.deepEqual(pricesArray, pricesObject);
  });

  test('constructor throw', function(t) {
    var e;
    e = t.throws(function() {
      return ohlc([1, 2, 3, 4]);
    });
    return t.is(e.message, 'ArrayType Or ObjectType Required');
  });

  test('values(period)', function(t) {
    var prices;
    t.is(arrayData.length, 101);
    prices = ohlc(arrayData).value();
    t.is(prices.length, 101);
    prices = ohlc(arrayData).value('week');
    t.is(prices.length, 22);
    prices = ohlc(arrayData).value('month');
    return t.is(prices.length, 5);
  });

  test('toDaily()', function(t) {
    var d1, prices;
    prices = ohlc(arrayData).toDaily();
    d1 = prices.find(function(item) {
      return item.Date === '2017-04-03';
    });
    return t.deepEqual(d1, {
      "Date": '2017-04-03',
      Open: 352,
      High: 352,
      Low: 348,
      Close: 348,
      Volume: 108200
    });
  });

  test('toWeekly()', function(t) {
    var prices, w1;
    prices = ohlc(arrayData).toWeekly();
    w1 = prices.find(function(item) {
      return item.Date === '2017-04-02';
    });
    return t.deepEqual(w1, {
      "Date": '2017-04-02',
      Open: 352,
      High: 352,
      Low: 338,
      Close: 339,
      Volume: 379400
    });
  });

  test('toWeekly() with sma', function(t) {
    var prices, w1;
    prices = ohlc(arrayData).sma(13, 26, 52).toWeekly();
    w1 = prices.find(function(item) {
      return item.Date === '2017-04-02';
    });
    return t.deepEqual(w1, {
      "Date": '2017-04-02',
      Open: 352,
      High: 352,
      Low: 338,
      Close: 339,
      Volume: 379400,
      sma13: 351,
      sma26: null,
      sma52: null
    });
  });

  test('start() and end()', function(t) {
    var prices;
    prices = ohlc(arrayData).toDaily();
    t.is(prices.length, 101);
    prices = ohlc(arrayData).start('2017-04-03').toDaily();
    t.is(prices.length, 40);
    prices = ohlc(arrayData).end('2017-04-10').toDaily();
    t.is(prices.length, 67);
    prices = ohlc(arrayData).start('2017-04-03').end('2017-04-10').toDaily();
    return t.is(prices.length, 6);
  });

  test('toMonthly()', function(t) {
    var m1, prices;
    prices = ohlc(arrayData).toMonthly();
    m1 = prices.find(function(item) {
      return item.Date === '2017-04-01';
    });
    return t.deepEqual(m1, {
      "Date": '2017-04-01',
      Open: 352,
      High: 370,
      Low: 330,
      Close: 357,
      Volume: 1514900
    });
  });

  test('sma(range)', function(t) {
    var prices, samples;
    prices = ohlc(arrayData).sma(5, 25, 75).toDaily();
    samples = prices.filter(function(item) {
      return item.Date.includes('2017-02-');
    });
    t.is(samples[0].sma5, 347);
    t.is(samples[1].sma5, 347);
    t.is(samples[2].sma5, 346);
    return t.deepEqual(prices[100], {
      Date: '2017-05-31',
      Open: 372,
      High: 372,
      Low: 362,
      Close: 364,
      Volume: 46500,
      sma5: 373,
      sma25: 373,
      sma75: 360
    });
  });

  test('vwma(range)', function(t) {
    var prices, samples;
    prices = ohlc(arrayData).vwma(5, 25, 75).toDaily();
    samples = prices.filter(function(item) {
      return item.Date.includes('2017-02-');
    });
    t.is(samples[0].vwma5, 347);
    t.is(samples[1].vwma5, 347);
    t.is(samples[2].vwma5, 347);
    return t.deepEqual(prices[100], {
      Date: '2017-05-31',
      Open: 372,
      High: 372,
      Low: 362,
      Close: 364,
      Volume: 46500,
      vwma5: 374,
      vwma25: 374,
      vwma75: 361
    });
  });

  test('round().sma(range)', function(t) {
    var fn, prices;
    // round(undefined)
    prices = ohlc(arrayData).round().sma(75).toDaily();
    t.is(prices[100].sma75, 360);
    // round(number)
    prices = ohlc(arrayData).round(2).sma(75).toDaily();
    t.is(prices[100].sma75, 360.01);
    //round(function)
    fn = function(val) {
      return _.ceil(val, 2);
    };
    prices = ohlc(arrayData).round(fn).sma(75).toDaily();
    return t.is(prices[100].sma75, 360.02);
  });

  test('toChartData()', function(t) {
    var chartData, dailyData, ref;
    chartData = ohlc(arrayData).sma(5, 10).vwma(12, 26).toChartData();
    t.deepEqual(Object.keys(chartData), ['candle', 'volume', 'sma5', 'sma10', 'vwma12', 'vwma26']);
    dailyData = ohlc(arrayData).sma(5, 10).vwma(12, 26).toDaily();
    t.deepEqual(chartData.sma5[10], [1484784000000, 341]);
    return (function() {
      var results = [];
      for (var j = 0, ref = dailyData.length; 0 <= ref ? j < ref : j > ref; 0 <= ref ? j++ : j--){ results.push(j); }
      return results;
    }).apply(this).forEach(function(i) {
      t.is(chartData.sma5[i][1], dailyData[i].sma5);
      return t.is(chartData.vwma12[i][1], dailyData[i].vwma12);
    });
  });

  test('toChartData() by readme', function(t) {
    var chartData;
    chartData = ohlc(arrayData).sma(5, 25).toChartData();
    t.deepEqual(Object.keys(chartData), ['candle', 'volume', 'sma5', 'sma25']);
    t.deepEqual(chartData.candle[90], [1494979200000, 370, 372, 365, 369]);
    t.deepEqual(chartData.volume[90], [1494979200000, 32300]);
    t.deepEqual(chartData.sma5[90], [1494979200000, 372]);
    t.deepEqual(chartData.sma25[90], [1494979200000, 359]);
    return t.is(moment(chartData.candle[90][0]).format('YYYY-MM-DD'), '2017-05-17');
  });

  test('toChartData()', function(t) {
    var chartData;
    chartData = ohlc(arrayData).toChartData();
    t.deepEqual(Object.keys(chartData), ['candle', 'volume']);
    t.deepEqual(chartData.candle[0], [1483488000000, 348, 350, 346, 350]);
    return t.deepEqual(chartData.volume[0], [1483488000000, 68700]);
  });

  test('toChartData(period, opts)', function(t) {
    var chartData;
    chartData = ohlc(arrayData).sma(5, 25, 75).toChartData(null);
    // chartData = prices.toChartData(null,{sma: [5,25,75]})
    t.deepEqual(Object.keys(chartData), ['candle', 'volume', 'sma5', 'sma25', 'sma75']);
    t.deepEqual(chartData.sma5[0], [1483488000000, null]);
    return t.deepEqual(chartData.sma5[10], [1484784000000, 341]);
  });

  test('array range', function(t) {
    var arr;
    arr = [0, 1, 2, 3, 4, 5];
    t.deepEqual(arr.slice(2, 5), [2, 3, 4]);
    return t.deepEqual(arr.slice(2, 4), [2, 3]);
  });

  test('moment', function(t) {
    var _format;
    _format = 'gggg-ww';
    t.is(moment('2018-01-01').format(_format), '2018-01');
    t.is(moment('2018-01-02').format(_format), '2018-01');
    t.is(moment('2018-09-19').format(_format), '2018-38');
    t.is(moment('2018-12-30').format(_format), '2019-01');
    t.is(moment('2018-12-31').format(_format), '2019-01');
    t.is(moment('2019-01-01').format(_format), '2019-01');
    t.is(moment('2019-01-02').format(_format), '2019-01');
    t.is(moment('2019-05-01').format(_format), '2019-18');
    t.is(moment('2019-09-01').format(_format), '2019-36');
    return t.pass();
  });

  test('moment 2', function(t) {
    var d, m, sunday;
    m = moment('20180921');
    d = m.format('d'); // 曜日の数値表記
    sunday = m.subtract(d, 'days').format();
    return t.pass();
  });

}).call(this);
