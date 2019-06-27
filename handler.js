'use strict';
const AWS = require('aws-sdk');
const s3 = new AWS.S3({region: 'eu-central-1'});


const BUCKET = process.env.BUCKET;
const ROOMS = process.env.ROOMS;


module.exports.air = async (event, context) => {
  let room = ROOMS.split(",");
  let roomdata = [];

  let lowest = Number.POSITIVE_INFINITY;
  let highest = Number.NEGATIVE_INFINITY;
  let tmp,coldroom,warmroom;

  for (let i=0;i<room.length;i++){
    let data = await s3.getObject({
      Bucket: BUCKET,
      Key: room[i]+'.json'
    }).promise();
    roomdata.push(JSON.parse(data.Body.toString()));
  }
  console.log(roomdata);
  for (let i=roomdata.length-1; i>=0; i--) {
    tmp = roomdata[i].temp;
    if (tmp < lowest){
      lowest = tmp;
      coldroom = roomdata[i].room;
    }
    if (tmp > highest){
      highest = tmp;
      warmroom = roomdata[i].room;
    }
  }
  console.log(highest, lowest);
  let obj = {
    coldest: {
      temp: lowest,
      room: coldroom
    },
    warmest: {
      temp: highest,
      room: warmroom
    }
  };



  return {
    statusCode: 200,
    body: obj
    //body: JSON.parse(data.Body.toString())
  };
};

