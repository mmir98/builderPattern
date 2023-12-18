const config = require('./config');

module.exports = class Builder {

    constructor() {
        this.specifiedKeys = new Set();
        this.url = 'https://fakestoreapi.com/products';
        this.result = {};
        this.prePromises = [];
        this.postProcesses = [];
    }


    /**
     * fields
     * Determine the fields that should be returned when sendRequest resolved.
     */
    id = () => {
        this.specifiedKeys.add(config.id);
        return this;
    };

    title = () => {
        this.specifiedKeys.add(config.title);
        return this;
    };

    price = () => {
        this.specifiedKeys.add(config.price);
        return this;
    };

    desc = () => {
        this.specifiedKeys.add(config.description);
        return this;
    };

    category = () => {
        this.specifiedKeys.add(config.category);
        return this;
    };

    image = () => {
        this.specifiedKeys.add(config.image);
        return this;
    };

    rating = () => {
        this.specifiedKeys.add(config.rating);
        return this;
    };


    /**
     * pre-processes 
     * These methods manipulates the request that is being sent, or send other concurrent requests.
     */
    filter = (id) => {
        // could be any other filters that could be applied on the API
        // i.e. the tags, options, searchToken, pagination
        this.url += `/${id}`;
        return this;
    };

    totalCount = () => {
        // could set the onlyGetCount in options, 
        // along with searchToken and tags if specific data is being looked for 
        this.prePromises.push(this.#getTotalCount());
        return this;
    };


    /**
     * post-processes 
     * These methods manipulate, search or check some criteria on received data.
     */
    hasSuitableRating = () => {
        // i.e. has doc with suitable status
        this.suitableRating = 4.0;
        this.postProcesses.push(this.#hasSuitableRating);
        return this;
    };

    findLastStep = () => {

        return this;
    };


    /**
     * orchestraites the excutation of pre-processes, sending the request, executation of post-processes
     * and finally returning the results with specified fields.
     */
    sendRequest = async () => {
        try {
            // any preprocess of fetched data could be done here
            await Promise.all(this.prePromises);
            
            const allData = await (await fetch(this.url)).json();

            for (const func of this.postProcesses) {
                func.call(this, allData);
            }

            // preparing results with specified keys
            if (this.specifiedKeys.length == 0) {
                return allData;
            }
            // const results = [];
            // for (const data of allData) {
            //     const result = {};
            //     for (const key of this.resultKeys) {
            //         result[key] = data[key];
            //     }
            //     results.push(result);
            // }

            let results;
            if (Array.isArray(allData)) {
                results = allData.map(data => {
                    const result = {};
                    for (const key of this.specifiedKeys) {
                        result[key] = data[key];
                    }

                    return result;
                });
            }
            else {
                results = {};
                for (const key of this.specifiedKeys) {
                    results[key] = allData[key];
                }
            }
            this.result.results = results;

            return this.result;
        }
        catch (error) {
            console.log(error);
        }
    };

    #getTotalCount = async () => {
        const data = await (await fetch('https://fakestoreapi.com/products')).json();
        this.result.count = data.length;
        
    };

    #hasSuitableRating = (data) => {
        let hasSuitableRating = false;
        if (Array.isArray(data)) {
            const filteredData = data.find(value => {
                return value.rating.rate >= this.suitableRating;
            });

            if (filteredData) {
                hasSuitableRating = true;
            }
        }
        else if (data?.rating?.rate >= this.suitableRating) {
            hasSuitableRating = true;
        }

        this.result.hasSuitableRating = hasSuitableRating;
    };

};