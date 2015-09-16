// ----  Event Handlers ---- //

// Clear input on focus
$("#input-sub").focus(function() {		
	$(this).attr("placeholder","");
});

// Add subreddit on enter
$("#input-sub").keypress(function (e) {
	if (e.which == 13) {
		addSub($("#input-sub").val());
		refreshSub(subs.join('+'));
		$("#input-sub").val('');
		$("#input-sub").attr("placeholder","Enter a Subreddit");
	}
});

// Add gallery name
$("#share-name").keypress(function (e) {
	if (e.which == 13) {
		var name = $("#share-name").val();
		$.ajax({
			url: "/ajax/updatename?name=" + name + "&key=" + state.key,
			success: function(data){
	
			}
		});
	}
});

// Goto sub
$(document).on("click", ".sub-link", function(){
	var sublink = $(this).parent().attr('sub-id');
	window.location.href = '/r/' + sublink;	
});

// Options show text
$("#options-text").click(function(){
	if($(this).is(":checked")){
		options.show_text = true;
	} else {
		options.show_text = false;
	}
	refreshSub();
	createOptionsCookie();
});

// Options show NSFW
$("#options-nsfw").click(function(){
	if($(this).is(":checked")){
		options.show_nsfw = true;
	} else {
		options.show_nsfw = false;
	}
	refreshSub();
	createOptionsCookie();
});

// Remove sub
$(document).on("click", ".remove-button", function(){
	if (state.events == 1){
		removeSub($(this).attr('sub-id'));
		$(this).parent().remove();
		if (subs.length == 0){
			refreshSub(null);
		} else {
			refreshSub(subs.join('+'));
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
	options.sort = $("#select-sort").find(":selected").val();
	refreshSub();
});

// Pic info box show
$(document).on("mouseenter", ".picbox", function(){  
	$(this).find(".infobox").show();
});

// Pic info box hide
$(document).on("mouseleave", ".picbox", function(){ 	
	$(this).find(".infobox").hide();
});

// Auto-loader
// $("#gallery").scroll(function(){
// 	if ($('.load-more').visible(true)){
// 		getItems(sub);
// 	}
// });

// Load more button (in case auto-loader doesn't work)
$(document).on("click", ".load-more", function(){	
	if (state.events == 1){
		getItems();
	}
});

// Share
$(document).on("click", "#share", function(){
		$(".share-load").show();
		$.ajax({
			url: "/ajax/share?link=" + subs.join(','),
			success: function(data){
				state.key = data;
				$(".share-load").hide();
				$(".share-result").show();
				$(".share-button-wrapper").hide();
				$("#share-link").val("http://vast-reef-3750.herokuapp.com/g/" + data);				
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