var express = require('express');
var router = express.Router();
var request = require('request');



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});



router.get('/api/imagesearch/:search', function(req, res, next) {
  var key = process.env.GOOGLE_CUSTOM_SEARCH_KEY;
  var url = 'https://www.googleapis.com/customsearch/v1?cx=000607463372409205852:4qcvgaxseki&q=' +  req.params.search + '&key=' + key;
  //start
  if(req.query.offset){
    url = url + "&start=" + req.query.offset; 
  }
  //console.log(url);
  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var json = JSON.parse(body);
      var finalData = json.items.map(function(item){
        var temp = {};
        temp.snippet = item.snippet;
        temp.context = item.link;
        if(item.pagemap && item.pagemap.cse_image && item.pagemap.cse_image.length > 0){
          temp.url = item.pagemap.cse_image[0].src;
        }
        if(item.pagemap && item.pagemap.cse_thumbnail && item.pagemap.cse_thumbnail.length > 0){
          temp.thumbnail = item.pagemap.cse_thumbnail[0].src;
        }
        return temp;
      });
      res.json(finalData);
    }
  })
  
});




module.exports = router;
