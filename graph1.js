//Width and height
			let w = 750;
			let h = 700;

			//Original data
			let graph = {
				"nodes": [
                    { "course": "COGS 118A" }, //0
					{ "course": "COGS 18" }, //1
					{ "course": "CSE 8B" }, //2
					{ "course": "CSE 11" }, //3
					{ "course": "MATH 18" }, //4
					{ "course": "MATH 20E" }, //5
					{ "course": "MATH 20C" }, //6
					{ "course": "MATH 20B" }, //7
					{ "course": "MATH 20A", }, //8
                    { "course": "MATH 180A" }, //9
                    { "course": "COGS 108", }, //10
                    { "course": "COGS 109", } //11
				],
				"edges": [
					{ "source": "COGS 18", "target": "COGS 118A", "group" : 1},
					{ "source": "CSE 8B", "target": "COGS 118A", "group" : 1},
					{ "source": "CSE 11", "target": "COGS 118A", "group" : 1},
					{ "source": "MATH 20E", "target": "COGS 118A", "group" : 0},
					{ "source": "MATH 20C", "target": "MATH 20E", "group" : 0},
					{ "source": "MATH 20B", "target": "MATH 20C", "group" : 0},
					{ "source": "MATH 20A", "target": "MATH 20B", "group" : 0},
					{ "source": "MATH 20C", "target": "MATH 180A", "group" : 0},
					{ "source": "MATH 18", "target": "MATH 20E", "group" : 0},
                    { "source": "COGS 108", "target": "COGS 118A", "group" : 2 },
                    { "source": "COGS 109", "target": "COGS 118A", "group" : 2 },
                    { "source": "MATH 180A", "target": "COGS 118A", "group" : 0 }
				]
			};

			//Initialize a simple force layout, using the nodes and edges in graph
			let force = d3.forceSimulation(graph.nodes)
						  .force("charge", d3.forceManyBody().strength(-200))
                          .force("link", d3.forceLink(graph.edges).id(function(d) { return d.course; })
                                // .strength( function (d) {
                                //     if (d.group == 1) {return 0.5;}
                                // })
                                .distance(90))
                          .force("center", d3.forceCenter().x(w/2).y(h/2));
            
          
                   
            //use colors for the edges
            let colors = d3.scaleOrdinal(d3.schemeCategory10);

			//Create SVG element
			let svg = d3.select("body")
						.append("svg")
						.attr("width", w)
                        .attr("height", h);
                        
            //arrows
            let arrows = svg.append("defs")
                .selectAll(".arrows")
                .data(graph.edges)
                .enter()
            .append("marker") 
            .attr("id", function(d,i){
                return 'arrow' + i; //<-- append index postion
                })
            .attr('viewBox', '0 -5 10 10')
            .attr('refX', 27.6)
            .attr('refY',0)
            .attr('markerWidth', 7)
            .attr('markerHeight', 6)         
            .attr('orient', 'auto')
            .append('svg:path')
                .attr('d', 'M0,-5L10,0L0,5')
                .style("fill", function(d, i) {
					if (d.group == 0){
                     return '#000'}
                    else {
                        return colors(d.group)};
				});    
            
            //Create edges as lines
			let edges = svg.selectAll("line")
				.data(graph.edges)
				.enter()
				.append("line")
                .style("stroke", function(d, i) {
					if (d.group == 0){
                     return '#000'}
                    else {
                        return colors(d.group)};
				})
                .style("stroke-width", 2)
                .attr('marker-end', function(d,i){
                    return "url(#arrow"+i+")";});
			
			//Create nodes as circles

            let nodes = svg.selectAll("circle")
				.data(graph.nodes)
				.enter()
				.append("circle")
                .attr("r", 20)
                .attr("stroke", function(d,i) {
                    if (i === 0) { 
                        return '#dbffdf' }
                     else {return   '#f2f7f7'}
                })
                .style("stroke-width", 5)
                .style("fill", function(d,i) {
                    if (i === 0) { 
                        return '#7CFC00' }
                     else {return   '#ccc'}
                });

            let text = svg.selectAll('text')
                    .data(graph.nodes)
                    .enter()
                    .append('text')
                    .style('font', '10px arial')
                    .attr("pointer-events", "none");
            
        //drag 
            let drag_handler = d3.drag()
                .on("start", drag_start)
                .on("drag", drag_drag)
                .on("end", drag_end);	
                
            //same as using .call on the node variable as in https://bl.ocks.org/mbostock/4062045 
            drag_handler(nodes)

            //drag handler
            //d is the node 
            function drag_start(d) {
            if (!d3.event.active) force.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
            }

            function drag_drag(d) {
            d.fx = d3.event.x;
            d.fy = d3.event.y;
            }


            function drag_end(d) {
            if (!d3.event.active) force.alphaTarget(0);
            d.fx = null;
            d.fy = null;
            }
            
			//Every time the simulation "ticks", this will be called
			force.on("tick", function() {

				edges.attr("x1", function(d) { return d.source.x; })
					 .attr("y1", function(d) { return d.source.y; })
					 .attr("x2", function(d) { return d.target.x; })
					 .attr("y2", function(d) { return d.target.y; });
			
				nodes.attr("cx", function(d) { return d.x; })
                     .attr("cy", function(d) { return d.y; });
                     
                text.attr("x", function(d) { return d.x - 20; })
                    .attr("dy", function(d) { return d.y +3 ; })
                    .text( function (d) { return d.course; })
                
            });