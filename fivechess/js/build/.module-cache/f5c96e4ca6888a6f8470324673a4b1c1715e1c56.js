var step = 1; //记录接下来落下的是黑子还是白子,1-黑子,2-白子
//赢法数组,三维数组,记录了所有的赢法,前两维为棋盘坐标,最后一维为赢法标号(5个为一组,每个标号有且仅有5个)
var wins = []; 
for(var i=0;i<15;i++){
	wins[i] = [];
	for(var j=0;j<15;j++){
		wins[i][j] = [];
	}
}
// 初始化所有赢法
var count = 0;
for(var i=0;i<11;i++){
	for(var j=0;j<15;j++){
		for(var k=0;k<5;k++){
			wins[i+k][j][count] = 0;
		}
		count++;
	}
}
for(var i=0;i<15;i++){
	for(var j=0;j<11;j++){
		for(var k=0;k<5;k++){
			wins[i][j+k][count] = 0;
		}
		count++;
	}
}
for(var i=0;i<11;i++){
	for(var j=0;j<11;j++){
		for(var k=0;k<5;k++){
			wins[i+k][j+k][count] = 0;
		}
		count++;
	}
}
for(var i=14;i>=4;i--){
	for(var j=0;j<11;j++){
		for(var k=0;k<5;k++){
			wins[i-k][j+k][count] = 0;
		}
		count++;
	}
}
console.log(count);
// 两个玩家各种赢法的计分
var yourScore = [];
var rivalScore = [];
for(var i=0;i<=count;i++){
	yourScore[i] = 0;
	rivalScore[i] = 0;
}




var Piece = React.createClass({displayName: "Piece",
  	getInitialState:function(){
			return {piece:0}; //piece:0-没有棋子,1-黑子,2-白子
	},
	putPiece: function(){
		var piece = step;
		this.setState({piece:piece},function(){
			step = step%2+1; //切换下一步玩家落子状态
			// console.log(this.props);
			var x = this.props.x;
			var y = this.props.y;
			var abWin = wins[x][y];
			// console.log(abWin);
			abWin.map(function(value,index){
				console.log(index)
			})
		});
	},
  	render: function() {
  		var style = '';
  		if(this.state.piece == 1){
  			style = "black";
  		}else if(this.state.piece == 2){
  			style = "white";
  		}
	    return (
	      	React.createElement("td", {className: style, onClick: this.putPiece})
	    );
  	}
});
var ChessDesk = React.createClass({displayName: "ChessDesk",
	getInitialState: function(){
		var tr=[];
		var num = 0;
		for(var i=0; i<15; i++){
			var td=[];
			for(var j=0; j<15; j++){
				td.push(React.createElement(Piece, {key: num, x: i, y: j}));
				num++;
			}
			tr.push(td);
		}
		return {desk: tr};
	},
	render: function(){
		var desk = this.state.desk;
		return (
			React.createElement("table", null, 
				React.createElement("tbody", null, 
					desk.map(function(tds, index) {
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