import React from "react";
import { scaleLinear } from "d3";

const Legend = (props) => {
    const {x, y, width, height, colormap, range} = props;
    const [start, middle, end] = range;
    const xScale = scaleLinear().range([0, width]).domain([start, end]).nice();
    const ticks = xScale.ticks(10);

    return <g>
        <defs>
            <linearGradient id={"gradient"} x1="0%" y1="0%" x2="100%" y2="0%">
                {ticks.map(tick => {
                    return <stop key={`${tick}stop`} offset={`${100*tick/(end-start)}%`}
                                 stopColor={colormap(tick)} />
                })}
            </linearGradient>
        </defs>
        <rect x={x} y={y} width={width} height={height} style={{fill:"url(#gradient)"}} 
            stroke={"black"} strokeWidth={0.5}
        />
        {ticks.map(tick => {
            return <g key={tick} transform={`translate(${xScale(tick)+x}, ${y})`}>
                <line y2={height} stroke={"black"} strokeWidth={0.5} />
                <text style={{textAnchor:"middle"}} y={height+10} fontSize={8}>
                    {tick}
                </text>
            </g>
        })}
    </g>
}

export default Legend;