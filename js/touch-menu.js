$(document).ready(function(){
var a=$("#touch-menu"),b=$("nav");
$(a).on("click",function(a){
a.preventDefault(),b.slideToggle()
}),
$(window).resize(function(){
var a=$(window).width();
a>760&&b.is(":hidden")&&b.removeAttr("style")
})
});