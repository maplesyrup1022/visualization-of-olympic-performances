import React from "react";

function BarTooltip(props) {
    const {d, countries, left, top} = props;
    // console.log(d);
    if (left === null) {
        return <div></div>;
    } else {
        const divStyle = {
            position: "absolute",
            textAlign: "left",
            width: "160px",
            height: "100px",
            padding: "0px",
            font: "12px sans-serif",
            background: "lightgreen",
            opacity: 0.85,
            border: "0px",
            borderRadius: "8px",
            pointerEvents: "none",
            left: `${left+25}px`,
            top: `${top+10}px`,
        };
        // console.log("Draw Tooltip    " + d);
        if (d !== undefined) {
            return <div style={divStyle}>
                <p>{countries[d.Country]}</p>
                <p>Year: {d.Year} Season: {d.Type}</p>
                <ul> 
                    <li> Men's medals: {d.Man}</li>
                    <li> Women's medals: {d.Woman}</li>
                </ul>
            </div> 
        } else {
            return <div></div>
        }
    };  
}

export default BarTooltip