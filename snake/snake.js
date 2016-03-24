$(document).ready(function(){
	/* 一些全局变量，用于控制snake的属性，比如速度	 */
	var width=400;	//框的宽度
	var level=10;	//默认级别
	var speed=300;	//爬行速度初始值
	var timeout=speed; 	//爬行速度
	var keepOn=true;	//开始、停止
	var direction = 'right';	//初始方向
	var target;	 	//食物
	
	/* 与用户交互的所有事件	 */
	$(".start").click(function(){
		init();
		createTarget();
		setTimeout(function(){
			moveNode();	
		},timeout);
	});
	$(".end").click(function(){
		keepOn=false;
	});
	$(".restart").click(function(){
		location.reload();
	});
	$(".level").change(function(){
		var l=$(".level").val();
		level=10*l;
		switch(l){
			case '1': $(".speed").val("1");
				 timeout=speed;
				 break;
			case '2': $(".speed").val("2");
				 timeout=speed/2;
				 break;
			default: $(".speed").val("2");
				 timeout=speed/3;
				 break;
		}
	});
	$(".speed").change(function(){
		var s=$(".speed").val();
		timeout=speed/s;
	});
	$(document).keypress(function(event){
		//119 上  115 下  97 左  100右
		switch(event.keyCode){
			case 119: if(direction!='bottom') direction='top'; break;
			case 115: if(direction!='top') direction='bottom'; break;
			case 97: if(direction!='right') direction='left'; break;
			case 100: if(direction!='left') direction='right'; break;
			default : '';
		}
		//console.log(direction);
	});


	/**	下面是一些函数，用于处理逻辑关系*/
	/* 创建一个蛇身体节点 */
	function createNode(top,left){
		var node=new Object();
		node.top=top;
		node.left=left;
		return node;
	}
	/* 初始化蛇身体 */
	function init(){
		$(".main").empty();
		var nodeOne=createNode(0,0);
		var nodeTwo=createNode(0,10);
		var nodeThree=createNode(0,20);
		append(nodeOne);
		append(nodeTwo);
		append(nodeThree);
	}
	/* 蛇往前爬的函数 */
	function moveNode(){
		var move=$(".snake").first();
		var end=$(".snake").last().prev();
		var top,left;
		if(direction=='right'){
			top=end.css("top");
			left=parseInt(end.css("left"))+10;
		}if(direction=='left'){
			top=end.css("top");
			left=parseInt(end.css("left"))-10;
		}if(direction=='top'){
			top=parseInt(end.css("top"))-10;
			left=end.css("left");
		}if(direction=='bottom'){
			top=parseInt(end.css("top"))+10;
			left=end.css("left");
		}
		//把像素重新转换为数字方便计算
		left=parseInt(left);
		top=parseInt(top);
		//超出边界处理
		if(left<0 || left>width-10 || top<0 || top>width-10 ){
			alert("you lose");
			return false;
		}
		//吃掉target,产生一个新的target
		if(left==target.left&&top==target.top){
			createTarget();
			//如果吃到规定的个数，则you win
			if($(".snake").length>level+3){
				alert("you win");
				return true;				
			}
		}

		move.remove();
		move=createNode(top,left);
		addBefore(move);
		if(keepOn){
			setTimeout(function(){
				moveNode();
			},timeout);
		}
	}
	/* 蛇吃到食物后产生一个新食物 */
	function createTarget(){
		var top = Math.ceil(Math.random()*10)*width/10-10;
		if(!top<0) top = Math.ceil(Math.random()*10)*width/10-10; //取0的几率极小,如果是0就重新取一遍
		var left = Math.ceil(Math.random()*10)*width/10-10;
		if(left<0) left = Math.ceil(Math.random()*10)*width/10-10;
		target = createNode(top,left);
		append(target);
	}
	/* 把新节点放在最后（用来放置食物） */
	function append(node){
		var div='<div class="snake" style="top:'+node.top+';left:'+node.left+';"></div>';
		$(".main").append(div);
	}
	/* 把新节点放在倒第二 (用来移动蛇身) */
	function addBefore(node){
		var div='<div class="snake" style="top:'+node.top+';left:'+node.left+';"></div>';
		$(".snake").last().before(div);
	}
});