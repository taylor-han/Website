"use strict";

function gen_graph(course, prereqs) {
    // returns a graph of the following json format 
    // {"nodes": [ { "course": "course name", "type":"type" }, ...], "edges": [ { "source": "course1", "target": "course2", "group" : n}, ] }
    // where group assigns a color. If a course is a singular prereq, assign n = 0 (shows as a black edge in D3).
    let already_created = []
    let edges = []
    let source= []
    let group_number = 0
    function runner(parse_course, edge_list, created, starting) {
        created.push(parse_course)
        if (prereqs[parse_course] !== null) {
            starting.push(parse_course)
            for (course in prereqs[parse_course]) {
                let course_text = prereqs[parse_course][course]
                if (course_text !== 'or' && course_text !== 'and' && Object.keys(prereqs).includes(course_text)) {
                    edge_list.push([course_text, parse_course, group_number])
                    if (!(created.includes(course_text))) {
                        runner(course_text, edge_list, created, source)
                    }
                } else if (course_text == 'and') {
                    group_number += 1
                }

            }
        }
    }

    function runner_iterative(parse_course) {
        let queue = [parse_course]
        already_created.push(parse_course)
        while (queue.length != 0) {
            let v = queue.shift()
            console.log(v);
            for (course in prereqs[v]) {
                console.log(course)
                let course_text = prereqs[v][course]
                if (!(already_created.includes(course_text))) {
                    if (course_text !== 'or' && course_text !== 'and' && Object.keys(prereqs).includes(course_text)) {
                        already_created.push(course_text)
                        edges.push([course_text, v, group_number])
                        queue.push(course_text)
                    } else if (course_text == 'and') {
                        group_number += 1
                    }
                }
            }
        }
    }
    // runner(course, edges, already_created, source)
    runner_iterative(course);
    let graph = {"nodes" : [], "edges":[]};
    let c, e;
    for (c in already_created) {
        if (already_created[c] == already_created[0]){
            graph.nodes.push({"course":already_created[c], "type":"parent"})
        }
        else {
        graph.nodes.push({"course":already_created[c], "type":"child"})
        }
    } 

    for (e in edges) {
        graph.edges.push({"source":edges[e][0], "target":edges[e][1], "group":edges[e][2]})
        } 
    
    console.log(graph);
    return graph;
}

fetch("./data/master_prereqs.json")
    .then(function (resp) {
        return resp.json();
    })
    .then(function (prereqs) {
        //button input stuff 
        d3.select("#display").on("click", display);

        function display () {
            d3.select("svg").remove();
            
            //Width and height
            let w = 1400;
            let h = 1000;

            let parent_course = d3.select("#parent_course").property("value").toUpperCase();
            let graph;
            if (parent_course in prereqs){
                graph = gen_graph(parent_course, prereqs); 
            }
            else {
                parent_course = "༼ つ ಥ_ಥ ༽つ That class might not exist.";
                graph = gen_graph(parent_course, prereqs);
                } 

            //Initialize a simple force layout, using the nodes and edges in graph
            let force = d3.forceSimulation(graph.nodes)
                .force("charge", d3.forceManyBody().strength(-200))
                .force("link", d3.forceLink(graph.edges).id(function (d) { return d.course; })
                    // .strength( function (d) {
                    //     if (d.group == 1) {return 0.5;}
                    // })
                    .distance(90))
                .force("center", d3.forceCenter().x(w / 2).y(h / 2));

            //use colors for the edges
            let colors = d3.scaleOrdinal(d3.schemeCategory10)

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
                .attr("id", function (d, i) {
                    return 'arrow' + i; //<-- append index postion
                })
                .attr('viewBox', '0 -5 10 10')
                .attr('refX', 27.6)
                .attr('refY', 0)
                .attr('markerWidth', 7)
                .attr('markerHeight', 6)
                .attr('orient', 'auto')
                .append('svg:path')
                .attr('d', 'M0,-5L10,0L0,5')
                .style("fill", function (d, i) {
                    if (d.group == 0) {
                        return '#000'
                    }
                    else {
                        return colors(d.group)
                    };
                });

            //Create edges as lines
            let edges = svg.selectAll("line")
                .data(graph.edges)
                .enter()
                .append("line")
                .style("stroke", function (d, i) {
                    if (d.group == 0) {
                        return '#000'
                    }
                    else {
                        return colors(d.group)
                    };
                })
                .style("stroke-width", 2)
                .attr('marker-end', function (d, i) {
                    return "url(#arrow" + i + ")";
                });

            //Create nodes as svg circles
            let nodes = svg.selectAll("circle")
            .data(graph.nodes)
            .enter()
            .append("circle")
            .attr("r", 20)
            .attr("stroke", function(d,i) {
                if (d.type == "parent") { 
                    return '#dbffdf' }
                else if (d.type == "special") {
                    return '#e3feff'
                }
                else {return   '#f2f7f7'}
            })
            .style("stroke-width", 5)
            .style("fill", function(d,i) {
                if (d.type == "parent") { 
                    return '#7CFC00' }
                else if (d.type == "special") {
                    return '#1cf7ff'
                }
                else {return   '#ccc'}
            });

            let text = svg.selectAll('text')
                .data(graph.nodes)
                .enter()
                .append('text')
                .style('font', '10px arial')
                .attr("pointer-events", "none")
                .attr("text-anchor", "middle");

            //drag: a physics thingy
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
            force.on("tick", function () {

                edges.attr("x1", function (d) { return d.source.x; })
                    .attr("y1", function (d) { return d.source.y; })
                    .attr("x2", function (d) { return d.target.x; })
                    .attr("y2", function (d) { return d.target.y; });

                nodes.attr("cx", function (d) { return d.x; })
                    .attr("cy", function (d) { return d.y; });

                text.attr("x", function(d) { return d.x; })
                    .attr("dy", function(d) { return d.y+3; })
                    .text( function (d) { return d.course; });
                });

        } //end of display function

        $( function() {
            var availableTags = $.map(prereqs,function(v,k) { return k; });
            $( "#parent_course" ).autocomplete({
            // source: availableTags
            source: function(request, response) {
                        var results = $.ui.autocomplete.filter(availableTags, request.term);
                        response(results.slice(0, 10));
                    }
            });
        } );
    })