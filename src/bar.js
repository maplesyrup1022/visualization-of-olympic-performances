import React from "react";
import { scaleLinear, scaleBand, max } from "d3";

function BarChart(props) {    
    const {offsetX, offsetY, height, width, data, selectedYear, setSelectedYear, setBarTooltipX, setBarTooltipY} = props;

    const xScale = scaleBand().range([0, width])
                    .domain(data.map(d => d.Year))
    const yScale = scaleLinear().range([height, 0])
                    .domain([0, max(data, d => d.Man > d.Woman ? d.Man:d.Woman)+4])
                    .nice();
    const title = () => {
        return <g key='title'>
            <text style={{ textAnchor:'center', fontSize:'15px'}} transform={`translate(0, 0)`}>
                {"Number of Medals Won by Man and Woman"}
            </text>
            <rect className="BarMan" x={325} y={-10} width={30} height={10}/>
            <text style={{ textAnchor:'center', fontSize:'13px'}} transform={`translate(357, 0)`}>
                {"Man"}
            </text>
            <rect className="BarWoman" x={400} y={-10} width={30} height={10}/>
            <text style={{ textAnchor:'center', fontSize:'13px'}} transform={`translate(432, 0)`}>
                {"Woman"}
            </text>
        </g>
    }

    // no medal records found
    if (data.length == 0) {
        return <g>
            <rect transform={`translate(${offsetX}, ${offsetY})`} key="cover" x={0} y={0} width={width} height={height} fill={"grey"} opacity={0.4}/>
            <text style={{ textAnchor:'center', fontSize:'15px'}} transform={`translate(${offsetX}, ${offsetY})`}>
                {"Num. of Medals Won by Man and Woman"}
            </text>
            <text style={{ textAnchor:'center', fontSize:'25px'}} transform={`translate(${offsetX+150}, ${offsetY+170})`}>
                {"No Medals Record"}
            </text>
        </g>
    }

    // not select any bars
    if (selectedYear===null) {
        return <g transform={`translate(${offsetX}, ${offsetY})`}>
            {title()}

            {/* Bar */}
            { data.map( d =>
                <g key={d.Year+"Bar"} transform={`translate(${xScale.bandwidth()/6}, 0)`} 
                onMouseEnter={(event)=> {setSelectedYear(d.Year);setBarTooltipX(event.pageX);setBarTooltipY(event.pageY);}}
                onMouseOut={()=> {setSelectedYear(null);setBarTooltipX(null);setBarTooltipY(null);}}>
                    {/* Bar for Man data */}
                    <rect key={d.Year+"BarMan"} className="BarMan"
                        x={xScale(d.Year)} y={yScale(d.Man)}
                        width={xScale.bandwidth()/3} height={height-yScale(d.Man)}/>
                    {/* Bar for Woman data */}
                    <rect transform={`translate(${xScale.bandwidth()/3}, 0)`}
                        key={d.Year+"BarWoman"} className="BarWoman" 
                        x={xScale(d.Year)} y={yScale(d.Woman)}
                        width={xScale.bandwidth()/3} height={height-yScale(d.Woman)}/>      
                </g>
            )}

            {/* X axis */}
            {<line x1={0} y1={height} x2={width} y2={height} stroke='black'/>}
            {xScale.domain().map(tickValue =>
                <g key={tickValue+'X'} transform={`translate(${xScale(tickValue)+xScale.bandwidth()/2}, 0)`}>
                    <line y2={height} />
                    <text style={{textAnchor: 'start', fontSize:'13px' }} y={height-3} transform={`rotate(45, -20, ${height})`}>
                        {tickValue}
                    </text>
                </g>
            )}
            <text style={{ textAnchor:'end', fontSize:'13px'}} transform={`translate(${width},${height-2})`}>
                {"Year"}
            </text>

            {/* Y axis */}
            {<line y2={height} stroke='black'/>}
            {yScale.ticks().map(tickValue => 
                <g key={tickValue+"Y"} transform={`translate(-10, ${yScale(tickValue)})`}>
                    <line x2={10} stroke='black' />
                    <text style={{ textAnchor:'end', fontSize:'13px' }}>
                        {tickValue}
                    </text>
                </g>
            )}
            <text style={{ textAnchor:'end', fontSize:'13px'}} transform={`translate(12,2)rotate(-90)`}>
                {"No. of Medals"}
            </text>
        </g>

    } else { // selecting a bar
        return <g transform={`translate(${offsetX}, ${offsetY})`}>
            {title()}

            {/* Bar */}
            { data.map( d =>
                <g key={d.Year+"Bar"} transform={`translate(${xScale.bandwidth()/6}, 0)`}
                    onMouseEnter={(event)=> {setSelectedYear(d.Year);setBarTooltipX(event.pageX);setBarTooltipY(event.pageY);}}
                    onMouseOut={()=> {setSelectedYear(null);setBarTooltipX(null);setBarTooltipY(null);}}>
                    {/* Bar for Man data */}
                    <rect key={d.Year+"OtherBarMan"} className="OtherBarMan"
                        x={xScale(d.Year)} y={yScale(d.Man)}
                        width={xScale.bandwidth()/3} height={height-yScale(d.Man)}/>
                    {/* Bar for Woman data */}
                    <rect transform={`translate(${xScale.bandwidth()/3}, 0)`}
                        key={d.Year+"OtherBarWoman"} className="OtherBarWoman" 
                        x={xScale(d.Year)} y={yScale(d.Woman)}
                        width={xScale.bandwidth()/3} height={height-yScale(d.Woman)}/>      
                </g>
            )}
                
            {/* Highlight Bar */}
            {data.filter(d => d.Year===selectedYear).map(d => 
                <g key={d.Year+"Bar"} transform={`translate(${xScale.bandwidth()/6}, 0)`}
                   onMouseEnter={(event) => {setSelectedYear(d.year);setBarTooltipX(event.pageX);setBarTooltipY(event.pageY);}} 
                   onMouseOut={()=> {setSelectedYear(null);setBarTooltipX(null);setBarTooltipY(null);}}>
                    {/* Highlight Man Bar */}
                    <rect key={d.Year+"BarMan"} className="BarMan" 
                        x={xScale(d.Year)} y={yScale(d.Man)}
                        width={xScale.bandwidth()/3} height={height-yScale(d.Man)}/>
                    {/* Highlight Woman Bar */}
                    <rect transform={`translate(${xScale.bandwidth()/3}, 0)`}
                        key={d.Year+"BarWoman"} className="BarWoman" 
                        x={xScale(d.Year)} y={yScale(d.Woman)}
                        width={xScale.bandwidth()/3} height={height-yScale(d.Woman)}/>
                </g>
            )}


            {/* X axis */}
            {<line x1={0} y1={height} x2={width} y2={height} stroke='black'/>}
            {xScale.domain().map(tickValue =>
                <g key={tickValue+'X'} transform={`translate(${xScale(tickValue)+xScale.bandwidth()/2}, 0)`}>
                    <line y2={height} />
                    <text style={{textAnchor: 'start', fontSize:'13px' }} y={height-3} transform={`rotate(45, -20, ${height})`}>
                        {tickValue}
                    </text>
                </g>
            )}
            <text style={{ textAnchor:'end', fontSize:'13px'}} transform={`translate(${width},${height-2})`}>
                {"Year"}
            </text>

            {/* Y axis */}
            {<line y2={height} stroke='black'/>}
            {yScale.ticks().map(tickValue => 
                <g key={tickValue+"Y"} transform={`translate(-10, ${yScale(tickValue)})`}>
                    <line x2={10} stroke='black' />
                    <text style={{ textAnchor:'end', fontSize:'13px' }} >
                        {tickValue}
                    </text>
                </g>
            )}
            <text style={{ textAnchor:'end', fontSize:'13px'}} transform={`translate(12,2)rotate(-90)`}>
                {"No. of Medals"}
            </text>
        </g>
    }
}

export default BarChart