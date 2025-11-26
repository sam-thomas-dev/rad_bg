"use client";
import { useMemo, useState } from "react";
import { DataApi } from "./data_api";
import { useEffect } from "react";
import dynamic from "next/dynamic";

// --- React Componenets ---

export default function MainContainer() {

  // site wide state variables
  let [ selectedRecord, setSelectedRecord ] = useState(DataApi.loadingLocationObj);
  let [ filterShown, setFilterShown ] = useState(0);
  let [ infoPannelShown, setInfoPannelShown] = useState(0);
  let [ dkModeOn, setDkModeOn ] = useState(true);
  
  // ran once after initial document load
  useEffect(() => {
    DataApi.requestRecordByIp()
      .then(() => setSelectedRecord(DataApi.apiRequestResult[0]))
      .catch(err => {
        DataApi.requestDefaultRecord()
          .then(() => setSelectedRecord(DataApi.apiRequestResult[0]))
      })
  }, []);

  useEffect(() => {
    const themePref = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    setHtmlDataAtr(themePref);
    setDkModeOn(themePref);
  }, []);

  // main content of site
  return(
    <div className="siteCont">
      <main className="mainContainer">

        <FilterContainer setSelectedRecord={setSelectedRecord} filterShown={filterShown} setFilterShown={setFilterShown}/>
        <BlackOutDiv filterShown={filterShown} setFilterShown={setFilterShown} setInfoPannelShown={setInfoPannelShown} infoPannelShown={infoPannelShown}/>

        <InfoPannel dkModeOn={dkModeOn} setDkModeOn={setDkModeOn} infoPannelShown={infoPannelShown}/>
        
        <NavContainer setFilterShown={setFilterShown} setInfoPannelShown={setInfoPannelShown}/>
        <LocationInfoContainer selectedRecord={selectedRecord}/>
        <BgRadContainer selectedRecord={selectedRecord}/>

        <AnimatedGradient/>
      </main>
    </div>
  ); 
}

function InfoPannel({ dkModeOn, setDkModeOn, infoPannelShown }:{[key:string]:any}){
  const elementStyle = (infoPannelShown) ? {} : {display: 'none'}; 
  
  return(
    <div className="infoCont infoHidden" id="infoPannel" style={elementStyle}>

      <div>
        <p className="infoHeading">More information</p>
        <p>
          Figures provided are for terrestrial radiation due to ground composition only, 
          figure provided is average annual dose due to factors specified in sieverts.
          The 15 most populous cities with a population over 300,000 have been included in the dataset, 
          only cities that meet the above criteria and are in the countries listed below are contained in the dataset.
        </p>
      </div>

      <div>
        <p className="infoSubHeading">Countries:</p>
        <p>
          Australia, United Kingdom, Ireland, Portugal, Spain, France, Italy, Austria, 
          Germany, Belgium, Netherlands, Denmark, Norway, Sweden, Finland, Greece, Switzerland
        </p>
      </div>

      <div>
        <p className="infoSubHeading">Github:</p>
        <ul>
          <li><a className="link" href="https://github.com/sam-thomas-dev/rad_bg">Repository for frontend & backend of site</a></li>
        </ul>
      </div>
      
      <div>
        <p className="infoSubHeading">Resources:</p>
        <ul>
          <li><a className="link" href="https://www.irpa.net/members/54825/%7B3466DBA7-F7D6-43B5-B89A-655EADEBB73B%7D/European%20Atlas%20of%20Natural%20Radiation%20Flyer.pdf">Resource for European figures</a></li>
          <li><a className="link" href="https://arpsconference.com.au/2014/wp-content/uploads/2013/11/1200-Muston-Scott.pdf">Resource for Australian figures</a></li>
        </ul>
      </div>
      
      <hr/>

      <div className="dkModeTogleCont">
        <p className="infoSubHeading">Darkmode:</p>
        <label className="switch">
          <input 
            type="checkbox"
            name="input3"
            checked={dkModeOn} 
            onChange={elmt => {setHtmlDataAtr(!dkModeOn); setDkModeOn(!dkModeOn);}}
          />
          <span className="slider round"></span>
        </label>
      </div>

    </div>
  );
}

function FilterContainer({ setSelectedRecord, filterShown, setFilterShown }:{[key:string]:any}){
  let [ filterText, setFilterText ] = useState('');
  let [ queryResult, setQueryResult ] = useState(DataApi.apiRequestResult);
  let elementStyle = (filterShown)? {translate: "0px 0px"} : {translate: "-100% 0px"};

  return(
    <div className="filterContainer" style={elementStyle}>
      <FilterLocationBar filterText={filterText} setFilterText={setFilterText} setQueryResult={setQueryResult}/>
      <hr className="divLine"/>
      <ResultGrid setSelectedRecord={setSelectedRecord} setFilterShown={setFilterShown} queryResult={queryResult}/>
    </div>
  );
}

function FilterLocationBar({ filterText, setFilterText, setQueryResult }:{[key:string]:any} ){
  return(
    <div className="filterSearchBarCont">
      <input 
        type="text" 
        className="filterSearchBar"
        name="input1"
        placeholder="Search"
        value={filterText}
        onChange={async (element) => {
          setFilterText(element.target.value);
          if(element.target.value.trim().length > 0){ 
            DataApi.requestRecordsByFilter(element.target.value)
              .then(() => setQueryResult(DataApi.apiRequestResult))
            ; 
          }
        }}
      />
    </div>
  );
}

function ResultGrid({ setSelectedRecord, setFilterShown, queryResult }:{[key:string]:any}){  
  return(
    <div className="resultGrid">
      { (queryResult.length > 0)
        ? queryResult.map((item:object, index:number) => (
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

function BlackOutDiv({ filterShown, setFilterShown, setInfoPannelShown, infoPannelShown}:{[key:string]:any}){  
  let elemenetStyle = (filterShown || infoPannelShown)? {opacity: "60%", zIndex:"2"} : {opacity: "0%", zIndex:"0"}
  return <div className="blackOutDiv" style={elemenetStyle} onClick={element => {setFilterShown(0); setInfoPannelShown(0);}}/>
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
      <input name="input2" type="text" className="searchBarBtn" placeholder="Search" readOnly onClick={e => setFilterShown(1)}/>
    </div>
  );
}

function InfoBtn({setInfoPannelShown}:{[key:string]:any}){
  return(
    <div className="navFlx3">
      <button className="infoBtn" onClick={e => setInfoPannelShown(1)}/> 
    </div>
  );
}

function NavContainer({ setFilterShown, setInfoPannelShown }:{[key:string]:any}){ 
  return(
    <nav className="navContainer">
      <MenuBtn setFilterShown={setFilterShown}/>
      <SearchBarBtn setFilterShown={setFilterShown}/>
      <InfoBtn setInfoPannelShown={setInfoPannelShown}/>
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
        <div className="scaleCont">
          <p className="scaleLabel">😊</p>
          <input 
            type="range" 
            id="input4" 
            className="radScale" 
            defaultValue={selectedRecord.bgRad}
            max={100000}
            disabled
          />
          <p className="scaleLabel">💀</p>
        </div>
      </div>
    </div>
  );
}

function LocationInfoContainer({ selectedRecord }:{[key:string]:any} ){
  return(
    <div className="locationInfoContainer">
      <div className="locationInfoSubContainer">
        <p className="locationName">{(selectedRecord.name.length > 16) ? `${selectedRecord.name.substring(0, 15)}...` : selectedRecord.name}</p>
        <p className="locationSubNat">{selectedRecord.subNational + ", " + selectedRecord.country}</p>
      </div>
      {createMap(selectedRecord.latitude, selectedRecord.longitude)}
    </div>
  );
}

function AnimatedGradient(){
  return <div className="animatedGradient"/>
}

// --- Non-react Functions ---

const createMap = (latitude:number, longitude:number) => {
    const MapLeaflet = useMemo(() => dynamic(
      () => import('./map_script'),
      { 
        loading: () => <div className="mapLoading">map loading...</div>,
        ssr: false
      }
    ), [])

    return <MapLeaflet pos={[latitude, longitude]} scale={12}/>;
  }

const setHtmlDataAtr = (boolValue:boolean) => {
  const htmlTag = document.getElementById("htmlTag");

  if(htmlTag != null){
    htmlTag.dataset.dkset = (boolValue).toString();
  } else{
    console.log("Error: html tag is null")
  }
}

