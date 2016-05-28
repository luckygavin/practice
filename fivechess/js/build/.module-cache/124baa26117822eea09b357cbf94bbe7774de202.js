var playing = true;
var step = 1; //记录接下来落下的是黑子还是白子,1-黑子,2-白子
var player = []; //用于存储两玩家分别用什么棋子
var desk = []; //用于保存棋盘上的所有棋子点状态,0-无棋子,1-黑子,2-白子
for(var i=0;i<15;i++){
	desk[i] = [];
	for(var j=0;j<15;j++){
		desk[i][j] = 0;
	}
}
var setDesk = function(x, y){
	desk[x][y] = step;
}
/**
* 数据结构1：
* 赢法数组,三维数组,记录了所有的赢法,前两维为棋盘坐标
* 最后一维为赢法标号(5个坐标为一组,每个标号有且仅在5个坐标中出现)
*/
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
/**
 * 数据结构2：
 * 黑白棋各种赢法的计分
 * 一维数组，记录了所有赢法在棋盘上已有的棋子数
 */
var blackWins = [];
var whiteWins = [];
for(var i=0;i<=count;i++){
	blackWins[i] = 0;
	whiteWins[i] = 0;
}
/**
 * 数据结构3：
 * 分析战局，给每个棋子位置计分
 * 黑白棋都需要分别计分，最后加和
 */
var blackScore = [];
var whiteScore = [];
var resetScore = function(){
	for(var i=0;i<15;i++){
		blackScore[i] = [];
		whiteScore[i] = [];
		for(var j=0;j<15;j++){
			blackScore[i][j] = 0;
			whiteScore[i][j] = 0;
		}
	}
}

/**
 * 计算输赢
 */
var calcWinner = function(x, y){
	// 根据落子坐标取出所有有关赢法
	var relateWin = wins[x][y];
	if(step==1){
		var current = blackWins;
		var opposite = whiteWins;
	}else{
		var current = whiteWins;
		var opposite = blackWins;
	}
	// 遍历相关赢法的分数
	relateWin.map(function(value,index){
		current[value]++;
		opposite[value]=6; 		
		if(current[value]==5){
			playing = false;
			alert(player[step]+" win! Game over.");
			return;
		}
	})
	//切换下一步玩家落子状态
	step = step%2+1; 
}
/**
 * 计算最佳落子位置
 */
var calcPoint = function(){
	resetScore();
	if(step==1){
		var current = blackWins;
		var opposite = whiteWins;
	}else{
		var current = whiteWins;
		var opposite = blackWins;
	}
	var max = 0;
	var x=y=7;
	for(var i=0;i<15;i++){
		for(var j=0;j<15;j++){
			if(desk[i][j]==0){
				var currentScore = 0;
				var oppositeScore = 0;
				wins[i][j].map(function(value,index){
					var num = current[value];
					switch(num){
						case 1: currentScore += 1;
						case 2: currentScore += 10;
						case 3: currentScore += 100;
						case 4: currentScore += 1000;
					}
					var numo = opposite[value];
					switch(numo){
						case 1: oppositeScore += 2;
						case 2: oppositeScore += 12;
						case 3: oppositeScore += 120;
						case 4: oppositeScore += 2000;
					}
				});
				if(currentScore>max){
					max = currentScore;
					x = i;
					y = j;
				}
				if(oppositeScore>max){
					max = oppositeScore;
					x = i;
					y = j;
				}
			}
		}
	}

	return {x:x, y:y};
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
				var x = this.props.x;
				var y = this.props.y;
				setDesk(x, y);	// 在棋盘上添加一个棋子
				calcWinner(x, y); // 落子成功，计算输赢
				this.props.nextStep(); // 通知父组件下一步棋
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
				td.push(React.createElement(Piece, {ref: num, key: num, x: i, y: j, nextStep: this.AIStep}));
				num++;
			}
			tr.push(td);
		}
		return {desk: tr};
	},
	AIStep: function(){
		if(!playing) return;
		var point = calcPoint(); // 计算落子
		// 落子
		var x = point.x;
		var y = point.y;
		var num = x*15+y;
		var piece = this.refs[num];
		if(piece.state.piece==0){
			piece.setState({piece:step},function(){
				setDesk(x,y);	// 在棋盘上添加一个棋子
				calcWinner(x,y); // 落子成功，计算输赢
			});
		}else{
			console.log("ERROR");
		}
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
			player[1] = "You";
			player[2] = "Computer";
		}else{
			player[1] = "Computer";
			player[2] = "You";
		}
		return (
			React.createElement("div", {className: "info", id: "info"}, 
				React.createElement(Player, {identity: "Computer", piece: computer}), 
				React.createElement(Player, {identity: "Your", piece: you})
			)
		);
	}	
});

/**
 * 右侧聊天栏
 */
var Chat = React.createClass({displayName: "Chat",
	render: function(){
		return (
			React.createElement("div", {className: "talk", id: "chat"})
		);
	}
});

/**
 * 整个房间
 */
var Room = React.createClass({displayName: "Room",
	render: function(){
		return (
			React.createElement("div", null, 
				React.createElement(Players, null), 
				React.createElement(ChessDesk, null), 
				React.createElement(Chat, null), 
				React.createElement("div", {className: "clearfix"})
			)
		);
	}
});
/**
 * 渲染界面
 */
ReactDOM.render(
	React.createElement(Room, null),
	document.getElementById('chess')
);