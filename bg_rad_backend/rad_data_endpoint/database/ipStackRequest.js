// loads environment variables from spcified location
const { loadEnvFile } = require('node:process');
loadEnvFile('./bg_rad_backend/keys.env');

class ipStackApi{
    constructor(){
        throw new Error("ipStackApi class can not be instantiated");
    }

    static #ipStackApiUrl = `http://api.ipstack.com/`;
    static #apiKey = `?access_key=${process.env.IPSTACK_APIKEY}`;
    static #errorObj = {latitude:0, longitude:0, country_name:"error"};
    static errorArray = [this.#errorObj.latitude, this.#errorObj.longitude, this.#errorObj.country_name];

    /**
     * Sends fetch request to IpStack API, retrives city latitude, longitude, and city name of user based on ip address 
     * @param {string} ip ip address of user
     * @returns {[latitude:number, longitude:number, city_name:string]} array containing details listed above, in above order
     */
    static fetchUserLocation = async (ip) => {
        try{
            const resp = await fetch(`${this.#ipStackApiUrl}${ip}${this.#apiKey}`) ?? {ok: false};
            if(!resp || !resp.ok){
                return this.errorArray;
            }

            const data = await resp.json() ?? this.#errorObj;
            if(!data){
                return this.errorArray;
            } else{
                return [data.latitude, data.longitude, data.country_name];
            }

        } catch(error){
            console.log("API Fetch error has occured.");
        }
    }

    /**
     * Calculates difference between two coordinates provided
     * @param {[latitude:number, longitude:number]} latlng1 first set of coordinates  
     * @param {[latitude:number, longitude:number]} latlng2 second set of coordinates
     * @returns {number} total difference between coordinate pairs provided
     */
    static getTotalCoordDif = async (latlng1, latlng2) => {
        const latDif = Math.abs((Math.abs(latlng1[0]) - Math.abs(latlng2[0])));
        const lngDif = Math.abs((Math.abs(latlng1[1]) - Math.abs(latlng2[1])));
        return latDif + lngDif;
    }
}

module.exports = ipStackApi;