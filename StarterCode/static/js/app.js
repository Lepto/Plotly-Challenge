//Gathering json objects from JSON file
d3.json("samples.json").then((data) => {

    var data1 = data;
	var names = data1.names;

	names.forEach((name) => {
		d3.select("#selDataset").append("option").text(name);
	})

	// Initializes the page with default plots
	function init() {

		// Choose data for test ID No. 940 plotted as default
		dataset_d = data.samples.filter(sample => sample.id === "940")[0];
		// console.log(dataset_d);

       // Selecting data OTU ids, labels, and sample values
		OTU_ids_d = dataset_d.otu_ids;
		OTU_labels_d = dataset_d.otu_labels;
        sampleValue_d = dataset_d.sample_values;

		// Selecting the first 10 OTU values with respective OTU ids and labels
		OTU_id_d = OTU_ids_d.slice(0, 10).reverse();
		OTU_label_d = OTU_labels_d.slice(0, 10).reverse();
        sampleValue = sampleValue_d.slice(0, 10).reverse();

		// console.log(sampleValue);
		// console.log(OTU_id_d);
		// console.log(OTU_label_d);

		// Bar Chart Plot Specs
			var trace = {
			x: sampleValue,
			y: OTU_id_d.map(outId => `OTU ${outId}`),
			text: OTU_label_d,
			type: "bar",
            orientation: "h",
            marker: {
                opacity: 0.6
            }
		};
		
		var data_bar = [trace];

		// Bar Chart Layout
		var layout_bar = {
			title: `<b>OTUs Top 10 Sample Values<b>`,
			xaxis: { title: "Sample Value"},
			yaxis: { title: "OTU ID"},
			autosize: false,
            width: 600,
			height: 550
		}
		
		Plotly.newPlot("bar", data_bar, layout_bar);

		// Bubble Chart Specs
		var traceA = {
			x: OTU_ids_d,
			y: sampleValue_d,
			text: OTU_labels_d,
			mode: 'markers',
			marker: {
				color: OTU_ids_d,
				size: sampleValue_d
			}
		};

		var data_bubble = [traceA];

		var layout_bub = {
			title: '<b>Bubble Chart: Sample Values for OTU<b>',
			xaxis: { title: "OTU ID"},
			yaxis: { title: "Sample Value"},
			showlegend: false,
		};

		Plotly.newPlot('bubble', data_bubble, layout_bub);

		// Calling metadata for Demographic Info
		demo_info = data.metadata.filter(sample => sample.id === 940)[0];
		
		// Appending Demographic Info to id: sample-metadata in html file
		Object.entries(demo_info).forEach(
			([key, value]) => d3.select("#sample-metadata")
				.append("p").text(`${key}: ${value}`));

		// Plotting Gauge Chart for Navel Washing Frequency
		var wfreq_d = demo_info.wfreq;

		var data_gauge = [
			{
				domain: { x: [0, 1], y: [0, 1] },
				value: wfreq_d,
				title: {text: '<b>Navel Washing Frequency</b>'},
				type: "indicator",
				mode: "gauge+number",
				gauge: {
					axis: { range: [null, 9] },
					steps: [
						{ range: [0, 1], color: 'rgb(204, 255, 238)' },
						{ range: [1, 2], color: 'rgb(179,,255, 204)' },
						{ range: [2, 3], color: 'rgb(128, 255, 170)' },
						{ range: [3, 4], color: 'rgb(77, 255, 136)' },
						{ range: [4, 5], color: 'rgb(25, 255, 102)' },
						{ range: [5, 6], color: 'rgb(0, 230, 77)' },
						{ range: [6, 7], color: 'rgb(0, 179, 60)' },
						{ range: [7, 8], color: 'rgb(0, 153, 51)' },
						{ range: [8, 9], color: 'rgb(0, 128, 43)' },
					],
				}
			}
		];

		var layout_gauge = { width: 600, height: 450, margin: { t: 0, b: 0 } };

		Plotly.newPlot('gauge', data_gauge, layout_gauge);
	}

	init();


	// Turing on drop-down menu for Subject ID bar.
	d3.selectAll("#selDataset").on("change", plot_update);

	function plot_update() {
		
			var user_input = d3.select("#selDataset");
			var id_value = user_input.property("value");
			// console.log(id_value);

		// Filtering the data based on id
			dataset = data.samples.filter(sample => sample.id === id_value)[0];
			OTU_ids_total = dataset.otu_ids;
			OTU_labels_total = dataset.otu_labels;
            Sample_value_total = dataset.sample_values;

		// Slicing Top 10 Sample Values (in reverse order for plotting bar chart)
		    topten_ids = OTU_ids_total.slice(0, 10).reverse();
		    topten_labels = OTU_labels_total.slice(0, 10).reverse();
            topten_values = Sample_value_total.slice(0, 10).reverse();
		
		    Plotly.restyle("bar", "x", [topten_values]);
		    Plotly.restyle("bar", "y", [topten_ids.map(OTUID => `OTU ${OTUID}`)]);
		    Plotly.restyle("bar", "text", [topten_labels]);
		
		    Plotly.restyle('bubble', "x", [OTU_ids_total]);
		    Plotly.restyle('bubble', "y", [Sample_value_total]);
		    Plotly.restyle('bubble', "text", [OTU_labels_total]);
		    Plotly.restyle('bubble', "marker.color", [OTU_ids_total]);
		    Plotly.restyle('bubble', "marker.size", [Sample_value_total]);


        // Populating Demographics bar
        d3.select("#sample-metadata").html("");
		
		meta_info = data.metadata.filter(sample => sample.id == id_value)[0];
		
		Object.entries(meta_info).forEach(([key, value]) => d3.select("#sample-metadata").append("p").text(`${key}: ${value}`));

		var wfreq = meta_info.wfreq;

		Plotly.restyle('gauge', "value", wfreq);
	}
});
