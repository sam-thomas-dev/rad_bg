class DbRecord{
  constructor(_id, name, country, subNational , radFig, radUnit, latitude, longitude){
    this._id = _id;
    this.name = name;
    this.country = country;
    this.subNational = subNational; 
    this.radFig = radFig;
    this.radUnit = radUnit;
    this.latitude = latitude;
    this.longitude = longitude;
  }
}

module.exports = DbRecord;