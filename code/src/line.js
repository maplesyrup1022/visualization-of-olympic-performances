import React from "react";
import { scaleLinear, scaleBand, max, line, curveLinear} from "d3";

function LineChart(props) {
    const {offsetX, offsetY, height, width, data, selectedYear, setSelectedYear, setLineTooltipX, setLineTooltipY} = props;
    const xScale = scaleBand().range([0, width])
        .domain(data.map(d => d.Year));
    const yScale = scaleLinear().range([height, 0])
        .domain([0, max(data, d => d.Total)+3])
        .nice();
    const path1 = line()
        .x(function(d) { return xScale(d.Year) }) 
        .y(function(d) { return yScale(d.Total) })
        .curve(curveLinear)(data);
    const path2 = line()
        .x(function(d) { return xScale(d.Year) }) 
        .y(function(d) { return yScale(d.Gold) })
        .curve(curveLinear)(data);
    const path3 = line()
        .x(function(d) { return xScale(d.Year) }) 
        .y(function(d) { return yScale(d.Silver) })
        .curve(curveLinear)(data);
    const path4 = line()
        .x(function(d) { return xScale(d.Year) }) 
        .y(function(d) { return yScale(d.Bronze) })
        .curve(curveLinear)(data);

    const getOpacity = (selectedYear, year) => {
        return year===selectedYear ? 1 : 0.4;}

    const getRadius = (selectedYear, r) => {
        return r===selectedYear ? 8 : 4};

    const title = () => {
        return <g key='title'>
            <g><text style={{ textAnchor:'center', fontSize:'15px'}} transform={`translate(0, 0)`}>
                {"Number of Gold/Silver/Bronze/Total Medals"}
            </text></g>
            <g>
                <circle className="CircleTotal" cx={445} cy={10} r={5}/>
                <text style={{ textAnchor:'center', fontSize:'13px'}} transform={`translate(450, 15)`}>
                    {"Total"}
                </text>
                <circle className="CircleGold" cx={445} cy={25} r={5}/>
                <text style={{ textAnchor:'center', fontSize:'13px'}} transform={`translate(450, 30)`}>
                    {"Gold"}
                </text>
                <circle className="CircleSilver" cx={445} cy={40} r={5}/>
                <text style={{ textAnchor:'center', fontSize:'13px'}} transform={`translate(450, 45)`}>
                    {"Silver"}
                </text>
                <circle className="CircleBronze" cx={445} cy={55} r={5}/>
                <text style={{ textAnchor:'center', fontSize:'13px'}} transform={`translate(450, 60)`}>
                    {"Bronze"}
                </text>
            </g>
        </g>
    }
    

    if (data.length == 0) {
        return <g>
            <rect transform={`translate(${offsetX}, ${offsetY})`} key="cover" x={0} y={0} width={width} height={height} fill={"grey"} opacity={0.4}/>
            <text style={{ textAnchor:'center', fontSize:'15px'}} transform={`translate(${offsetX}, ${offsetY})`}>
                {"Number of Gold/Silver/Bronze/Total Medals"}
            </text>
            <text style={{ textAnchor:'center', fontSize:'25px'}} transform={`translate(${offsetX+150}, ${offsetY+170})`}>
                {"No Medals Record"}
            </text>
        </g>
    }

    if (selectedYear === null) {
        return <g transform={`translate(${offsetX}, ${offsetY})`}>
            {title()}

            {/* X axis */}
            {<line x1={0} y1={height} x2={width} y2={height} stroke='black'/>}
            {xScale.domain().map(tickValue =>
                <g key={tickValue+'B'} transform={`translate(${xScale(tickValue)+5}, ${height})`}>
                    <line y2={-5} stroke='black'/>
                    <text style={{ textAnchor:'middle', fontSize:'10px' }}  transform={`translate(${0}, ${20})rotate(50)`}>
                        {tickValue}
                    </text>
                </g>
            )}
            <text style={{ textAnchor:'end', fontSize:'13px'}} transform={`translate(${width},${height-2})`}>
                {"Year"}
            </text>

            {/* Y axis */}
            {<line y2={height} stroke='black'/>}
            {yScale.ticks(8).map(tickValue => 
                <g key={tickValue} transform={`translate(-10, ${yScale(tickValue)})`}>
                    <line x2={10} stroke='black' />
                    <text style={{ textAnchor:'end', fontSize:'10px' }} >
                        {tickValue}
                    </text>
                </g>
            )}
            <text style={{ textAnchor:'end', fontSize:'13px'}} transform={`translate(12,2)rotate(-90)`}>
                {"No. of Medals"}
            </text>

            {data.map(d =>
                <g key={d.Year+"Line"} transform={`translate(5,0)`} onMouseEnter={(event)=> {setSelectedYear(d.Year);setLineTooltipX(event.pageX);setLineTooltipY(event.pageY);}}
                onMouseOut={()=> {setSelectedYear(null);setLineTooltipX(null);setLineTooltipY(null);}}>
                    <circle cx={xScale(d.Year)} cy={yScale(d.Total)} r={5} key={d.Year+"TotalMedal"} className="CircleTotal"></circle>
                    <path d={path1} fill={'none'} className="LineTotal"/>
                    <circle cx={xScale(d.Year)} cy={yScale(d.Gold)} r={5} key={d.Year+"GoldMedal"} className="CircleGold"></circle>
                    <path d={path2} fill={'none'} className="LineGold"/>
                    <circle cx={xScale(d.Year)} cy={yScale(d.Silver)} r={5} key={d.Year+"SilverMedal"} className="CircleSilver"></circle>
                    <path d={path3} fill={'none'} className="LineSilver"/>
                    <circle cx={xScale(d.Year)} cy={yScale(d.Bronze)} r={5} key={d.Year+"BronzeMedal"} className="CircleBronze"></circle>
                    <path d={path4} fill={'none'} className="LineBronze"/>
                </g>
            )}
        </g>

    } else {
        return <g transform={`translate(${offsetX}, ${offsetY})`}>
            {title()}

            {/* X axis */}
            {<line x1={0} y1={height} x2={width} y2={height} stroke='black'/>}
            {xScale.domain().map(tickValue =>
                <g key={tickValue+'B'} transform={`translate(${xScale(tickValue)+5}, ${height})`}>
                    <line y2={-5} stroke='black'/>
                    <text style={{ textAnchor:'middle', fontSize:'10px' }} transform={`translate(${0}, ${20})rotate(50)`}>
                        {tickValue}
                    </text>
                </g>
            )}
            <text style={{ textAnchor:'end', fontSize:'13px'}} transform={`translate(${width},${height-2})`}>
                {"Year"}
            </text>
            
            {/* Y axis */}
            {<line y2={height} stroke='black'/>}
            {yScale.ticks(8).map(tickValue => 
                <g key={tickValue} transform={`translate(-10, ${yScale(tickValue)})`}>
                    <line x2={10} stroke='black' />
                    <text style={{ textAnchor:'end', fontSize:'10px' }} >
                        {tickValue}
                    </text>
                </g>
            )}
            <text style={{ textAnchor:'end', fontSize:'13px'}} transform={`translate(12,2)rotate(-90)`}>
                {"No. of Medals"}
            </text>

            {data.map(d =>
                <g key={d.Year+"Line"} transform={`translate(5,0)`} onMouseEnter={(event)=> {setSelectedYear(d.Year);setLineTooltipX(event.pageX);setLineTooltipY(event.pageY);}}
                onMouseOut={()=> {setSelectedYear(null);setLineTooltipX(null);setLineTooltipY(null);}}>
                    <circle cx={xScale(d.Year)} cy={yScale(d.Total)} r={getRadius(selectedYear, d.Year)} key={d.Year+"TotalMedal"} className="CircleTotal" opacity={getOpacity(selectedYear, d.Year)}></circle>
                    <path d={path1} fill={'none'} className="LineTotal"/>
                    <circle cx={xScale(d.Year)} cy={yScale(d.Gold)} r={getRadius(selectedYear, d.Year)} key={d.Year+"GoldMedal"} className="CircleGold" opacity={getOpacity(selectedYear, d.Year)}></circle>
                    <path d={path2} fill={'none'} className="LineGold"/>
                    <circle cx={xScale(d.Year)} cy={yScale(d.Silver)} r={getRadius(selectedYear, d.Year)} key={d.Year+"SilverMedal"} className="CircleSilver" opacity={getOpacity(selectedYear, d.Year)}></circle>
                    <path d={path3} fill={'none'} className="LineSilver"/>
                    <circle cx={xScale(d.Year)} cy={yScale(d.Bronze)} r={getRadius(selectedYear, d.Year)} key={d.Year+"BronzeMedal"} className="CircleBronze" opacity={getOpacity(selectedYear, d.Year)}></circle>
                    <path d={path4} fill={'none'} className="LineBronze"/>
                </g>
            )}
        </g>
    };    
}

export default LineChart