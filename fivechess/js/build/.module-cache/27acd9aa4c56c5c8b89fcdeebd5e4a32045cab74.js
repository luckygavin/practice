var playing = true;
var step = 1; //记录接下来落下的是黑子还是白子,1-黑子,2-白子
// 赢法数组,三维数组,记录了所有的赢法,前两维为棋盘坐标
// 最后一维为赢法标号(5个坐标为一组,每个标号有且仅在5个坐标中出现)
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
			wins[i+k][j].push(count);
		}
		count++;
	}
}
for(var i=0;i<15;i++){
	for(var j=0;j<11;j++){
		for(var k=0;k<5;k++){
			wins[i][j+k].push(count);
		}
		count++;
	}
}
for(var i=0;i<11;i++){
	for(var j=0;j<11;j++){
		for(var k=0;k<5;k++){
			wins[i+k][j+k].push(count);
		}
		count++;
	}
}
for(var i=14;i>=4;i--){
	for(var j=0;j<11;j++){
		for(var k=0;k<5;k++){
			wins[i-k][j+k].push(count);
		}
		count++;
	}
}
// 黑白棋各种赢法的计分
var blackScore = [];
var whiteScore = [];
for(var i=0;i<=count;i++){
	blackScore[i] = 0;
	whiteScore[i] = 0;
}
/**
 * 计算输赢
 */
var calcWinner = function(x, y){
	// 根据落子坐标取出所有有关赢法
	var relateWin = wins[x][y];
	if(step==1){
		var piece = "Black";
		var first = blackScore;
		var then = whiteScore;
	}else{
		var piece = "White";
		var first = whiteScore;
		var then = blackScore;
	}
	// 遍历相关赢法的分数
	relateWin.map(function(value,index){
		first[value]++;
		then[value]=6; 		
		if(first[value]==5){
			playing = false;
			alert(piece+" win! Game over.");
			return;
		}
	})
	//切换下一步玩家落子状态
	step = step%2+1; 
}
/**
 * AI下一步落子计算
 */
var computerStep = function(){

}

/**
 * 以下为视图组件
 */
var Piece = React.createClass({displayName: "Piece",
  	getInitialState:function(){
			return {piece:0}; //piece:0-没有棋子,1-黑子,2-白子
	},
	putPiece: function(){
		if(playing && this.state.piece==0){
			this.setState({piece:step},function(){
				calcWinner(this.props.x, this.props.y);
			});
		}
				
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

/**
 * 左侧状态栏
 */
var Player = React.createClass({displayName: "Player",
	getInitialState: function(){
		return {identity:0};
	},
	setIndentity: function(step){
		this.setState({identity:step});
	},
	render: function(){
		var color;
		if(this.state.identity == 1){
			color = 'black';
		}else{
			color = 'white';
		}
		return (
			React.createElement("p", null, "Your pieces is ", color, ".")
		);
	}	
});
ReactDOM.render(
	React.createElement(Player, null),
	document.getElementById('info')
);