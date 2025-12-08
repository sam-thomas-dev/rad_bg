"use client";
import { useMemo, useState, Dispatch, SetStateAction, useEffect } from "react";
import dynamic from "next/dynamic";

import { DataApi } from "./data_api";
import { LocationRecord } from "./locationRecord";

// --- React Componenets ---

export default function MainContainer() {

  // site wide state variables
  const [ selectedRecord, setSelectedRecord ] = useState(DataApi.loadingLocationObj);
  const [ filterShown, setFilterShown ] = useState(0);
  const [ infoPannelShown, setInfoPannelShown] = useState(0);
  const [ dkModeOn, setDkModeOn ] = useState(true);
  
  // ran once after initial document load
  useEffect(() => {
    DataApi.requestRecordByIp()
      .then(() => setSelectedRecord(DataApi.apiRequestResult[0]))
      .catch(() => {
        DataApi.requestDefaultRecord()
          .then(() => setSelectedRecord(DataApi.apiRequestResult[0]))
      })
  }, []);

  useEffect(() => {
    setThemeFromUserPref(setDkModeOn);
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

function InfoPannel({ dkModeOn, setDkModeOn, infoPannelShown }:{
    dkModeOn:boolean, 
    setDkModeOn:Dispatch<SetStateAction<boolean>>, 
    infoPannelShown:number
  }
){
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
        <a className="link infoSubHeading" href="https://github.com/sam-thomas-dev/rad_bg">GitHub</a>
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
            onChange={() => {setHtmlDataAtr(!dkModeOn); setDkModeOn(!dkModeOn);}}
          />
          <span className="slider round"></span>
        </label>
      </div>

    </div>
  );
}

function FilterContainer({ setSelectedRecord, filterShown, setFilterShown }:{ 
    setSelectedRecord:Dispatch<SetStateAction<LocationRecord>>, 
    filterShown:number, 
    setFilterShown:Dispatch<SetStateAction<number>>
  }
){
  const [ filterText, setFilterText ] = useState('');
  const [ queryResult, setQueryResult ] = useState(DataApi.apiRequestResult);
  const elementStyle = (filterShown)? {translate: "0px 0px"} : {translate: "-100% 0px"};

  return(
    <div className="filterContainer" style={elementStyle}>
      <FilterLocationBar filterText={filterText} setFilterText={setFilterText} setQueryResult={setQueryResult}/>
      <hr className="divLine"/>
      <ResultGrid setSelectedRecord={setSelectedRecord} setFilterShown={setFilterShown} queryResult={queryResult}/>
    </div>
  );
}

function FilterLocationBar({ filterText, setFilterText, setQueryResult }:{ 
    filterText:string, 
    setFilterText:Dispatch<SetStateAction<string>>, 
    setQueryResult:Dispatch<SetStateAction<LocationRecord[]>>
  }
){
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

function ResultGrid({ setSelectedRecord, setFilterShown, queryResult }:{ 
    setSelectedRecord:Dispatch<SetStateAction<LocationRecord>>, 
    setFilterShown:Dispatch<SetStateAction<number>>, 
    queryResult:LocationRecord[]; 
  }
){  
  return(
    <div className="resultGrid">
      { (queryResult.length > 0)
        ? queryResult.map((item:LocationRecord, index:number) => (
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

function SeachResultItem({ locationObj, setSelectedRecord, setFilterShown }:{ 
    locationObj:LocationRecord, 
    setSelectedRecord:Dispatch<SetStateAction<LocationRecord>>, 
    setFilterShown:Dispatch<SetStateAction<number>>
  }
){
  if(`${locationObj.name} ${locationObj.subNational} ${locationObj.country}`.length > 30){
    return(
      <div className="reusltItemCont" onClick={() => {setSelectedRecord(locationObj); setFilterShown(0)}}>
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
    <div className="reusltItemCont" onClick={() => {setSelectedRecord(locationObj); setFilterShown(0)}}>
      <p className="resultName">{locationObj.name}</p>
      <p className="resultLocation">{locationObj.subNational + ", "+ locationObj.country}</p>
    </div>
  );
}

function BlackOutDiv({ filterShown, setFilterShown, setInfoPannelShown, infoPannelShown}:{ 
    filterShown:number, 
    setFilterShown:Dispatch<SetStateAction<number>>, 
    setInfoPannelShown:Dispatch<SetStateAction<number>>, 
    infoPannelShown:number
  }
){  
  const elemenetStyle = (filterShown || infoPannelShown)? {opacity: "60%", zIndex:"2"} : {opacity: "0%", zIndex:"0"}
  return <div className="blackOutDiv" style={elemenetStyle} onClick={() => {setFilterShown(0); setInfoPannelShown(0);}}/>
}

function MenuBtn({ setFilterShown }:{ setFilterShown:Dispatch<SetStateAction<number>> }){
  return(
    <div className="navFlx1">
      <button className="menuBtn" onClick={() => setFilterShown(1)}/>
    </div>
  );
}

function SearchBarBtn({ setFilterShown }:{ setFilterShown:Dispatch<SetStateAction<number>> }){
  return(
    <div className="navFlx2">
      <input name="input2" type="text" className="searchBarBtn" placeholder="Search" readOnly onClick={() => setFilterShown(1)}/>
    </div>
  );
}

function InfoBtn({ setInfoPannelShown }:{ setInfoPannelShown:Dispatch<SetStateAction<number>> }){
  return(
    <div className="navFlx3">
      <button className="infoBtn" onClick={() => setInfoPannelShown(1)}/> 
    </div>
  );
}

function NavContainer({ setFilterShown, setInfoPannelShown }:{ 
    setFilterShown:Dispatch<SetStateAction<number>>, 
    setInfoPannelShown:Dispatch<SetStateAction<number>>
  }
){ 
  return(
    <nav className="navContainer">
      <MenuBtn setFilterShown={setFilterShown}/>
      <SearchBarBtn setFilterShown={setFilterShown}/>
      <InfoBtn setInfoPannelShown={setInfoPannelShown}/>
    </nav>
  );
}

function BgRadContainer({ selectedRecord }:{ selectedRecord:LocationRecord }){
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

function LocationInfoContainer({ selectedRecord }:{ selectedRecord:LocationRecord }){
  return(
    <div className="locationInfoContainer">
      <div className="locationInfoSubContainer">
        <p className="locationName">{(selectedRecord.name.length > 16) ? `${selectedRecord.name.substring(0, 15)}...` : selectedRecord.name}</p>
        <p className="locationSubNat">{selectedRecord.subNational + ", " + selectedRecord.country}</p>
      </div>
      {CreateMap(selectedRecord.latitude, selectedRecord.longitude)}
    </div>
  );
}

function AnimatedGradient(){
  return <div className="animatedGradient"/>
}

// --- Non-react Functions ---

const CreateMap = (latitude:number, longitude:number) => {
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

  if(!htmlTag){
    console.log("Error: html tag is null")
  } else{
    htmlTag.dataset.dkset = (boolValue).toString();
  }
}

const setThemeFromUserPref = (setDkModeOn:Dispatch<SetStateAction<boolean>>) => {
  const themePref = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  if(!themePref){
    setHtmlDataAtr(themePref);
    setDkModeOn(themePref);
  }
}

