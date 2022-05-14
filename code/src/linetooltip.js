import React from "react";

function LineTooltip(props) {
    const {d, countries, left, top} = props;
    // console.log(d);
    if (left === null) {
        return <div></div>;
    } else {
        const divStyle = {
            position: "absolute",
            textAlign: "left",
            width: "160px",
            height: "150px",
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
                    <li> Total medals: {d.Total}</li>
                    <li> Gold medals: {d.Gold}</li>
                    <li> Silver medals: {d.Silver}</li>
                    <li> Bronze medals: {d.Bronze}</li>
                </ul>
            </div> 
        } else {
            return <div></div>
        }
    };  
}

export default LineTooltip