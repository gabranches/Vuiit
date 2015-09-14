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

// Goto sub
$(document).on("click", ".sub-link", function(){
	var sublink = $(this).parent().attr('sub-id');
	window.location.href = '/r/' + sublink;	
});


// Remove sub
$(document).on("click", ".remove-button", function(){
	if (events == 1){
		removeSub($(this).attr('sub-id'));
		$(this).parent().parent().remove();
		if (subs.length == 0){
			refreshSub(null, sort);
		} else {
			refreshSub(subs.join('+'), sort);
		}
	}
});

// Show Remove button
$(document).on("mouseenter", ".sub", function(){  
	$(this).find(".remove-button").show();
});

// Hide Remove button
$(document).on("mouseleave", ".sub", function(){ 	
	$(this).find(".remove-button").hide();
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
   		if (events == 1){
			getItems(sub, sort);
   		}
   }
});

// Share
$(document).on("click", "#share", function(){
		$("#share-link").hide();
		$("#share-load").show();
		$.ajax({
			url: "/ajax/share?link=" + subs.join(','),
			success: function(data){
				$("#share-load").hide();
				$("#share-link").show();
				$("#share-link").val("http://127.0.0.1/g/" + data);				
			}
		});
});

// Make picbox div a link
$(document).on("click", ".picbox", function(){ 		
  window.open = $(this).find("#extlink").attr("href"); 
});

$(window).resize(function(){
	resize();
});