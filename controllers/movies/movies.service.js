const https = require("https");
const fetch = require("node-fetch");
const urlVikings = "https://imdb-api.com/en/API/SearchMovie/k_job2e7ku/viking";
const urlFullCastById = "https://imdb-api.com/en/API/FullCast/k_job2e7ku/"
const urlAxes = "https://imdb-api.com/en/API/SearchMovie/k_job2e7ku/axe";
const urlByTitle = "https://imdb-api.com/en/API/Title/k_job2e7ku/";

async function getData(url) {
        try {
            const response = await fetch(url);
            const json = await response.json();
            return json
        } catch (error) {
            console.log(error);
        }
      }

async function getPromises(url ,ids)
{
    return ids.map(( x, i, v ) => {
        return new Promise(( resolve, reject ) => {
            https.get(url + x, (res) => {
                let rawData = '';
                res.on( 'data', (chunk) => { rawData += chunk });
                res.on( 'end', () => {
                    try {
                        const parsedData = JSON.parse(rawData);
                        resolve(parsedData);
                    } catch (e) {
                        console.error(e.message);
                        reject(e.message);
                    }
                })
            }).on('error', (e) => {
                console.error("Got errpr", e.message);
            })
        })
    })
}


async function getVikings() {
    const vikings = await getData(urlVikings)
    return vikings
}

async function getVikingsDirectors() {
    const vikings = await getData(urlVikings)
    const { results } = vikings
    let ids = results.map((x, i, v) => {
        const { id } = x
        return id
    })


    let promises = await getPromises(urlFullCastById ,ids)
    let fullCast = Promise.all(await promises).then( res => res ).catch( e => { console.log("Error on getAllData", e.message)})
    return fullCast.then((x) => { 
        let directors = x.map((y) => {
            const { directors } = y
            let names = directors.items.map((z) => z.name)
            return names
        })
        return directors
    })
}

async function getAxes() {
    const axes = await getData(urlAxes)
    return axes
}

async function getAxesCharacters() {
    const vikings = await getData(urlAxes)
    const { results } = vikings
    let ids = results.map((x, i, v) => {
        const { id } = x
        return id
    })


    let promises = await getPromises(urlFullCastById ,ids)
    let fullCast = Promise.all(await promises).then( res => res ).catch( e => { console.log("Error on getAllData", e.message)})
    return fullCast.then((x) => { 
        let directors = x.map((y) => {
            const { directors } = y
            let names = directors.items.map((z) => z.name)
            return names
        })
        return directors
    })
}


async function getDuration(title) {
    const movies = await getData(title == 'vikings' ? urlVikings : urlAxes)
    const { results } = movies
    let ids = results.map((x, i, v) => {
        const { id } = x
        return id
    })


    let promises = await getPromises(urlByTitle ,ids)
    let titleData = Promise.all(await promises).then( res => res ).catch( e => { console.log("Error on getAllData", e.message)})
    
    return titleData.then((x) => {
        
        let duration = x.map((y) => {
            const { runtimeMins } = y
            return runtimeMins
        })
        
        duration = duration.filter(x => x.length > 0)
        let totalDuration = duration.reduce((p, n) =>  parseInt(p) + parseInt(n))

        return totalDuration
    })

}

module.exports = {
    getVikings,
    getVikingsDirectors,
    getAxes,
    getAxesCharacters,
    getDuration
};
