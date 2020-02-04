/*
* 2020, Goorumlabs
* By EUNGJU
*/

module.exports = function (app, Tag, Log) {
  //Initial Index page loading
  app.get('', (req,res) => res.send('login',{

  }))
    

  app.post('/api/regTagByUid', function (req, res) {
    var tag = new Tag();
    tag.uid = req.body.uid;
    tag.indexNumber = 0;
    tag.regDate = Date.now();

    tag.save(function (err) {
      if (err) {
        console.error(err);
        res.json({
          statusCode: 1400
        });
        return;
      }

      res.json({
        statusCode: 1200,
        tag
      });

    });
  });

  app.post('/api/getTagByUid', function (req, res) {
    Tag.findOne({ uid: req.body.uid }, function (err, tag) {
      if (err) {
        console.error(err);
        res.json({
          statusCode: 1400
        });

        return;
      }

      if (tag.length === 0) {
        // tag not found
        res.json({
          statusCode: 1401,
        });

        return;
      }

      res.json({
        statusCode: 1200,
        tag
      });
    })
  });

  // GET ALL TAGS
  app.post('/api/getAllTags', function (req, res) {
    Tag.find(function (err, tags) {
      if (err) {
        console.error(err);
        res.json({
          statusCode: 1400
        });
        return;
      }

      res.json({
        statusCode: 1200,
        tags: tags
      });
    })
  });

  // DELETE TAG
  app.post('/api/deleteTagByUid', function (req, res) {
    Tag.deleteOne({ uid: req.body.uid }, function (err, output) {
      if (err) {
        res.json({
          statusCode: 1400
        });

        return;
      }

      res.json({
        statusCode: 1200,
        uid: req.body.uid
      });
    })
  });

  app.post('/api/payByUid', function (req, res) {
    Tag.findOne({ uid: req.body.uid })
      .then((tag) => {
        var totalBalance = tag.balance + tag.point;

        if (totalBalance < req.body.amount) {
          res.json({
            statusCode: 1401,
            tag
          });

          return;
        }

        var newPoint = 0;
        var newBalance = 0;

        if (tag.point >= req.body.amount) {
          newPoint = tag.point - req.body.amount;
          newBalance = tag.balance;
        } else {
          let lackPoint = tag.point - req.body.amount;
          newBalance = tag.balance + lackPoint;
        }

        return Tag.update({ _id: tag._id }, { balance: newBalance, point: newPoint });
      })
      .then((result) => {
        if(!result.ok){
          res.json({
            statusCode: 1403,
          });
        }

        return Tag.findOne({ uid: req.body.uid });
      })
      .then((newTag) => {
        res.json({
          statusCode: 1200,
          newTag
        });
      })
      .catch((err) => {
        res.json({
          statusCode: 1400,
        });
      })
  });

  app.post('/api/depositByUid', function (req, res) {
    Tag.findOne({ uid: req.body.uid })
      .then((tag) => {
        if ((req.body.amount < 0) || (req.body.bonusPoint < 0)) {
          res.json({
            statusCode: 1402,
            tag
          });
        }

        var newPoint = tag.point + req.body.bonusPoint;
        var newBalance = tag.balance + req.body.amount;
        var newTimestamp = Date.now();
        var newIndexNumber = tag.indexNumber + 1;
         
        return Tag.update({ _id: tag._id }, 
          { balance: newBalance, point: newPoint, timestamp: newTimestamp, indexNumber: newIndexNumber });
      })
      .then((result) => {
        if(!result.ok){
          res.json({
            statusCode: 1403,
          });
        }

        return Tag.findOne({ uid: req.body.uid });
      })
      .then((newTag) => { 
        var log = new Log();

        log.method = "depositByUid";
        log.uid = req.body.uid;
        log.amount = req.body.amount;
        log.bonusPoint = req.body.bonusPoint;
        log.payment = req.body.payment;
        log.balance = newTag.balance;
        log.point = newTag.point;
        log.timestamp = newTag.timestamp;
        log.indexNumber = newTag.indexNumber;
        
        log.save(function (err) {
          if (err) {
            console.error(err);
            res.json({
              statusCode: 1404
            });

            return;
          }
        });
  
        res.json({
          statusCode: 1200,
          newTag
        });
      })
      .catch((err) => {
        res.json({
          statusCode: 1400,
        });
      })
  });

}