"use client";
import { useState } from "react";
import { DataApi } from "./data_api";
import { LocationRecord } from "./locationRecord";
import { useEffect } from "react";


// --- React Componenets ---

export default function MainContainer() {
  let [ selectedRecord, setSelectedRecord ] = useState(new LocationRecord("-1", "Loading", "unknown", "unknown", 0, ""));
  let [ filterShown, setFilterShown ] = useState(0);

  useEffect(() => {DataApi.requestDefaultRecord().then(() => setSelectedRecord(DataApi.apiRequestResult[0]))}, []);

  return(
    <div className="siteCont">
      <main className="mainContainer">

        <FilterContainer setSelectedRecord={setSelectedRecord} filterShown={filterShown} setFilterShown={setFilterShown}/>
        <BlackOutDiv filterShown={filterShown} setFilterShown={setFilterShown}/>
        
        <NavContainer setFilterShown={setFilterShown}/>
        <LocationInfoContainer selectedRecord={selectedRecord}/>
        <BgRadContainer selectedRecord={selectedRecord}/>

        <AnimatedGradient/>
      </main>
    </div>
  ); 
}

function FilterContainer({ setSelectedRecord, filterShown, setFilterShown }:{[key:string]:any}){
  let [ filterText, setFilterText ] = useState('');
  let elementStyle = (filterShown)? {translate: "0px 0px"} : {translate: "-100% 0px"};

  return(
    <div className="filterContainer" style={elementStyle}>
      <FilterLocationBar filterText={filterText} setFilterText={setFilterText}/>
      <hr className="divLine"/>
      <ResultGrid setSelectedRecord={setSelectedRecord} setFilterShown={setFilterShown}/>
    </div>
  );
}

function FilterLocationBar({ filterText, setFilterText}:{[key:string]:any} ){
  return(
    <div className="filterSearchBarCont">
      <input 
        type="text" 
        className="filterSearchBar" 
        placeholder="Search"
        value={filterText}
        onChange={async (element) => {
          setFilterText(element.target.value);
          if(element.target.value.trim().length > 0){ 
            await DataApi.requestRecordsByFilter(element.target.value); 
          }
        }}
      />
    </div>
  );
}

function ResultGrid({setSelectedRecord, setFilterShown}:{[key:string]:any}){  
  const selectedRecords = DataApi.apiRequestResult;
  
  return(
    <div className="resultGrid">
      { (selectedRecords.length > 0)
        ? selectedRecords.map((item, index) => (
            <SeachResultItem 
              locationObj={item}
              key={index} 
              setSelectedRecord={setSelectedRecord} 
              setFilterShown={setFilterShown}
            />
          ))
        : <p style={{color:"white"}}>No Results</p>
      }
    </div>
  );
}

function SeachResultItem({ locationObj, setSelectedRecord, setFilterShown }:{[key:string]:any} ){
  if(`${locationObj.name} ${locationObj.subNational} ${locationObj.country}`.length > 30){
    return(
      <div className="reusltItemCont" onClick={(element) => {setSelectedRecord(locationObj); setFilterShown(0)}}>
        <p className="resultName">{(locationObj.name.length > 15) ? `${locationObj.name.substring(0, 14)}...` : locationObj.name}</p>
        <p className="resultLocation">{
            ((locationObj.subNational.length > 15) 
              ? `${locationObj.subNational.substring(0, 14)}... ` 
              : locationObj.subNational) 
            + ", "
            + ((locationObj.country.length > 15) 
              ? `${locationObj.country.substring(0, 14)}... ` 
              : locationObj.country)
          }
        </p>
      </div>
    );
  }
  
  return(
    <div className="reusltItemCont" onClick={(element) => {setSelectedRecord(locationObj); setFilterShown(0)}}>
      <p className="resultName">{locationObj.name}</p>
      <p className="resultLocation">{locationObj.subNational + ", "+ locationObj.country}</p>
    </div>
  );
}

function BlackOutDiv({ filterShown, setFilterShown}:{[key:string]:any}){  
  let elemenetStyle = (filterShown)? {opacity: "60%", zIndex:"2"} : {opacity: "0%", zIndex:"0"}
  return <div className="blackOutDiv" style={elemenetStyle} onClick={element => setFilterShown(0)}/>
}

function MenuBtn({ setFilterShown }:{[key:string]:any}){
  return(
    <div className="navFlx1">
      <button className="menuBtn" onClick={e => setFilterShown(1)}/>
    </div>
  );
}

function SearchBarBtn({ setFilterShown }:{[key:string]:any}){
  return(
    <div className="navFlx2">
      <input type="text" className="searchBarBtn" placeholder="Search" readOnly onClick={e => setFilterShown(1)}/>
    </div>
  );
}

function InfoBtn(){
  return(
    <div className="navFlx3">
      <button className="infoBtn"/> 
    </div>
  );
}

function NavContainer({ setFilterShown }:{[key:string]:any}){ 
  return(
    <nav className="navContainer">
      <MenuBtn setFilterShown={setFilterShown}/>
      <SearchBarBtn setFilterShown={setFilterShown}/>
      <InfoBtn/>
    </nav>
  );
}

function BgRadContainer({ selectedRecord }:{[key:string]:any} ){

  return (
    <div className="bgRadContainer">
      <div className="bgRadSubContainer">
        <p className="radContTitle">Background radiation (avg):</p>
        <div className="radFigCont">
          <p className="radFig">{selectedRecord.bgRad}</p>
          <p className="radUnit">{selectedRecord.radUnit}</p>
        </div>
      </div>
    </div>
  );
}

// function MapLeaflet(){
//   return <div id="map"></div>
// }

function LocationInfoContainer({ selectedRecord }:{[key:string]:any} ){

  return(
    <div className="locationInfoContainer">
      <div className="locationInfoSubContainer">
        <p className="locationName">{(selectedRecord.name.length > 16) ? `${selectedRecord.name.substring(0, 15)}...` : selectedRecord.name}</p>
        <p className="locationSubNat">{selectedRecord.subNational + ", " + selectedRecord.country}</p>
      </div>
      {/* <MapLeaflet/> */}
    </div>
  );
}

function AnimatedGradient(){
  return <div className="animatedGradient"/>
}
