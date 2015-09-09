// ----  Event Handlers ---- //

// Clear input on focus
$("#input-sub").focus(function() {		
	$(this).attr("placeholder","");
});

// Add subreddit on enter
$("#input-sub").keypress(function (e) {
	if (e.which == 13) {
		addSub($("#input-sub").val());
		refreshSub(subs.join('+'), sort);
		$("#input-sub").val('');
		$("#input-sub").attr("placeholder","Enter a Subreddit");
	}
});

// Dropdown submit
$("#select-sub").change(function() { 	
	sub = $("#select-sub").find(":selected").text();
	window.location.href = sub;
});

// Remove sub
$(document).on("click", ".sub", function(){
	console.log('click');
	removeSub($(this).attr('sub-id'));
	$(this).remove();
	if (subs.length == 0){
		refreshSub(null, sort);
	} else {
		refreshSub(subs.join('+'), sort);
	}
});

// Dropdown submit
$("#select-sort").change(function() { 	
	sort = $("#select-sort").find(":selected").val();
	refreshSub(sub, sort);
});

// Pic info box show
$(document).on("mouseenter", ".picbox", function(){  
	$(this).find(".infobox").show();
});

// Pic info box hide
$(document).on("mouseleave", ".picbox", function(){ 	
	$(this).find(".infobox").hide();
});

// Page scroller
$("#gallery").scroll(function () {		
   if ($("#gallery").scrollTop() >= $("#col-1").height() - $("#gallery").height()) {	
		getItems(sub, sort);
   }
});

// Make picbox div a link
$(document).on("click", ".picbox", function(){ 		
  window.open = $(this).find("#extlink").attr("href"); 
});

$(window).resize(function(){
	resize();
});