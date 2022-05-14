import React from "react";
import ReactDOM from "react-dom";
import { csv, json, min, median, max, scaleLinear, interpolateGnBu, interpolateOrRd, selectAll } from "d3";
import * as topojson from "topojson-client";
import "./styles.css";
import GeoMap from "./geomap";
import MapTooltip from "./maptooltip";
import Legend from "./legend" 
import LineChart from "./line";
import LineTooltip from "./linetooltip";
import BarChart from "./bar";
import BarTooltip from "./bartooltip";
import Logo from "/pics/Olympic_rings_without_rims.svg.png";

const csvUrl = 'https://gist.githubusercontent.com/HaoxuanSUN/8e3b7efd9834320128bf3aca11969473/raw/578f14b1ab1c3e781d1a5caa2f2118720a586e0d/OlympicMedalRecords.csv';
const countryUrl = "https://gist.githubusercontent.com/calvinshi64/6825abf04f6216ce198c6a83039b9493/raw/e1913eed7adc5bd7a91bbe9f6f1b0c85dcd6305e/countries.csv";
const mapUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

function useData(csvPath){
    const [dataAll, setData] = React.useState(null);
    React.useEffect(() => {
        csv(csvPath).then(data => {
            data.forEach(d => {
                d.Year = +d.Year;
                d.Type = d.Type;
                d.Country = d.Country;
                d.Man = +d.Man;
                d.Woman = +d.Woman;
                d.Gold = +d.Gold;
                d.Silver = +d.Silver;
                d.Bronze = +d.Bronze;
                d.Total = +d.Total;
            });
            setData(data);
        });
    }, []);
    return dataAll;
}

function useCountryData(csvPath){
    const [countryAll, setData] = React.useState(null);
    React.useEffect(() => {
        csv(csvPath).then(data => {
            data.map(d => {
                d.Country = d.Country;
                d.Code = d.Code;
            });
            setData(data);
        });
    }, []);
    return countryAll;
}

function useMap(jsonPath) {
    const [data, setData] = React.useState(null);
    React.useEffect(() => {
        json(jsonPath).then(topoJsonData => {
            setData(topojson.feature(topoJsonData, topoJsonData.objects.countries))});
    }, []);
    return data;
}

function Olympic() {
    // default type: summer
    const [type, setType] = React.useState('0');
    // default country: USA
    const [country, setCountry] = React.useState('USA');
    // default start year: 1896 
    const [startyear, setStartYear] = React.useState('0');
    // default end year: 2014 
    const [endyear, setEndYear] = React.useState('32');
    const [bartooltipX, setBarTooltipX] = React.useState(null);
    const [bartooltipY, setBarTooltipY] = React.useState(null);
    const [linetooltipX, setLineTooltipX] = React.useState(null);
    const [linetooltipY, setLineTooltipY] = React.useState(null);
    const [selectedYear, setSelectedYear] = React.useState(null);
    const [maptooltipX, setMapTooltipX] = React.useState(null);
    const [maptooltipY, setMapTooltipY] = React.useState(null);
    const [selectedCountry, setSelectedCountry] = React.useState(null);

    const WIDTH = 1200;
    const HEIGHT = 900;
    const margin = { top:50, right:50, bottom:120, left:50, gap:50, inner:500,
                     mapheight:360, mapwidth:600, chartheight:320, chartwidth:500 };
    const dataAll = useData(csvUrl);
    const countryAll = useCountryData(countryUrl);
    const map = useMap(mapUrl);
    const TYPE = ['Summer', 'Winter'];
    const YEAR = [1896, 1900, 1904, 1908, 1912, 1920, 1924, 1928, 1932, 1936, 1948,
                  1952, 1956, 1960, 1964, 1968, 1972, 1976, 1980, 1984, 1988, 1992, 
                  1994, 1996, 1998, 2000, 2002, 2004, 2006, 2008, 2010, 2012, 2014];
    
    if (!map || !dataAll || !countryAll) {
            return <pre>Loading...</pre>;
    };

    const data = dataAll.filter( d => {
        return d.Type === TYPE[type] && d.Country === country && 
               YEAR[startyear] <= d.Year && d.Year <= YEAR[endyear];
    });
    const countries = {};
    countryAll.forEach(d => {
        countries[d.Code] = d.Country;
    })
    const codes = {};
    countryAll.forEach(d => {
        codes[d.Country] = d.Code;
    })

    // Event Handlers
    const changeTypeHandler = (event) => {setType(event.target.value);}
    const changeCountryHandler = (event) => {setCountry(event.target.value);}
    const changeStartYearHandler = (event) => {setStartYear(event.target.value);}
    const changeEndYearHandler = (event) => {setEndYear(event.target.value);}

    const mapMouseOverHandler = (d) => {
        setSelectedCountry(d);
        selectAll(".boundary").style("fill-opacity", 0.5);
        selectAll("#"+d.replace(/\s+/g, '').replace(/\.+/g, '')+"-boundary").style("fill-opacity", 1);
    }
    const mapMouseOutHandler = () => {
        selectAll(".boundary").style("fill-opacity", 1);
        setSelectedCountry(null)
    }
    const mapMouseClickHandler = (event) => {
        setCountry(codes[event.target.attributes[1].nodeValue])
    }
    
    const getMedals = () => {
        const data = dataAll.filter( d => {
            return d.Type === TYPE[type] &&  YEAR[startyear] <= d.Year && d.Year <= YEAR[endyear];
        });
        const medals = {};
        data.forEach(d => {
            if (!medals[d.Country]) {
                medals[d.Country] = d.Total;
            } else {
                medals[d.Country] += d.Total;
            }
        })
        return medals
    }
    const medals = getMedals();
    const medalRange = [min(Object.values(medals)), median(Object.values(medals)), max(Object.values(medals))];
    const colorRangeSummer = [interpolateOrRd(0), interpolateOrRd(0.33), interpolateOrRd(0.66), interpolateOrRd(1)];
    const colorRangeWinter = [interpolateGnBu(0), interpolateGnBu(0.33), interpolateGnBu(0.66), interpolateGnBu(1)];
    const colormapSummer = scaleLinear().domain(medalRange).range(colorRangeSummer);
    const colormapWinter = scaleLinear().domain(medalRange).range(colorRangeWinter);

    let dataSelectedCountry = 0;
    if (medals[codes[selectedCountry]] !== undefined) {
        dataSelectedCountry = medals[codes[selectedCountry]];
    } 
    const dataSelectedBar = data.filter(d => d.Year === selectedYear)[0];
    // console.log(dataSelectedBar);

    if(TYPE[type]==="Summer"){
        return <div>
        <div className="parent_div" style={{width:1200}}>
            <div>
                <label> Choose Olympic Type: </label>
                <input id="type_slider" type='range' min='0' max='1' value={type} step='1' onChange={changeTypeHandler}/>
                <input id="type_value" type="text" value={TYPE[type]} style={{textAlign:"center", width:60}} readOnly/>
            </div>
            <div>
                <label> Choose Start Year: </label>
                <input id="start_slider" type='range' min='0' max='32' value={startyear} step='1' onChange={changeStartYearHandler}/>
                <input id="start_year_value" type="text" value={YEAR[startyear]} style={{width:30}} readOnly/>
            </div>
            <div>
                <label> Choose Country: </label>
                <select id="country_dropdown" value={country} style={{textAlign: "center"}} onChange={changeCountryHandler}>
                    {countryAll.map((country) => 
                        <option key={country.Code} value={country.Code}> {country.Country} - {country.Code} </option>)}
                </select>
            </div>
            <div>
                <label> Choose End Year: </label>
                <input id="end_slider" type='range' min='0' max='32' value={endyear} step='1' onChange={changeEndYearHandler}/>
                <input id="end_year_value" type="text" value={YEAR[endyear]} style={{width:30}} readOnly/>
            </div>
        </div>
        <div style={{position: "absolute", textAlign: "justify", width: "275px",left:"145px", top:"130px"}}>
            <h2>Olympic Medal Records</h2>
            <p>A visualization of the number of medals in Olympic games from 1896 to 2014.</p>
            <img style={{position: "relative", left:"0px", top:"0px", width:"280px"}} src={Logo} alt="Olympic Logo" />
        </div>

        <svg width={WIDTH} height={HEIGHT}>
            <GeoMap offsetX={margin.left+margin.inner} offsetY={margin.top} 
                    height={margin.mapheight} width={margin.mapwidth}
                    map={map} data={dataAll} countries={countries} codes={codes} medals={medals} colormap={colormapSummer} 
                    selectedCountry={selectedCountry} setMapTooltipX={setMapTooltipX} setMapTooltipY={setMapTooltipY}
                    mapMouseOverHandler={mapMouseOverHandler} mapMouseOutHandler={mapMouseOutHandler} 
                    mapMouseClickHandler={mapMouseClickHandler}/> 
            <Legend x={720} y={3*margin.mapheight/4+120} width={margin.mapwidth/2} height={10} colormap={colormapSummer} range={medalRange}/>
            <LineChart offsetX={margin.left} offsetY={margin.top+margin.gap+margin.mapheight} 
                       height={margin.chartheight} width={margin.chartwidth} data={data}
                       selectedYear={selectedYear} setSelectedYear={setSelectedYear} 
                       setLineTooltipX={setLineTooltipX} setLineTooltipY={setLineTooltipY}/>
            <BarChart offsetX={WIDTH-margin.left-margin.chartwidth} offsetY={margin.top+margin.gap+margin.mapheight} 
                      height={margin.chartheight} width={margin.chartwidth} data={data}
                      selectedYear={selectedYear} setSelectedYear={setSelectedYear}
                      setBarTooltipX={setBarTooltipX} setBarTooltipY={setBarTooltipY}/>
        </svg>
        <MapTooltip d={dataSelectedCountry} selectedCountry={selectedCountry} codes={codes} left={maptooltipX} top={maptooltipY} startYear={YEAR[startyear]} endYear={YEAR[endyear]}/>
        <LineTooltip d={dataSelectedBar} countries={countries} left={linetooltipX} top={linetooltipY}/>
        <BarTooltip d={dataSelectedBar} countries={countries} left={bartooltipX} top={bartooltipY}/>
    </div>
    } else {
        return <div>
        <div className="parent_div" style={{width:1200}}>
            <div>
                <label> Choose Olympic Type: </label>
                <input id="type_slider" type='range' min='0' max='1' value={type} step='1' onChange={changeTypeHandler}/>
                <input id="type_value" type="text" value={TYPE[type]} style={{textAlign:"center", width:60}} readOnly/>
            </div>
            <div>
                <label> Choose Start Year: </label>
                <input id="start_slider" type='range' min='0' max='32' value={startyear} step='1' onChange={changeStartYearHandler}/>
                <input id="start_year_value" type="text" value={YEAR[startyear]} style={{width:30}} readOnly/>
            </div>
            <div>
                <label> Choose Country: </label>
                <select id="country_dropdown" value={country} style={{textAlign: "center"}} onChange={changeCountryHandler}>
                    {countryAll.map((country) => 
                        <option key={country.Code} value={country.Code}> {country.Country} - {country.Code} </option>)}
                </select>
            </div>
            <div>
                <label> Choose End Year: </label>
                <input id="end_slider" type='range' min='0' max='32' value={endyear} step='1' onChange={changeEndYearHandler}/>
                <input id="end_year_value" type="text" value={YEAR[endyear]} style={{width:30}} readOnly/>
            </div>
        </div>
        <div style={{position: "absolute", textAlign: "justify", width: "275px",left:"145px", top:"130px"}}>
            <h2>Olympic Medal Records</h2>
            <p>A visualization of the number of medals in Olympic games from 1896 to 2014.</p>
            <img style={{position: "relative", left:"0px", top:"0px", width:"280px"}} src={Logo} alt="Olympic Logo" />
        </div>

        <svg width={WIDTH} height={HEIGHT}>
            <GeoMap offsetX={margin.left+margin.inner} offsetY={margin.top} 
                    height={margin.mapheight} width={margin.mapwidth}
                    map={map} data={dataAll} countries={countries} codes={codes} medals={medals} colormap={colormapWinter} 
                    selectedCountry={selectedCountry} setMapTooltipX={setMapTooltipX} setMapTooltipY={setMapTooltipY}
                    mapMouseOverHandler={mapMouseOverHandler} mapMouseOutHandler={mapMouseOutHandler} 
                    mapMouseClickHandler={mapMouseClickHandler}/> 
            <Legend x={720} y={3*margin.mapheight/4+120} width={margin.mapwidth/2} height={10} colormap={colormapWinter} range={medalRange}/>
            <LineChart offsetX={margin.left} offsetY={margin.top+margin.gap+margin.mapheight} 
                       height={margin.chartheight} width={margin.chartwidth} data={data}
                       selectedYear={selectedYear} setSelectedYear={setSelectedYear} 
                       setLineTooltipX={setLineTooltipX} setLineTooltipY={setLineTooltipY}/>
            <BarChart offsetX={WIDTH-margin.left-margin.chartwidth} offsetY={margin.top+margin.gap+margin.mapheight} 
                      height={margin.chartheight} width={margin.chartwidth} data={data}
                      selectedYear={selectedYear} setSelectedYear={setSelectedYear}
                      setBarTooltipX={setBarTooltipX} setBarTooltipY={setBarTooltipY}/>
        </svg>
        <MapTooltip d={dataSelectedCountry} selectedCountry={selectedCountry} codes={codes} left={maptooltipX} top={maptooltipY} startYear={YEAR[startyear]} endYear={YEAR[endyear]}/>
        <LineTooltip d={dataSelectedBar} countries={countries} left={linetooltipX} top={linetooltipY}/>
        <BarTooltip d={dataSelectedBar} countries={countries} left={bartooltipX} top={bartooltipY}/>
    </div>
    }
    
}

ReactDOM.render(<Olympic/>, document.getElementById("root"));