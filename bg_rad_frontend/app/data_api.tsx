import { LocationRecord } from "./locationRecord";
import { UserIp } from "./user_ip";

export class DataApi{
  private constructor(){
    console.log('This class is non-instantiable.')
  }

  private static defLat = -25.034912926102326;
  private static deflong = 134.27791178447652;

  private static url = "http://192.168.1.201:8000/radData/";
  private static defaultID = '692108cc3ddc29e8f6004b54';
  
  private static byIdEndpoint = "get/byID/";
  private static byFilterEndpoint = "get/byFilter/";
  private static byIpEndpoint = "get/byIP/";

  private static errorLocationObj = new LocationRecord("-1", "Error", "not found", "record", 0, "", this.defLat, this.deflong);
  static loadingLocationObj = new LocationRecord("-1", "Loading", "unknown", "unknown", 0, "", this.defLat, this.deflong);

  static apiRequestResult = new Array<LocationRecord>;

  /**
   * Performs fetch request for resource specified
   * @param url 
   * @param endpoint 
   * @param parameter
   * @returns json response as object
   */
  private static apiFetch = async (url:string, endpoint:string, parameters:string) => {
    try{
      const resp = await fetch(`${url}${endpoint}${parameters}`) ?? {ok: false};
      
      if(!resp || !resp.ok){
        return this.errorLocationObj;
      } else{
        return resp.json();
      }

    } catch(error){
      console.log(error);
    }
  }

  static requestRecordById = async (id:string) => {
    try{
      const result = await this.apiFetch(this.url, this.byIdEndpoint, id) ?? this.errorLocationObj;
    
      if(!result){
        this.apiRequestResult = [this.errorLocationObj];
      } else{
        this.apiRequestResult = [result];
      }

    } catch(error){
      console.log(error);
    }
  }

  static requestRecordByIp = async () => {
    try{
      const ip = await UserIp.fetchUserIp() ?? "0";
      if(!ip || ip == "0"){
        this.apiRequestResult = [this.errorLocationObj];
        return;
      }

      const result = await this.apiFetch(this.url, this.byIpEndpoint, ip) ?? this.errorLocationObj;
      if(!result || result.id == "-1"){
        await this.requestDefaultRecord();
      } else{
        this.apiRequestResult = [result];
      }

    } catch(error){
      console.log(error);
    }
  }

  static requestDefaultRecord = async () => {
    try{
      await this.requestRecordById(this.defaultID);
    } catch(error){
      console.log(error);
    }
  }

  static requestRecordsByFilter = async (filter:string) => {
    try{
      const result = await this.apiFetch(this.url, this.byFilterEndpoint, filter) ?? {selectedLocations: []};
      if(!result){
        this.apiRequestResult = [];
      } else{
        this.apiRequestResult = result.selectedLocations; 
      }
      
    } catch(error){
      console.log(error);
    }
  }
}

 