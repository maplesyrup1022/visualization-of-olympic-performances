import React from "react";
import { geoPath, geoEquirectangular } from "d3-geo";

function GeoMap(props) {
    const {offsetX, offsetY, map, data, countries, codes, medals, colormap, height, width,
    selectedCountry, setMapTooltipX, setMapTooltipY, mapMouseOverHandler, mapMouseOutHandler, mapMouseClickHandler} = props;
    let path = geoPath(geoEquirectangular().fitSize([width, height], map));
    return <g transform={`translate(${offsetX}, ${offsetY})`}>
        <text style={{ textAnchor:'center', fontSize:'15px'}} transform={`translate(0, 0)`}>
            {"Geomap"}
        </text>
        {map.features.map(feature => {
            const country = data.filter(d => countries[d.Country] === feature.properties.name);
            const countryName = feature.properties.name.replace(/\s+/g, '').replace(/\.+/g, '');
            {/* console.log(countryName); */}
            if (country[0]) {
                return <path key={countryName+"-boundary"} id={countryName+"-boundary"} name={feature.properties.name} className={"boundary"}
                d={path(feature)} style={{fill:colormap(medals[country[0].Country])}} 
                strokeWidth={0.5} stroke={"black"}
                onMouseOver={(event) => {
                    mapMouseOverHandler(feature.properties.name);
                    setMapTooltipX(event.pageX);
                    setMapTooltipY(event.pageY);}} 
                onMouseOut={() => {
                    mapMouseOutHandler();
                    setMapTooltipX(null);
                    setMapTooltipY(null);}}
                onClick={(event) => mapMouseClickHandler(event)} />
            } else {
                return <path key={countryName+"-boundary"} id={countryName+"-boundary"} className={"boundary"}
                d={path(feature)} style={{"fill":"rgb(75, 75, 75)"}} strokeWidth={0.5} stroke={"black"} 
                onMouseOver={(event) => {
                    mapMouseOverHandler(feature.properties.name);
                    setMapTooltipX(event.pageX);
                    setMapTooltipY(event.pageY);}} 
                onMouseOut={() => {
                    mapMouseOutHandler();
                    setMapTooltipX(null);
                    setMapTooltipY(null);}}
                onClick={(event) => mapMouseClickHandler(event)} />
            }
        })}
    </g>
}

export default GeoMap;