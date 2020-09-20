// T1_intro

d3.csv("TVShows-Netflix.csv").then(data => {
    console.log("data", data);
    
    const table = d3.select("#d3-table");
    
    //const table2 = d3.select("#d3-table").append("tbody").attri("id", "1")

    const body = table.append('tbody').attr("id", "2")

      // d3.select("d3-table")
        //   .append("tbody")
        //   .append("tr")

        const thead = table.append("thead")

        thead
        .append("tr")
        .selectAll("th")
        .data(data.columns)
        .join("td")
        .style("font-weight", "bold")
        .style("padding", "10px")
        .text(d => d);

        const rows = table
        .append("tbody")
        .selectAll("tr")
        .data(data)
        .join("tr");
    

      // cells
      rows
        .selectAll("td")
        .data(d => Object.values(d))
        .join("td")
        // to highlight recent series 
        .attr("class", d => +d >2015 ? 'highlight' : null)
        .text(d => d);
        



    console.log(table, body)

    
})

//rest in power, RBG :'(