import React from "react";

function MapTooltip(props) {
    const {d, selectedCountry, codes, left, top, startYear, endYear} = props;
    // console.log(d, selectedCountry, left, top);
    if (left === null) {
        return <div></div>;
    } else {
        const divStyle = {
            position: "absolute",
            textAlign: "left",
            width: "200px",
            height: "80px",
            padding: "1px",
            font: "12px sans-serif",
            background: "lightgreen",
            opacity: 0.85,
            border: "0px",
            borderRadius: "8px",
            pointerEvents: "none",
            left: `${left+15}px`,
            top: `${top}px`
        };
        // console.log("Draw Tooltip    " + d);
        if (codes[selectedCountry] !== undefined && d !== 0) {
            return <div style={divStyle}>
                <p>{selectedCountry}</p>
                <p>Total medals from {startYear} to {endYear}: {d}</p>
            </div> 
        } else {
            return <div style={divStyle}>
                <p>{selectedCountry}</p>
                <p>{"No medals "} from {startYear} to {endYear}</p>
            </div> 
        }
    };  
}

export default MapTooltip