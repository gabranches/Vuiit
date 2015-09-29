// ----  Event Handlers ---- //

// Clear input on focus
$('#input-sub').focus(function() {		
	$(this).attr('placeholder', '');
});

// Add subreddit on enter
$('#input-sub').keypress(function (e) {
	if (e.which == 13) {
		addSub($('#input-sub').val());
	}
});

// Add gallery name
$(document).on('focusout', '#share-name', function() {
	addGalleryName();
});

$('#share-name').keypress(function (e) {
	if (e.which == 13) {
		addGalleryName();
	}
});

// Show/Hide active subs list
$(document).on('click', '#active-subs-label', function() {
	if (state.active_subs == 1) {
		$('#active-subs-arrow').attr('class', 'glyphicon glyphicon-triangle-right');
		$('#sub-names').hide();
		state.active_subs = 0;
	} else {
		$('#active-subs-arrow').attr('class', 'glyphicon glyphicon-triangle-bottom');
		$('#sub-names').show();
		state.active_subs = 1;
	}
});

// Show/Hide popular subs list
$(document).on('click', '#pop-subs-label', function() {
	if (state.pop_subs == 1) {
		$('#pop-subs-arrow').attr('class', 'glyphicon glyphicon-triangle-right');
		$('#pop-sub-names').hide();
		state.pop_subs = 0;
	} else {
		$('#pop-subs-arrow').attr('class', 'glyphicon glyphicon-triangle-bottom');
		$('#pop-sub-names').show();
		state.pop_subs = 1;
	}
});


// Remove all subs
$(document).on('click', '#remove-all', function() {
	removeAll();
});

// Show update button on change
$('#share-name').focus(function() {
	$('#update-button').show();
});

// Mobile top menu
$('#options-enter').click(function() {
	$('#left-menu').attr('class', 'col-xs-12');
	$('#options-enter').hide();
	$('#options-leave').show();
});

$('#options-leave').click(function() {
	$('#left-menu').attr('class', 'hidden-xs hidden-sm col-md-2 affix-top');
	$('#options-enter').show();
	$('#options-leave').hide();
});

// Goto sub
$(document).on('click', '.sub-link', function() {
	var sublink = $(this).parent().attr('sub-id');
	window.location.href = '/r/' + sublink;	
});

// Edit gallery
$(document).on('click', '#edit-gallery', function() {
	editGallery();
});

// Options show text
$('#options-text').click(function() {
	if($(this).is(':checked')) {
		options.show_text = true;
	} else {
		options.show_text = false;
	}
	refreshSub();
	createOptionsCookie();
});

// Options show NSFW
$('#options-nsfw').click(function() {
	if($(this).is(':checked')) {
		options.show_nsfw = true;
	} else {
		options.show_nsfw = false;
	}
	refreshSub();
	createOptionsCookie();
});

// Remove sub
$(document).on('click', '.remove-button', function() {
	if (state.events == 1) {
		removeSub($(this).attr('sub-id'));
		$(this).parent().remove();
	}
});

// Add sub from popular list
$(document).on('click', '.add-button', function() {
	if (state.events == 1) {
		addSub($(this).attr('sub-id'));
	}
});

// Autocomplete
$('#input-sub').typeahead({
	onSelect: function(item) {
        addSub(item.value);
    },
    ajax: '/static/js/suggestions.js'
});
           
// Show Remove button
$(document).on('mouseenter', '.sub', function() {  
	$(this).find('.remove-button').show();
});

// Hide Remove button
$(document).on('mouseleave', '.sub', function() { 	
	$(this).find('.remove-button').hide();
});

// Show add button
$(document).on('mouseenter', '.pop-sub', function() {  
	$(this).find('.add-button').show();
});

// Hide add button
$(document).on('mouseleave', '.pop-sub', function() { 	
	$(this).find('.add-button').hide();
});

// Dropdown submit
$('#select-sort').change(function() { 	
	options.sort = $('#select-sort').find(':selected').val();
	refreshSub();
});

// Pic info box show
$(document).on('mouseenter', '.picbox', function() {  
	$(this).find('.infobox').show();
});

// Pic info box hide
$(document).on('mouseleave', '.picbox', function() { 	
	$(this).find(".infobox").hide();
});

// Auto-loader
$('#gallery').on('scroll', function() {
    if($(this).scrollTop() + $(this).innerHeight() >= (getMaxColumnHeight() * .60)) {
        if (state.events == 1){
			getItems();
		}
    }
});

// Load more button (in case auto-loader doesn't work)
$(document).on('click', '.load-more', function() {	
	if (state.events == 1) {
		getItems();
	}
});

// Share
$(document).on('click', '#share', function() {
	$('.share-load').show();
	$.ajax({
		url: '/ajax/share?link=' + subs.join(','),
		success: function(data){
			state.key = data;
			$('.share-load').hide();
			$('.share-result').show();
			$('.share-button-wrapper').hide();
			$('#share-link').val('vuiit.com/g/' + data);				
		}
	});
});

// Make picbox div a link
$(document).on('click', '.picbox', function() { 		
	window.open = $(this).find('#extlink').attr('href'); 
});

$(window).resize(function() {
	resize();
});
