import { LocationRecord } from "./locationRecord";

export class DataApi{
  private constructor(){
    console.log('This class is non-instantiable.')
  }

  static apiRequestResult = new Array();

  private static url = "http://192.168.1.109:8000/radData/";
  private static defaultID = '692108cc3ddc29e8f6004b54';
  
  private static byIdEndpoint = "get/byID/";
  private static byFilterEndpoint = "get/byFilter/";

  /**
   * Performs fetch request for resource specified
   * @param url 
   * @param endpoint 
   * @param parameter
   * @returns json response as object
   */
  private static apiFetch = async (url:string, endpoint:string, parameters:string) => {
    try{
      const resp = await fetch(`${url}${endpoint}${parameters}`);
      
      if(!resp.ok){
        throw new Error(`Response status: ${resp.status}`)
      }

      return resp.json();

    } catch(error){
      console.log("API Fetch error has occured.");
    }
  }

  static requestRecordById = async (id:string) => {
    const result = await this.apiFetch(this.url, this.byIdEndpoint, id);
    
    if(result === undefined){
      this.apiRequestResult = [new LocationRecord("-1", "Error", "not found", "record", 0, "")];
    } else{
      this.apiRequestResult = (result.hasOwnProperty("id")) 
        ? [result] 
        : [new LocationRecord("-1", "Error", "not found", "record", 0, "")]
      ;
    }
  }

  static requestDefaultRecord = async () => {
    await this.requestRecordById(this.defaultID);
  }

  static requestRecordsByFilter = async (filter:string) => {
    const result = await this.apiFetch(this.url, this.byFilterEndpoint, filter);
    
    if(result === undefined){
      this.apiRequestResult = new Array();
    } else {
      this.apiRequestResult = (result.hasOwnProperty("selectedLocations")) 
        ? result.selectedLocations 
        : new Array()
      ;
    }
  }
}