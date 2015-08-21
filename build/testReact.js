

 /*=================================================
 =            Charting Helper Functions            =
 =================================================*/

 //random character generator.
 function getCharacter(){
   var character = "";
   character = String.fromCharCode(Math.floor( Math.random() * 26) + "a".charCodeAt(0));
   return character;
 }


 /*====================================
 =            Spiral Print            =
 ====================================*/

 function getIndex(array,value) {
   for (var i = 0; i < array.length; i ++) {
     if (_.isEqual(array[i],value)){
       return i;
     }
   }
 }

 function printSpiral(matrix, printFunc) {

    var layers = Math.ceil(Math.min(matrix.length, matrix[0].length)/2);
    var baseWidth = matrix[1].length;
    var baseHeight = matrix.length;
    for (var i = 0; i < layers; i++) {
        printLayer(i,i, baseWidth - 2*i, baseHeight - 2*i);
    }

    //print layer via 4 parts using 8 indexes.
    function printLayer(x,y,w,h) {

        //right
        var rightStart = [x,y];
        var rightEnd = [x,y+w-1];

        for (var a = rightStart[1]; a <= rightEnd[1]; a++ ) {
            printFunc(rightStart[0],a);
        }
        //down
        var downStart = [x+1, y+w-1];
        var downEnd = [x+h-1, y+w-1];

        for (var a = downStart[0]; a <= downEnd[0]; a++ ) {
            printFunc(a,downStart[1]);
        }
        //left
        var leftStart = [x+h-1, y+w-2]
        var leftEnd = [x+h-1, y];

        for (var a = leftStart[1]; a >= leftEnd[1]; a-- ) {
            printFunc(leftStart[0],a);
        }
        //up
        var upStart = [x+h-2, y];
        var upEnd = [x+1, y];

        for (var a = upStart[0]; a >= upEnd[0]; a-- ) {
            printFunc(a,upStart[1]);
        }

    }

}

function getCharacter(){
  var character = "";
  character = String.fromCharCode(Math.floor( Math.random() * 26) + "a".charCodeAt(0));
  return character;
}

function printSpiral(matrix, printFunc) {

    var layers = Math.ceil(Math.min(matrix.length, matrix[0].length)/2);
    var baseWidth = matrix[1].length;
    var baseHeight = matrix.length;
    for (var i = 0; i < layers; i++) {
        printLayer(i,i, baseWidth - 2*i, baseHeight - 2*i);
    }

    //print layer via 4 parts using 8 indexes.
    function printLayer(x,y,w,h) {

        //right
        var rightStart = [x,y];
        var rightEnd = [x,y+w-1];

        for (var a = rightStart[1]; a <= rightEnd[1]; a++ ) {
            printFunc(rightStart[0],a);
        }
        //down
        var downStart = [x+1, y+w-1];
        var downEnd = [x+h-1, y+w-1];

        for (var a = downStart[0]; a <= downEnd[0]; a++ ) {
            printFunc(a,downStart[1]);
        }
        //left
        var leftStart = [x+h-1, y+w-2]
        var leftEnd = [x+h-1, y];

        for (var a = leftStart[1]; a >= leftEnd[1]; a-- ) {
            printFunc(leftStart[0],a);
        }
        //up
        var upStart = [x+h-2, y];
        var upEnd = [x+1, y];

        for (var a = upStart[0]; a >= upEnd[0]; a-- ) {
            printFunc(a,upStart[1]);
        }

    }

}

var SpiralBlock = React.createClass({displayName: "SpiralBlock",

    getInitialState: function(){
        return { isRunning: false };
    },

    componentDidMount: function(){
        var el = this.getDOMNode();
        // console.log("thigns: ", $(el).height(), $(el).width());

        var svg = d3.select(el)
                    .append('svg')
                    .attr('height','100%')
                    .attr('width', '100%');

        var radius = this.props.radius;
        var width = $(el).find('svg').width();
        var height = $(el).find('svg').height();
        var numColumns = Math.floor(width / (2*radius) );
        var numRows = Math.floor(height/(2*radius));

        var data = _.range(numRows-1).map(function(){
                return _.range(numColumns).map(getCharacter);
        });

        var row = svg.selectAll('g.row')
                     .data(data)
                     .enter()
                     .append('g').attr("class", "row")
                     //vertical offset
                     .attr('transform', function(d, i){return 'translate(0,'+ (((i+1) * radius * 2)) +')';});

        var circleGroups = row.selectAll("g.circle")
                        .data(function(d){ return d; })
                        .enter()
                        .append("g").attr("class", "circle")
                        //horizontal offset, transform is offset by totalRadius as default position is circles center.
                        .attr('transform', function(d, i){return 'translate('+ (((i+1) * radius * 2) - radius) +',0)';});

        this.circles = circleGroups
             .append('circle')
             .style("stroke", "white")
             .style("stroke-width", 2 )
             .style("fill", function(d,i) {
                return "#2274A5";
              })
             .attr('r', radius);

        var indexes = [];
        var addToIndex = function(x,y){
          indexes.push([x,y]);
        }
        printSpiral(data, addToIndex);

        setTimeout(this.animateIndex.bind(null,indexes), 1000);

    },

    animateIndex: function (indexes) {
        var eachNodeDelay = 20;
        var duration = 100;

        this.circles
           .transition()
           .duration(duration)
           .delay(function(d,j,i){
               return eachNodeDelay * getIndex(indexes,[i,j]);
           })
           .style("fill", "#white")
           .transition()
           .duration(duration)
           .style("fill", function(d,i,j){
              return "#red";
           });
    },

    componentWillUnmount: function(){

    },

    render: function() {

        return React.createElement("span", null);
    }

});


for (var i = 1; i <= 4; i++) {

    React.render(
        React.createElement(SpiralBlock, {radius: i*8}),
        $("#spiral" + i)[0]
    );

};