const config = require('./config');

module.exports = class Builder {

    constructor() {
        this.specifiedKeys = new Set();
        this.url = 'https://fakestoreapi.com/products';
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
     * These methods manipulates the request that is being sent.
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
        this.needTotalCount = true;
        return this;
    };


    /**
     * post-processes 
     * These methods manipulate, search or check some criteria on received data.
     */
    hasSuitableRating = () => {
        // i.e. has doc with suitable status
        this.suitableRating = 4.0;
        this.hasSuitableRating = true;
        return this;
    };

    findLastStep = () => {

        return this;
    };


    /**
     * workflow
     * orchestraites the excutation of pre-processes, sending the request, executation of post-processes
     * and finally returning the results with specified fields.
     */
    sendRequest = async () => {
        try {
            const allData = await (await fetch(this.url)).json();

            // any preprocess of fetched data could be done here


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

            return results;
        }
        catch (error) {
            console.log(error);
        }
    };

};