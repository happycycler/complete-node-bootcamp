const fs = require('fs');
const http = require('http');
const url = require('url');
const slugify = require('slugify');

const replaceTemplate = require('./starter/modules/replaceTemplate');

////////////////////
// SERVER
const tempOverview = fs.readFileSync(`${__dirname}/starter/templates/template-overview.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/starter/templates/template-product.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/starter/templates/template-card.html`, 'utf-8');
const data = fs.readFileSync(`${__dirname}/starter/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const slugs = dataObj.map(el => slugify(el.productName, { lower: true }));
console.log(slugs);

const server = http.createServer((req, resp) => {
    const { query, pathname } = url.parse(req.url, true);

    // Overiew page
    if (pathname === '/' || pathname === '/overview') {
        resp.writeHead(200, {
            'Content-type': 'text/html'
        });

        const cardsHtml = dataObj.map(el => {
            return replaceTemplate(tempCard, el)
        });
        const output = tempOverview.replace(/{%PRODUCT_CARDS%}/, cardsHtml);

        resp.end(output);

    // Products page
    } else if (pathname === '/product') {
        resp.writeHead(200, {
            'Content-type': 'text/html'
        });

        const product = dataObj[query.id]
        const output = replaceTemplate(tempProduct, product)

        resp.end(output);

    // API
    } else if (pathname === '/api') {
        resp.writeHead(200, {
            'Content-type': 'application/json'
        });
        resp.end(data);

    // Not found
    } else {
        resp.writeHead(404, {
            'Content-type': 'text/html'
        });
        resp.end('<h1>Page not found!</h1>');
    }
});

server.listen(8000, '127.0.0.1', () => {
    console.log('Listening to requests on port 8000 ...');
});


////////////////////
// FILES
// Blocking, synchronous way
// const textIn = fs.readFileSync('./starter/txt/input.txt', 'utf-8');
// console.log(textIn)

// const textOut = `This is what we know about the avacado: ${textIn}.\nCreated on ${Date.now()}`
// fs.writeFileSync('./starter/txt/output.txt', textOut)
// console.log('File written ...')

// Non-blocking, asynchronous way
// fs.readFile('./starter/txt/start.txt', 'utf-8', (err, data1) => {
//     if (err) return console.log(`ERROR: ${err}`)

//     fs.readFile(`./starter/txt/${data1}.txt`, 'utf-8', (err, data2) => {
//         console.log(data2)
//         fs.readFile(`./starter/txt/append.txt`, 'utf-8', (err, data3) => {
//             console.log(data3)

//             fs.writeFile('./starter/txt/final.txt', `${data2}\n${data3}`, 'utf-8', (err) => {
//                 console.log('Your file has been written 🤪')
//             });
//         });
//     });
// });
// console.log('Will read file!')