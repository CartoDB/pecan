var test = require('tape');
var Pecan = require('../src/pecan');
var _ = require('underscore');

var guessMap = function(opts) {
  return Pecan.guessMap(_.defaults(opts, {
    tableName: 'testable',
    dependencies: {
      underscore: _
    }
  }));
};

test('date column', function(t) {
  t.plan(1);

  var results = guessMap({
    column: {
      geometryType: 'point',
      bbox: [
        [-28.92163128242129,-201.09375],
        [75.84516854027044,196.875]
      ],
      stats: {
        type: 'date',
        start_time: '2015-02-19T15:13:16.000Z',
        end_time: '2015-02-22T04:34:05.000Z',
        range: 220849000,
        steps: 1024,
        null_ratio: 0,
        column: 'object_postedtime'
      }
    }
  });

  t.notEqual(results.css.indexOf('torque'), -1, 'should return CSS for a torque style');
});

test('number column', function(t) {
  t.plan(2);

  var opts = {
    column: {
      "geometryType": "point",
      "stats": {
        "type": "number",
        "stddev": 0.00399008175326912,
        "null_ratio": 0,
        "count": 103,
        "distinct": 10,
        "avg": 4.4781284606866,
        "max": 25,
        "min": 0,
        "stddevmean": 0.805032851171774,
        "weight": 0.8,
        "quantiles": [0.001,2,4,5,6,8,25],
        "jenks": [3,3,5,7.4,8.2,13,25],
        "headtails": [4.4781284606866,7.369585253456221,10.139506172839507,13.511538461538462,17.08823529411765,20.8,24.5],
        "dist_type": "U",
        "column": "asdfd"
      }
    }
  };

  var results = guessMap(opts);
  t.notEqual(results.css.indexOf('bubble'), -1, 'should return CSS for a bubble map for a point geometry type');

  opts.column.geometryType = 'polygon';
  var results = guessMap(opts);
  t.notEqual(results.css.indexOf('choropleth'), -1, 'should return CSS for a choropleth map for a non-point (e.g. polygon) geometry type');
});

test('string column', function(t) {
  t.plan(1);

  var results = guessMap({
    column: {
      "geometryType": "point",
      "stats": JSON.parse('{"type":"string","hist":[["637",1],["552",2],["1554",1],["265",1],["513",1],["1839",1],["525",1],["235",1],["393",1],["124",1],["1478",1],["12",3],["1987",1],["267",3],["1018",1],["97",1],["1565",1],["1861",1],["121",1],["1184",1],["290",1],["617",1],["1141",1],["1150",1],["127",2],["1966",1],["136",1],["1624",1],["1926",1],["1284",1],["857",1],["142",1],["1171",1],["958",1],["726",1],["37",2],["406",2],["350",2],["991",1],["1630",1],["341",1],["6",2],["1945",1],["305",2],["1603",1],["418",2],["1226",1],["430",3],["232",1],["311",1],["1134",1],["195",1],["1000",1],["946",1],["822",1],["336",1],["908",1],["1065",1],["1910",1],["1559",1],["500",1],["1813",1],["349",1],["24",3],["1731",1],["1772",1],["809",1],["1753",1],["629",1],["49",3],["1139",1],["182",1],["2000",1],["1405",1],["521",1],["69",1],["1431",1],["1530",1],["129",1],["116",1],["1238",1],["797",1],["1970",1],["306",1],["672",1],["420",2],["339",1],["1209",1],["1428",1],["1315",1],["1081",1],["71",2],["1990",1],["99",1],["55",1],["1590",1],["470",1],["1531",1],["923",1],["174",1]],"distinct":936,"count":2260,"null_count":0,"null_ratio":0,"skew":0.5172566371681416,"weight":0.30302999451797324,"column":"retweetcount"}')
    }
  });

  t.notEqual(results.css.indexOf('category'), -1, 'should return CSS for category map');
});

test('boolen column', function(t) {
  t.plan(1);

  var results = guessMap({
    column: {
      "geometryType": "point",
      "bbox": [
        [
          4.7406753847783865,
          -112.32421875
        ],
        [
          64.24459476798192,
          108.28125
        ]
      ],
      "stats": {
        "type": "boolean",
        "stddev": 0.00399008175326912,
        "null_ratio": 0,
        "count": 903,
        "distinct": 65,
        "avg": 4.4781284606866,
        "max": 25,
        "min": 0,
        "stddevmean": 0.805032851171774,
        "weight": 0.5,
        "quantiles": [0.001,2,4,5,6,8,25],
        "jenks": [3,3,5,7.4,8.2,13,25],
        "headtails": [4.4781284606866,7.369585253456221,10.139506172839507,13.511538461538462,17.08823529411765,20.8,24.5],
        "dist_type": "L",
        "column": "asdfd"
      }
    }
  });

  t.notEqual(results.css.indexOf('category'), -1, 'should return CSS for category map');
});
