const cors = require('cors');

module.exports = function (app) {
    // let whitelist = ['http://localhost:3000'];
    let whitelist = ['http://localhost:3000', 'http://localhost:3003'];
    // Send standard CORS headers with all origins allowed                                                                                                
    app.use(cors({
                origin: (origin, callback)=>{
                    console.log("HERE IS THE ORIGIN: ", origin);
                    if (whitelist.indexOf(origin) !== -1) {
                        callback(null, true)
                    } else {
                        callback(new Error('Not allowed by CORS'))
                    }
                },credentials: true
            }));
};
