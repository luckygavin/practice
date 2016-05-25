var Piece = React.createClass({displayName: "Piece",
  	getInitialState:function(){
			return {piece:0}; //piece:0-没有棋子,1-黑子,2-白子
	},
	putPiece: function(){
		this.piece = 1;
	},
  	render: function() {
  		var style = '';
  		if(this.piece == 1){
  			style = "black";
  		}else if(this.piece == 2){
  			style = "white";
  		}
	    return (
	      	React.createElement("td", {class: style, onClick: this.putPiece})
	    );
  	}
});
var ChessDesk = React.createClass({displayName: "ChessDesk",
	getInitialState: function(){
		var tr=[],td=[];
		var num = 0;
		for(var i=0; i<15; i++){
			for(var j=0; j<15; j++){
				td.push(React.createElement(Piece, {key: num}));
				num++;
			}
			tr.push(td);
		}
		console.log(num);
		return {desk: tr};
	},
	render: function(){
		var desk = this.state.desk;
		console.log(desk);
		return (
			React.createElement("table", null, 
				React.createElement("tbody", null, 
					desk.map(function(index, tds) {
						console.log(index);
						return (
							React.createElement("tr", {key: index}, 
								tds
							)
						);
					})
				)
			)
		);
	}
});
ReactDOM.render(
  React.createElement(ChessDesk, null),
  document.getElementById('desk')
);