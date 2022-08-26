export const serverConnection = async (url, method = 'GET', body = null, headers = {}) => {
    if (body) {
        body = JSON.stringify(body);
        headers['Content-Type'] = 'application/json';
    }
    
    const response = await fetch(url, {method, body, headers}); 

    const result = response.ok;
    const data = await response.json();
    
    return {
        result,
        data
    }
}