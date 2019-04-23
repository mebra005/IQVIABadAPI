const express = require('express')
const axios = require('axios');
const fs = require('fs');
const app = express()
const port = 3000



const baseURL = "https://badapi.iqvia.io/api/v1/Tweets";
const startDate = "2016-01-01T00:00:00.001Z";
const endDate = "2017-12-31T23:59:59.999Z";

var allTweets = [];
var uniqueTweets = new Set([]);
var tweetCounts = 0;
var uniqueTweetCount = 0;
var duplicateTweets = 0;

var URL = `${baseURL}?startDate=${startDate}&endDate=${endDate}`;

//Sends request to receive tweets between two dates
async function getTweets() {
  try {

    //Sending request to API
    var response = await axios.get(URL);

    //Adding the first 100 tweets to array in first response
    allTweets = allTweets.concat(response.data);

    //if the first response has 100 tweets then continue
    if (response.data.length == 100) {

      //Sending new request to API with the new startdate
      //while the response has length of equal to 100
      do {

        //new start date is equal to the last tweet's date 
        //on the previuse response and replacing the current miliseconds to 9999
        //to avoid duplicate 
        var nextStartDate = response.data[response.data.length - 1].stamp;
        nextStartDate = nextStartDate.substring(0, nextStartDate.indexOf('.')) + ".9999";

        //modifying the url with the newStartDate
        var nextURL = `${baseURL}?startDate=${nextStartDate}&endDate=${endDate}`;
        
        //Sending the modified request to API to get the next portion of tweets 
        response = await axios.get(nextURL);

        //adding the tweets(result) to array
        allTweets = allTweets.concat(response.data);

      } while (response.data.length == 100);
    }


    //Test to see if there is any duplicate in the result
    //Duplicate means any tweets with the same ID
    //I'm adding id from allTweets array to uniqueTweets Set to eliminate any duplicate id
    allTweets.forEach(function (tweet, i) {
      uniqueTweets.add(tweet.id)
    });

    //Tweet counts
    tweetCounts = allTweets.length;
    uniqueTweetCount = uniqueTweets.size;
    duplicateTweets = tweetCounts - uniqueTweetCount;

    console.log("Unique tweets: " + tweetCounts);
    console.log("Duplicate tweets: " + duplicateTweets);
    console.log("The result was saved in a text file in program's directory (IQVIABadAPI/server/tweets.txt)");


    //Save the results back to file
    var file = fs.createWriteStream('tweets.txt');
    file.on('error', function (err) { console.log(err) });
    file.write(`Unique Tweets: ${tweetCounts}\r\nDuplicate tweets: ${duplicateTweets}` + '\r\n\r\n')
    allTweets.forEach(function (t) { file.write(`id: ${t.id}\r\ntext: ${t.text}\r\nstamp: ${t.stamp}\r\n` + '\r\n'); });
    file.end();


  } catch (error) {
    console.error(error);
  }
}

//run the function
getTweets()

console.log("Getting tweets from API...(it will take few seconds)");

app.get("/", getTweets)

