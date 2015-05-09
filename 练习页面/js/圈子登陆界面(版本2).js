/**
 * 以后写代码前一定要先把逻辑理清楚，
 * 比如一共有多少种不同情况，又有哪些情况可以合并到一起写
 * 几种情况合并在一起可以大量压缩代码
 */
$(document).ready(function($) {
	var $slide = $("#slide"),
		$login = $("#login"),
		$signIn = $("#signIn");

	$("#loginButton").click(function() {
		if(!isActing())
			act($login,$signIn);
	});
	$("#signInButton").click(function() {
		if(!isActing())
			act($signIn,$login);
	});
	/* 是否在移动 */
	function isActing(){
		return $slide.is(":animated")||$login.is(":animated")||$signIn.is(":animated");
	}
	/* 开始移动 */
	function act(target,check){
		if(target.css("display")!="none"){
			target.slideUp();
			setTimeout(function(){
				$slide.slideDown();
			}, 500);
		}else{
			check.slideUp();
			$slide.slideUp();
			setTimeout(function(){
				target.slideDown();
			}, 500);
		}
	}
});