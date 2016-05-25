var Piece = React.createClass({displayName: "Piece",
  	getInitialState:function(){
			return {piece:0}; //piece:0-没有棋子,1-黑子,2-白子
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
ReactDOM.render(
  React.createElement(CommentBox, null),
  document.getElementById('chess')
);