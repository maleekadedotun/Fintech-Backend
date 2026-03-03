const getTokenFromHeaders = req =>{
     // get token from headers
    const headerObj = req.headers;
    const token = headerObj.authorization.split(" ")[1];
    // console.log("Token:", token);
    if (token !== undefined) {
        return token;
    }
    else{
        return false;
    }
}

export default getTokenFromHeaders;