let fs = require('fs');

module.exports = function (app, trackPathsPromise) {
    app.get('/api/v1/play/:trackID', async function (req, res) {
        let trackPaths = await trackPathsPromise;
        console.log("Got a get request");
        // console.log("Track Paths: ", trackPaths);

        let trackID = req.params.trackID;

        console.log("Here is the trackID ", trackID);
        let filePath = trackPaths[trackID];
        console.log("Here is the trackPath ", filePath);

        let directory = '../cosmic-ripples-koa-api/media_library/';
        let audioFile = directory + filePath;

        let stat = fs.statSync(audioFile); // used to get the size of the file in stat.size
        console.log(stat);
        let range = req.headers.range; // this is undefined when a new song request first comes in
        let readStream;


        console.log("Here is the size of the file: ", stat.size);
        console.log("Here is the requested range for the file: ", req.headers.range);

        if (range !== undefined) {
            /* An audio file already being read has a new request,
            so far I have seen this occur when you jump ahead in the song,
            further then the amount of data that has been loaded in the
            browser, and also to start playing the song
            */

            console.log("This request is NOT undefined");



            /* create start, end and content_length */

            let parts = range.replace(/bytes=/, "").split("-");
            let start_string = parts[0];
            let end_string = parts[1];

            // check that the browser/user has requested a valid point in the audioFile
            if ((isNaN(start_string) && start_string.length > 1) || (isNaN(end_string) && end_string.length > 1)) {
                return res.sendStatus(500); //ERR_INCOMPLETE_CHUNKED_ENCODING
            }

            let start = parseInt(start_string, 10); //turns the string into a base 10 int
            let end = end_string ? parseInt(end_string, 10) : stat.size - 1;
            let content_length = (end - start) + 1;




            /* create the result and readStream */

            // 206 Partial Content success status
            res.status(206).header({
                'Content-Type': 'audio/mp3',
                'Content-Length': content_length,
                'Content-Range': "bytes " + start + "-" + end + "/" + stat.size
            });

            readStream = fs.createReadStream(audioFile, { start: start, end: end });
        } else {

            /* This runs when a new audioFile has been requested */
            // This seems to be for first starting the request
            console.log("This request IS undefined");

            res.header({
                'Content-Type': 'audio/mp3',
                'Content-Length': stat.size
            });
            readStream = fs.createReadStream(audioFile);
        }


        // I believe this is asynchronous, so I think this continually sends info
        // to the server?
        console.log("starting the piping");
        readStream.pipe(res);
        console.log("pipe has been called\n");
    });
}












// Backup:

// app.get('/api/v1/play/:key', async function (req, res) {
//         let trackPaths = await trackPathsPromise;
//         console.log("Got a get request");
//         console.log("Track Paths: ", trackPaths);

//         let key = req.params.key;

//         console.log("Here is the key ", key);

//         // let directory = 'C:/Users/McKay_000/Music/My_Music/pilotredsun/Achievement/';
//         let directory = './audio_files/';
//         let audioFile = directory + key;

//         let stat = fs.statSync(audioFile); // used to get the size of the file in stat.size
//         console.log(stat);
//         let range = req.headers.range; // this is undefined when a new song request first comes in
//         let readStream;


//         console.log("Here is the size of the file: ", stat.size);
//         console.log("Here is the requested range for the file: ", req.headers.range);

//         if (range !== undefined) {
//             /* An audio file already being read has a new request,
//             so far I have seen this occur when you jump ahead in the song,
//             further then the amount of data that has been loaded in the
//             browser, and also to start playing the song
//             */

//             console.log("This request is NOT undefined");



//             /* create start, end and content_length */

//             let parts = range.replace(/bytes=/, "").split("-");
//             let start_string = parts[0];
//             let end_string = parts[1];

//             // check that the browser/user has requested a valid point in the audioFile
//             if ((isNaN(start_string) && start_string.length > 1) || (isNaN(end_string) && end_string.length > 1)) {
//                 return res.sendStatus(500); //ERR_INCOMPLETE_CHUNKED_ENCODING
//             }

//             let start = parseInt(start_string, 10); //turns the string into a base 10 int
//             let end = end_string ? parseInt(end_string, 10) : stat.size - 1;
//             let content_length = (end - start) + 1;




//             /* create the result and readStream */

//             // 206 Partial Content success status
//             res.status(206).header({
//                 'Content-Type': 'audio/mp3',
//                 'Content-Length': content_length,
//                 'Content-Range': "bytes " + start + "-" + end + "/" + stat.size
//             });

//             readStream = fs.createReadStream(audioFile, { start: start, end: end });
//         } else {

//             /* This runs when a new audioFile has been requested */
//             // This seems to be for first starting the request
//             console.log("This request IS undefined");

//             res.header({
//                 'Content-Type': 'audio/mp3',
//                 'Content-Length': stat.size
//             });
//             readStream = fs.createReadStream(audioFile);
//         }


//         // I believe this is asynchronous, so I think this continually sends info
//         // to the server?
//         console.log("starting the piping");
//         readStream.pipe(res);
//         console.log("pipe has been called\n");
//     });
