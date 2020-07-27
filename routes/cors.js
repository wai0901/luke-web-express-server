const cors = require('cors');

const whitelist = ['http://localhost:4000', 
                    'https://localhost:3000', 
                    'https://localhost:3001', 
                    'http://localhost:3001', 
                    'https://localhost:3443',
                    'https://lukeexpress.com',
                    'https://www.lukeexpress.com',
                    'lukeexpress.com',
                    'www.lukeexpress.com',
                    'https://lukeexpress-server.herokuapp.com',
                    'lukeexpress-server.herokuapp.com',
                ];
const corsOptionsDelegate = (req, callback) => {
    let corsOptions;
    console.log(req.header('Origin'));
    if(whitelist.indexOf(req.header('Origin')) !== -1) {
        corsOptions = { origin: true };
    } else {
        corsOptions = { origin: false };
    }
    callback(null, corsOptions);
};

exports.cors = cors();
exports.corsWithOptions = cors(corsOptionsDelegate);