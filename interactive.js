var margin = {
        top: 30,
        right: 30,
        bottom: 30,
        left: 80
    },
    width = 850 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// Add data set
var dataset = [{
        country: 'Bangladesh',
        population_2012: 105905297,
        growth: {
            year_2013: 42488,
            year_2014: 934,
            year_2015: 52633,
            year_2016: 112822,
            year_2017: 160792
        }
    },
    {
        country: 'Ethopia',
        population_2012: 75656319,
        growth: {
            year_2013: 1606010,
            year_2014: 1606705,
            year_2015: 1600666,
            year_2016: 1590077,
            year_2017: 1580805
        }
    },
    {
        country: 'Kenya',
        population_2012: 33007327,
        growth: {
            year_2013: 705153,
            year_2014: 703994,
            year_2015: 699906,
            year_2016: 694295,
            year_2017: 687910
        }
    },
    {
        country: 'Afghanistan',
        population_2012: 23280573,
        growth: {
            year_2013: 717151,
            year_2014: 706082,
            year_2015: 665025,
            year_2016: 616262,
            year_2017: 573643
        }
    },
    {
        country: 'Morocco',
        population_2012: 13619520,
        growth: {
            year_2013: 11862,
            year_2014: 7997,
            year_2015: 391,
            year_2016: -8820,
            year_2017: -17029
        }
    }
];

var x = d3.scaleLinear()
    .domain([0, d3.max(dataset, d => d.population_2012)])
    .range([0, width]);

var y = d3.scaleBand()
    .domain(dataset.map(d => d.country))
    .range([0, height]).padding(0.15);

var xAxis = d3.axisBottom()
    .scale(x)
    .ticks(0);
var yAxis = d3.axisLeft()
    .scale(y)
    .tickSize(0)
    .tickPadding(8);

var xScale = d3.scaleLinear()
    .domain([0, d3.max(dataset, d => d.population_2012)])
    .range([0, width]);

var yScale = d3.scaleBand()
    .domain(dataset.map(d => d.country))
    .range([0, height]);

var svg = d3.select('#chart')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)

var plot = svg.append('g')
    .attr('class', 'plot')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);
plot
    .append('g')
    .attr('class', 'bars')
    .selectAll('.bar')
    .data(dataset)
    .enter()
    .append('rect')
    .attr('class', 'bar');

plot
    .append('g')
    .attr('class', 'labels')
    .selectAll('.label')
    .data(dataset)
    .enter()
    .append('text')
    .attr('class', 'label');

plot
    .append('g')
    .attr('class', 'axis x')

plot
    .append('g')
    .attr('class', 'axis y')

var bars = plot.selectAll('.bar');
var labels = plot.selectAll('.label');

var svgLine = d3.select('#chart')
    .append('svg');    

bars
    .attr('x', x(0))
    .attr('y', d => y(d.country))
    .attr('width', d => x(d.population_2012) - x(0))
    .attr('height', y.bandwidth())
    .on("mouseover", function (d) {
        d3.select(this).style("fill", "deepskyblue");
        drawLineGraph(d);
    })
    .on("mouseout", function (d) {
        d3.select(this).style("fill", "grey");
        svgLine.selectAll("*").remove();
    })

plot.select('.axis.x')
    .attr('transform', `translate(0, ${height})`)
    .call(xAxis)
    .select('.domain').remove();

plot.select('.axis.y')
    .call(yAxis)
    .select('.domain').remove();

// draw value text labels
labels
    .attr('x', 5)
    .attr('y', d => y(d.country) + y.bandwidth() / 2)
    .attr('dy', '0.35em')
    .style("text-anchor", "start")
    .text(d => d.population_2012);


function drawLineGraph(fd) {
    var total = fd.population_2012;
    var pct_data = [];
    var year_diffs = d3.values(fd.growth);
    var years = ["2013", "2014", "2015", "2016", "2017"];
    var item = {};
    for (var i = 0; i < year_diffs.length; i++) {
        item = {};
        item.year = +years[i];
        item.pct = +(100 * year_diffs[i] / total).toFixed(2);
        pct_data.push(item);
    }
    
    svgLine.selectAll("*").remove();
    var w = 400;
    var h = 300;

    var xScale_line = d3.scaleLinear().range([0, w]);
    var yScale_line = d3.scaleLinear().range([h, 0]);

    var valueline = d3.line()
        .x(d => 40 + xScale_line(d.year))
        .y(d =>  yScale_line(d.pct));

    svgLine
        .attr("width", w + 80)
        .attr("height", h + 80)        

    xScale_line.domain(d3.extent(pct_data, d => d.year));
    yScale_line.domain([0, d3.max(pct_data, d => d.pct) + 0.1]);

    // Add the valueline path.
    svgLine        
        .append("path")
        .data([pct_data])
        .attr("class", "line")        
        .attr("d", valueline);

    // Add the X Axis
    svgLine.append("g")
        .attr("transform", "translate(40," + h + ")")
        .call(d3.axisBottom(xScale_line).ticks(5).tickFormat(d3.format("d")));

    // Add the Y Axis
    svgLine.append("g")  
        .attr("transform", "translate(40," + 0 + ")")      
        .call(d3.axisLeft(yScale_line));

    // X axis legend
    svgLine.append("g")
        .append("text")
        .attr("class", "legend")
        .attr("x", w)
        .attr("y", h + 30)
        .attr("font-size", 12)        
        .style("text-anchor", "middle")
        .text("Year");

    // Y axis label
    svgLine.append("g")
        .append("text")
        .attr("class", "legend")
        .attr("x", -80)
        .attr("y", 10)
        .attr("transform", "rotate(-90)")
        .attr("font-size", 12)        
        .style("text-anchor", "end")
        .text("Pc t %");

}