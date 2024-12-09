async function getApiKey(https://fdnzawlcf6.execute-api.eu-north-1.amazonaws.com/keys){
    try{
        const response = await fetch(https://fdnzawlcf6.execute-api.eu-north-1.amazonaws.com/keys, {
            method: 'POST',
            headers:{
                'Content-Type': 'application/json',
            }
        });
        if(!response.ok){
            throw new Error(HTTP error! Status: ${response.status})
        }

        const data = await response.json();
        console.log('API key:', data)
    }

    catch(error){
        console.error('Error fetching api key', error)
    }
}