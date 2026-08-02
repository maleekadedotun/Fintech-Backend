// /**
//  * Converts provider responses into a flat array.
//  *
//  * Supports:
//  * 1. Arrays
//  * 2. Nested arrays
//  * 3. Objects
//  * 4. Nested objects
//  *
//  * @param {*} data
//  * @returns {Array}
//  */
// const normalizeProviderResponse = (data) => {
//     if (!data) return [];

//     // Already an array
//     if (Array.isArray(data)) {
//         return data.flat(Infinity);
//     }

//     // Object
//     if (typeof data === "object") {
//         return Object.values(data).flat(Infinity);
//     }

//     return [];
// };

// export default normalizeProviderResponse;

const normalizeProviderResponse = (response) => {

    if (!response) return [];

    const data = response.data ?? response;

    if (Array.isArray(data)) {
        return data.flat(Infinity);
    }

    if (typeof data === "object") {
        return Object.values(data).flat(Infinity);
    }

    return [];
};

export default normalizeProviderResponse;