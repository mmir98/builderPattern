const Builder = require('./builder');
const builder = new Builder();

// fetch('https://fakestoreapi.com/products')
//             .then(res=>res.json())
//             .then(json=>console.log(json))


builder.id()
    .category()
    .title()
    .desc()
    .price()
    .rating()
    .filter(4)
    .sendRequest()
    .then(result => {
        console.log(result);
    })
    .catch(error => {
        console.log(error);
    });

