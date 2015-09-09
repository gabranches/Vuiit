// ----  Event Handlers ---- //

// Clear input on focus
$("#input-sub").focus(function() {		
	$(this).attr("placeholder","");
});

// Subreddit  submit on focus out
$("#input-sub").submit(function(e) { 	
	addSub($("#input-sub").val());
});

// Add subreddit on enter
$("#input-sub").keypress(function (e) {
  if (e.which == 13) {
    addSub($("#input-sub").val());
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
$(window).scroll(function () {		
   if ($(window).scrollTop() >= $(document).height() - $(window).height() - 10) {	
		getItems(sub, sort);
   }
});

// Make picbox div a link
$(document).on("click", ".picbox", function(){ 		
  window.open = $(this).find("#extlink").attr("href"); 
});