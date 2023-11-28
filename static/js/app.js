const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

//Function to get the initial data
function getData() {
    //Get data from url
    let bellyButtonData = d3.json(url).then(function(data) {
    console.log(data);

    //Get Names
    let names = Object.values(data.names);

    //Add names to dropdown
    for (i=0; i<names.length; i++){
      d3.select("#selDataset").append("option").text(names[i]);
    }
    
    //Get metadata
    let metadata = Object.values(data.metadata)

    //Get metadata for first item in the dropdown
    for (i=0; i<metadata.length; i++){
      if(metadata[i].id == names[0]) {

        //Add metadata to the dashboard
        d3.select("#sample-metadata").html(`id : ${metadata[i].id} <br>
                                            ethnicity: ${metadata[i].ethnicity} <br>
                                            gender: ${metadata[i].gender}<br>
                                            age:  ${metadata[i].age}<br>
                                            location: ${metadata[i].location}<br>
                                            bbtype:  ${metadata[i].bbtype}<br>
                                            wfreq:  ${metadata[i].wfreq}`);               
      }
    }
    
    //Get samples
    let samples = Object.values(data.samples);

    //Get samples for first item in the dropdown
    for (i=0; i<samples.length; i++){
      if(samples[i].id == names[0]) {

      //Get top 10 samples
      let slicedSamples = samples[i].sample_values.slice(0, 10);
      let slicedOTU = samples[i].otu_ids.slice(0, 10);
      let slicedLables = samples[i].otu_labels.slice(0, 10);
      
      //Reverse for the horizontal bar chart
      slicedSamples.reverse();
      slicedOTU.reverse();
      slicedLables.reverse();
 
      //Prepare bar chart
      let data = [{
        x: slicedSamples,
        y: slicedOTU.map(otu => "OTU "+otu),
        text: slicedLables,
        type: "bar",
        orientation: "h"
      }]

      //Prepare layout
      let layout = {
        height: 600,
        width: 600
      };
    
      //Add bar plot to the dashboard
      Plotly.newPlot("bar", data, layout);
      
      //Get colors by OTU
      let colors = samples[i].otu_ids.map(item => getcolor(item));

      //Prepare bubble chart
      let data2 = [{
        x: samples[i].otu_ids,
        y: samples[i].sample_values,
        text: samples[i].otu_labels,
        mode: "markers",
        marker : {
          color: colors,
          size: samples[i].sample_values}
      }];

      //Prepare layout
      let layout2 = {
        height: 600,
        width: 1000
      };

      //Add bubble plot to the dashboard
      Plotly.newPlot("bubble", data2, layout2);

    }
  }
})};

//Function to get color based on OTU value
function getcolor(otu_id) {
  otu_id = parseInt(otu_id, 0);
  if (otu_id < 500) {return 'blue';}
  else if (otu_id < 1000) {return 'cyan';}
  else if (otu_id < 1500) {return 'green';}
  else if (otu_id < 2000) {return 'brown';}
  else if (otu_id < 2500) {return 'orange';}
  else if (otu_id < 3000) {return 'red';}
  else {return 'purple';}

}

//Function to update screen following a user dropdown selection
function optionChanged(newValue) {
  //Get data from URL
  let bellyButtonData = d3.json(url).then(function(data) {

    
    let metadata = Object.values(data.metadata)

    //Get metadata for user's choice
    for (i=0; i<metadata.length; i++){
      if(metadata[i].id == newValue) {

        //Add metadata to the dashboard
        d3.select("#sample-metadata").html(`id : ${metadata[i].id} <br>
                                            ethnicity: ${metadata[i].ethnicity} <br>
                                            gender: ${metadata[i].gender}<br>
                                            age:  ${metadata[i].age}<br>
                                            location: ${metadata[i].location}<br>
                                            bbtype:  ${metadata[i].bbtype}<br>
                                            wfreq:  ${metadata[i].wfreq}`);               
      }
    }

    let samples = Object.values(data.samples);

    //Get sample for users's choice
    for (i=0; i<samples.length; i++){

      if(samples[i].id == newValue){

        //Get top 10 samples
        let slicedSamples = samples[i].sample_values.slice(0, 10);
        let slicedOTU = samples[i].otu_ids.slice(0, 10);
        let slicedLables = samples[i].otu_labels.slice(0, 10);

        //Reverse for the horizontal bar chart
        slicedSamples.reverse();
        slicedOTU.reverse();
        slicedLables.reverse();

        //Get values to update
        x = slicedSamples,
        y = slicedOTU.map(otu => "OTU "+otu),
        text = slicedLables

        //Update bar plot on the dashboard
        Plotly.restyle("bar", "x", [x]);
        Plotly.restyle("bar", "y", [y]);
        Plotly.restyle("bar", "text", [text]);


        //Get values to update
        x = samples[i].otu_ids
        y = samples[i].sample_values
        text = samples[i].otu_labels

        let colors = samples[i].otu_ids.map(item => getcolor(item));

        size = samples[i].sample_values

        //Update values on the bubble plot
        Plotly.restyle("bubble", "x", [x]);
        Plotly.restyle("bubble", "y", [y]);
        Plotly.restyle("bubble", "text", [text]);
        Plotly.restyle("bubble", "marker.color", [colors]);
        Plotly.restyle("bubble", "marker.size", [size]);



      }
    }

  })


}


function init() {

  getData();

}

init();