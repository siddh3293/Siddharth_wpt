/**
 * Created by siddharthsinha on 26/10/15.
 */

exports.getData = function(req,res){

    var db = req.db;
    var collection = db.get('collection');
    var i;
    var dates = new Array();
    var ttfbs = new Array();
    var lt = new Array();
    var len;
    var pre_final_str = new Array();
    var final_str ="";
    var url;
    collection.find({},{},function(e,docs){
        //console.log(docs);
        len = docs.length;
        for(i=0;i<docs.length;i++){

            dates.push(docs[i].Date);

            ttfbs.push(docs[i].TTFB);

            lt.push(docs[i].loadTime);

        }
        //console.log(dates);
        //console.log(ttfbs);
        //console.log(lt);

        for(i=0;i<len;i++){
            pre_final_str.push(dates[i]+","+ttfbs[i]+","+lt[i]+"\\n");
        }

        for(i=0;i<len-1;i+=2){

            final_str += pre_final_str[i].concat(pre_final_str[i+1]);
        }

        console.log(final_str);
        url = docs.Url


        res.render('index1.jade',{final_str: final_str,url:url});
    });
};




//docs[i].Date,docs[i].TTFB,docs[i].loadTime\n+"-------