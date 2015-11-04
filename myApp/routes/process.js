var request = require('request');
var CSV = require('csv-string');
var moment = require('moment');

exports.process =  function (req, res){
    var URL;
    var loadTime;
    var TTFB;
    var TTFB1;
    var date;
    var date1;
    var date2;
    var db;
    var data_url;

    // initiating the test
    var WebPageTest = require('webpagetest');
    var wpt = new WebPageTest('ec2-54-209-125-198.compute-1.amazonaws.com');


    //Running the test
    wpt.runTest('https://staging.sprinklr.com',function(err, data) {
        //console.log("hello -->",err || data);

        data_url = data.data.summaryCSV;
        console.log('-----------');
        console.log(data_url);
        console.log('-----------');
        var delay = 50000;

        setTimeout(function(){request({uri:data_url,method:'GET'}, function (error,response,body)  {
            console.log('----@@@@@@----');
            console.log(response.headers);
            console.log('----@@@@@@----');
            //console.log(response);
            if (error) {
                console.log('got an error' + error);
            }
            //console.log(response);
            //console.log(body);
            var data = body;
            console.log('here is the body');
            console.log(body);


            CSV.forEach(data, ',', function (row, index) {
                if (index == 1 || index == 2) {
                    URL = row[0];
                    loadTime = row[1];

                    TTFB = row[2];
                    TTFB1 = parseInt(TTFB);

                    date = new Date(row[59] * 1000);
                    month = date.getUTCMonth() + 1;
                    month = month.toString();
                    var day = date.getUTCDate();
                    day = day.toString();
                    var year = date.getUTCFullYear();
                    year = year.toString();
                    date = year + "-" + month + "-" + day;
                    date1 = new Date(date);
                    date2 = moment(date1).format('YYYY-MM-DD');

                    //console.log(loadTime);

                    // Writting into the databse
                    var db = req.db;
                    var collection = db.get('collection');
                    collection.insert({
                        "Date": date2,
                        "TTFB": TTFB1,
                        "loadTime": loadTime,
                        "Url": URL
                    }, function (err, doc) {
                        if (err) {
                            res.send("There was a problem adding the information to the database.");
                        }
                    });
                    res.render('index', {title: "All the test Results have been added to the databases, Go to localhost/getData to get the graph"});
                    //res.redirect('/getData');
                }
            })
        })},delay);
    });
};

//'http://ec2-54-209-125-198.compute-1.amazonaws.com/result/151028_8V_8/page_data.csv