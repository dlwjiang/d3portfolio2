function barChart(){

   var margins = {left:50, top:50, right:50, bottom:50};

   var data = [1,2,3,4,5];
   var selection = null;
   //number of ms between each animation.
   var animationSpeed = 100;
   //read-only
   var width, height, xScale;

   function draw(newData){

     if (newData) {
       data = newData;
     }

     width = $(selection).width() - margins.left - margins.right;
     height = $(selection).height() * 0.8 - margins.top - margins.bottom;
     var columnCount = data.length;

     //ticks every 50 px.
     var ticks;

     /*=============================
     =            Setup            =
     =============================*/
     /*
      Initialize selector groups, delete remaining charting to the "update" function.
        svg        : main chart chart-area.
        xAxisGroup : x axis.
        yAxisGroup : y axis.
      */
     var svg = d3.select(selection)
                 .append("svg")
                 .attr("width", width + margins.left + margins.right)
                 .attr("height", height + margins.top + margins.bottom)
                .append("g")
                 .attr("class", "svg-group")
                 .attr("width", width)
                 .attr("height", height)
                 .attr("transform", "translate(" + margins.left + "," + margins.top + ")");


     xScale = d3.scale.ordinal();
     var xAxis = d3.svg.axis().orient("bottom");

     var yScale = d3.scale.linear();
     var yAxis = d3.svg.axis()
                   .orient("left")
                   .ticks(ticks)
                   .outerTickSize(0);

     var xAxisGroup = svg.append("g")
                         .attr("class", "x axis")
                         .attr("transform", "translate(0," + height + ")");

     var yAxisGroup = svg.append("g").attr("class", "y axis");

     update();

     /*========================================
     =            Helper Functions            =
     ========================================*/
     function update (newData) {

       if (newData) data = newData;

       var yValMax = d3.max(data, function (each) {
         return each.value;
       })

       /*==================================
       =            Update SVG            =
       ==================================*/

       var newWidth = $(selection).width();
       var newHeight = $(selection).height() * 0.8;

       //set minimum width/height
       minLength = 200;
       newWidth = newWidth > minLength ? newWidth: minLength;
       newHeight = newHeight > minLength ? newHeight: minLength;

       width = newWidth - margins.left - margins.right;
       height = newHeight - margins.top - margins.bottom;

       ticks = height/50;

       d3.select(selection + " svg")
         .attr("width", width + margins.left + margins.right)
         .attr("height", height + margins.top + margins.bottom)

       d3.select(selection + ".svg-group")
         .attr("width", width)
         .attr("height", height)
         .attr("transform", "translate(" + margins.left + "," + margins.top + ")");

       /*=================================
       =       Update Scales             =
       ==================================*/
       xScale.domain(_.pluck(data, "label"))
             .rangeRoundBands([0,width],0.2,0.4);
       xAxis.scale(xScale);

       //round upwards to 2 significant digits. nearest x5xx.
       // e.g. 1230 -> 1500, 888 -> 1000
       // function findUpperMax(num){
       //   var numDigits = Math.floor(num).toString().length;
       //   var secondDigit = parseInt(Math.floor(num).toString()[1]);
       //   var multiplier = Math.pow(10,numDigits-1);
       //   if (secondDigit >= 5){
       //     return Math.ceil(num/multiplier) * multiplier;
       //   } else {
       //     return Math.floor(num/multiplier) * multiplier + 5 * (multiplier/10);
       //   }
       // }

       yScale.domain([0,yValMax]).range([Math.ceil(height),0]);
       yAxis.scale(yScale).ticks(ticks);

       xAxisGroup.attr("transform", "translate(0," + height + ")")
                 .call(xAxis);

       _rotateXLabels();

       yAxisGroup.call(yAxis);

       //resize text to be as large as possible.
       // d3.selectAll(selection + " .x .tick > text")
       //   .style("font-size", function (d) {
       //     return xScale.rangeBand()*1.5/this.innerHTML.length + "px";
       //   });

       /*============================
       =      Update Bars           =
       ============================*/
       var newGroups = svg.selectAll("g.bars")
                       .data(data, function (d) {
                         return d.label;
                       });
       //EXIT
       //=================================
       newGroups.exit()
         .transition().duration(500)
          .attr('transform', "translate(-1000,0)")
          .remove();

       //UPDATE
       //=================================
       newGroups.transition().duration(200)
             .attr("transform", function (d,i) {
               return "translate(" + xScale(d.label) + ",0)";
             });

       newGroups.select("rect")
           .transition().duration(200)
           .delay(function (d,i) {
             return i * animationSpeed;
           })
           .attr("y",function (d) {
             return yScale(d.value);
           })
           .attr("height", function (d) {
             return height - yScale(d.value);
           })
           .attr("width", xScale.rangeBand());

       newGroups.select("text")
           .transition().duration(200)
           .attr("y",function (d) {
             return yScale(d.value) - 5;
           })
           .attr("font-size",function (d) {
             return xScale.rangeBand()*1.5/d.label.length + "px";
           })

       //ENTER
       //=================================
       var enterGroup = newGroups.enter()
               .append("g")
               .attr("class", "bars");

       //add rects
       enterGroup
           .append("rect")
           .attr("y",function (d) {
             return yScale(d.value);
           })
           .attr("height", function (d) {
             return height - yScale(d.value);
           })
           .attr("width", xScale.rangeBand());
           // .attr("fill", "#888");

       //add labels
       enterGroup.append("text")
                 .attr("y", function (d) {
                   return yScale(d.value) - 5;
                 })
                 .attr("font-size",function (d) {
                   return xScale.rangeBand()*1.5/d.label.length + "px";
                 })
                 .attr("fill", "#888")
                 .text(function(d) {
                   return d.label;
                 });

       //transition groups in from right to left
       enterGroup.attr("transform", function (d,i) {
                     return "translate(2000,0)";
                   })
                 .transition().duration(500)
                 //slide in after update finishes.
                 .delay(function (d,i) {
                   return i * animationSpeed;
                 })
                 .attr("transform", function (d,i) {
                   return "translate(" + xScale(d.label) + ",0)";
                 })

     }

     function _rotateXLabels() {
       if (width < 800) {
         xAxisGroup.selectAll("text")
                   .attr("dy", ".35em")
                   .attr("transform", "rotate(40)")
                   .style("text-anchor", "start");
       } else {
         xAxisGroup.selectAll("text").attr("transform", "rotate(0)");
       }
     }

     draw.update = update;


   }

   draw.data = function(value) {
       if (!arguments.length) return data;
       data = value;
       return draw;
   };

   draw.target = function (value) {
       if (!arguments.length) return selection;
       selection = value;
       return draw;
   }

   draw.animationSpeed = function (value) {
       if (!arguments.length) return animationSpeed;
       animationSpeed = value;
       return draw;
   }

   draw.replaceChart = function (newData) {
     $(selection).empty();
     draw(newData);
   };

   //read only
   draw.width = function () {
     return width;
   }
   draw.height = function () {
     return height;
   }
   draw.xScale = function () {
     return xScale;
   }

   $(window).on("resize",_.debounce(function () {
      draw.update();
   },200));

   return draw;
}