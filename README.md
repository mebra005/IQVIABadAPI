
# IQVIA Bad API  | [![npm](https://img.shields.io/badge/npm-v5.5.1-blue.svg?style=flat-square)](https://www.npmjs.com/package/npm) ![GitHub last commit](https://img.shields.io/github/last-commit/mebra005/IQVIABadAPI.svg?style=flat-square) ![GitHub language count](https://img.shields.io/github/languages/count/mebra005/iqviabadapi.svg?style=flat-square) ![GitHub repo size](https://img.shields.io/github/repo-size/mebra005/iqviabadapi.svg?style=flat-square) [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://github.com/your/your-project/blob/master/LICENSE)


 This simple console application will query an API to retrieve data (Tweets) between range of two dates and output the result with no duplicates* into a file.
 
 >*Duplicates: tweets with similar ID

 ![alt text](https://i.ibb.co/T0tWZjx/Capture.png)


 There are some complications with the API (https://badapi.iqvia.io/swagger/):
 * The API only lets you search for tweets with timestamps falling in a window specified by `startDate`
and `endDate`.
* The API can only return 100 results in a single response, even if there are more than 100 tweets in the
specified window.
* There is no indication that there are more results and there are no pagination parameters returned.
* There can be no duplicate entries in the results you return.
 

The API returns a maximum of 100 result in a single response, this means if the response includes anything less than 100 results, it already has return all the results, therefor I used this fact to keep sending request to the API while the results are equal to 100.

```
ex. API has 342 tweets between two dates
request 1   -   returns 100
request 2   -   returns 100
request 3   -   returns 100
request 4   -   returns 42  
```

Each time I modify the start date based on the last tweet's date received on the previous response since the returned tweets are in ascending date and time order.
The date or stamp has this format:

last tweet's date:  2016-01-14T05:18:02.3479425+00:00

newStartDate :   2016-01-14T05:18:02.9999

Application will remove anything after seconds (3479425+00:00) and append (.9999), this way there wont be any duplicate caused by having same dates.

Duplicate check:
I checked all IDs, dates(stamps),  which was received between two dates (2016-1-1  - 2017-12-31) to see if there is any duplicates. in order for me to check duplicate, I add all the IDs to a "Set", (The Set object lets you store unique values of any type) which the size(11693) of my set (IDs) was equal to size(11693) of the results I got from the API, which mean there were no duplicates. I did the samething with dates and got the same result.

The same test was done on texts, and out of 11693 texts, there were only 3512 unique texts. But since the duplicate in this assignment means tweets with similar ID, I igonred this founding. 

  ![alt text](https://i.ibb.co/7YRsGNK/Capture2.png)
  
  ![alt text](https://i.ibb.co/KKFtnpz/Capture3.png)

### Prerequisites

 [Node.js](https://nodejs.org/en/download/ "Download Node.js")


### How to run

```
$ git clone https://github.com/mebra005/IQVIABadAPI.git
$ cd IQVIABadAPI/server
$ npm install
$ node app.js
```

### How to run with docker

```
$ git clone https://github.com/mebra005/IQVIABadAPI.git
$ cd IQVIABadAPI/server
$ docker build -t iqviaapp .
$ docker run -p 3000:3000 iqviaapp
```

### Authors

* **Milad Ebrahimi** 


### License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Directory Structure


    /IQVABadAPI
         README.md
         LICENSE
         Dockerfile
        .dockerignore
        .gitignore
        /server               
            /node_modules
            app.js
            package.json
            package-lock.json
            tweets.txt

