$(document).ready(function() {
	var main = $(".main");
	$(".left ul li").click(function() {
		var i = $(this).val();
		var move = -290 * i;
		main.animate({top:move},400);
		$(".left ul li").removeClass('on')
		$(this).addClass('on');
	});
});