/**
 * 感觉这个版本写的太乱了，逻辑不好理清
 * 版本2要好些
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
		if($slide.css("display")!="none"){
			doubleSlide($slide,target);
		}else{
			if(check.css("display")!="none"){
				doubleSlide(check,target);
			}else{
				doubleSlide(target,$slide);
			}
		}
	}
	/* 先后移动两个目标 */
	function doubleSlide(first,then){
		first.slideToggle(400,function(){
			setTimeout(function(){
				then.slideToggle(400);
			}, 100)
		});
	}
});