var playing = true;
var chessDesk = []; //用于保存棋盘上的所有棋子点
var step = 1; //记录接下来落下的是黑子还是白子,1-黑子,2-白子
var piece = []; //用于存储两玩家分别用什么棋子
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
		var current = blackScore;
		var opposite = whiteScore;
	}else{
		var current = whiteScore;
		var opposite = blackScore;
	}
	// 遍历相关赢法的分数
	relateWin.map(function(value,index){
		current[value]++;
		opposite[value]=6; 		
		if(current[value]==5){
			playing = false;
			alert(piece[step]+" win! Game over.");
			return;
		}
	})
	//切换下一步玩家落子状态
	step = step%2+1; 
}
/**
 * AI下一步落子计算
 * 落子函数通过调用本函数的ChessDesk组件实现
 */
var AIStep = function(putPiece){
	// 计算落子

	// 落子
	putPiece(1,1);
}

/**
 * 以下为视图组件
 */
var Piece = React.createClass({displayName: "Piece",
  	getInitialState:function(){
			return {piece:0}; //piece:0-没有棋子,1-黑子,2-白子
	},
	putPiece: function(){
		if(!playing) return;
		if(this.state.piece==0){
			this.setState({piece:step},function(){
				calcWinner(this.props.x, this.props.y);
				// 通知父组件下一步棋
				this.props.nextStep();
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
				td.push(React.createElement(Piece, {ref: num, key: num, x: i, y: j, nextStep: this.nextStep}));
				num++;
			}
			tr.push(td);
		}
		chessDesk = tr;
		return {desk: tr};
	},
	nextStep: function(){
		if(!playing) return;
		var that = this;
		AIStep(function(x,y){
			var num = x*15+y;
			that.refs[num].setState({piece:step},function(){
				calcWinner(x,y);
			});
		});	
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
	render: function(){
		var color;
		if(this.props.piece == 1){
			color = 'black';
		}else{
			color = 'white';
		}
		return (
			React.createElement("p", null, this.props.identity, " pieces is ", color, ".")
		);
	}	
});
var Players = React.createClass({displayName: "Players",
	render: function(){
		var computer = Math.random()>0.5 ? 1 : 2;
		var you = computer%2+1;
		if(you==1){
			piece[1] = "You";
			piece[2] = "Computer";
		}else{
			piece[1] = "Computer";
			piece[2] = "You";
		}
		return (
			React.createElement("div", null, 
				React.createElement(Player, {identity: "Computer", piece: computer}), 
				React.createElement(Player, {identity: "Your", piece: you})
			)
		);
	}	
});
ReactDOM.render(
	React.createElement(Players, null),
	document.getElementById('info')
);