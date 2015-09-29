// ----  Functions ---- //

function resize() {
	var height = $(window).height();
	$('#left-menu').css('height', height + 'px');
	$('#gallery').css('height', height + 'px');
}

function refreshSub() {
	$('.load-button-wrapper').hide();
	state.count = 0;
	state.after = null;
	clearCols();
	getItems(subs.join('+'));
}

function clearCols() {
	$('#col-1').empty();
	$('#col-2').empty();
	$('#col-3').empty();
	$('#col-4').empty();
}

function addSub(sub) {
	sub = sub.toLowerCase();
	if (state.events == 1){
		if (subs.indexOf(sub) == -1){
			subs.push(sub);
			addToSubList(sub);
			createCookie('subsCookie', subs.join(','));
			refreshSub();
			$('.share-button-wrapper').show();
			$('.share-result').hide();
			$('#front-page-label').hide();
		}
		$('#input-sub').val('');
		$('#input-sub').attr('placeholder','Add a Subreddit');
		$('.dropdown-menu').hide();
	}
}

function addGalleryName() {
	var name = $('#share-name').val();
	$('#update-button').hide();
	$('#update-loader').show();
	$.ajax({
		url: '/ajax/updatename?name=' + name + '&key=' + state.key,
		success: function(data){
			$('#update-loader').hide();
			$('#update-confirm').show().delay(3000).fadeOut();;
		}
	});
}

function removeAll() {
	subs = [];
	state.sub = '';
	eraseCookie('subsCookie');
	$('.share-button-wrapper').hide();
	$('.share-result').hide();
	$('#sub-names').empty();
	$('#sub-names').html('<span id="front-page-label">Front Page</span>');
	$('#front-page-label').show();
	refreshSub();
}

function editGallery() {
	createCookie('subsCookie', subs.join(','));
	window.location.href = '/';
}

function removeSub(sub) {
	var index = subs.indexOf(sub);
	subs.splice(index,1);
	createCookie('subsCookie', subs.join(','));
	if (subs.length == 0) {
		eraseCookie('subsCookie');
		$('#front-page-label').show();
		$('.share-button-wrapper').hide();
	} else {
		$('.share-button-wrapper').show();
	}
	$('.share-result').hide();
	refreshSub();
}

function addToSubList(sub) {
	sub = sub.toLowerCase();
	if (state.page == 'main') {
		$('#sub-names').append('<div sub-id="' +
			sub + '" class="row sub"><span class="sub-link">r/' +
			sub + '</span><span class="remove-button glyphicon glyphicon-minus" sub-id="' +
			sub + '" title="remove this subreddit"></span></div>');
	} else {
		$('#sub-names').append('<div sub-id="' +
			sub + '" class="row sub"><span class="sub-link">r/' +
			sub + '</span></div>');
	}
	$('.share-button-wrapper').show();
}

function addToPopularList(sub) {
	$('#pop-sub-names').append('<div sub-id="' +
		sub + '" class="row pop-sub"><span class="sub-link">r/' +
		sub + '</span><span class="add-button glyphicon glyphicon-plus" sub-id="' +
		sub + '" title="add this subreddit"></span></div>');
}

function getPopularSubs() {
	$.getJSON("https://www.reddit.com/subreddits/popular/.json?limit=100", function(data) {
		$.each(data.data.children,function(index,element) { 
			addToPopularList(element.data.display_name.toLowerCase());
		});
	});
}

function getItems() {

	var sub = subs.join('+');
	state.events = 0;
	var subUrl = (sub == '' ) ? '' : 'r/' + sub;
	var limitUrl = 'limit=' + options.limit;
	var afterUrl = (state.after == null) ? '' : '&after=' + state.after;
	var countUrl = (state.count == 0) ? '' : '&count=' + state.count;

	switch(options.sort) {
		case 'hot':
			var sortType = 'hot';
			var sortUrl = 'sort=hot';
			break;
		case 'new':
			var sortType = 'new';
			var sortUrl = 'sort=new';
			break;
		case 'day':
			var sortType = 'top';
			var sortUrl = 'sort=top&t=day';
			break;
		case 'week':
			var sortType = 'top';
			var sortUrl = 'sort=top&t=week';
			break;
		case 'month':
			var sortType = 'top';
			var sortUrl = 'sort=top&t=month';
			break;
		case 'year':
			var sortType = 'top';
			var sortUrl = 'sort=top&t=year';
			break;
		case 'all':
			var sortType = 'top';
			var sortUrl = 'sort=top&t=all';
			break;
	}
	
	var url = 'http://www.reddit.com/' + subUrl + '/' + sortType + '/.json?' + sortUrl + '&' + limitUrl + afterUrl + countUrl;

	$.getJSON( url, function(data) {
		state.events = 1;
		state.url = url;
		listItems(data);
		if (state.last_page == true) {
			$('.load-button-wrapper').hide();
		} else {
			$('.load-button-wrapper').show();
		}
	}).fail(function() {
		window.alert('Could not fetch data. Please check that the subreddits are valid.');
		state.events = 1;
	});
}

function setColumnHeights() {
	for (var i=1; i<5; i++) {
		state['columns'][i]['height'] = 0;
	}
	for (var i=1; i<5; i++) {
		$('#col-' + i + '-wrapper').children().each(function(){
			state['columns'][i]['height'] += $(this).innerHeight();
		})
	}
}

function getMaxColumnHeight() {
	setColumnHeights();
	return Math.max(
		state['columns']['1']['height'],
		state['columns']['2']['height'],
		state['columns']['3']['height'],
		state['columns']['4']['height'] 
	);
}

function loadCookies() {
	optionsCookie = JSON.parse(readCookie('options'));
	// Show text posts
	if (optionsCookie.show_text != false) {
		options.show_text = optionsCookie.show_text;
		$('#options-text').prop('checked', true);
	}
	// Show NSFW posts
	if (optionsCookie.show_nsfw != false) {
		options.show_nsfw = optionsCookie.show_nsfw;
		$('#options-nsfw').prop('checked', true);
	}
}

function createOptionsCookie() {
	createCookie('options', JSON.stringify(options));
}

function listItems(json) {
	// Compile handlebars template
	var raw_template = $('#simple-template').html();
	var pic_template = Handlebars.compile(raw_template);
	var raw_template = $('#info-template').html();
	var info_template = Handlebars.compile(raw_template);

	if (json.data.after == null) {
		state.last_page = true;
	}
 
	$.each(json.data.children, function(i, element) { // Iterate through JSON object
		if(element.data.thumbnail == 'nsfw') {
			element.data.thumbnail = '/static/images/nsfw.png';
			if (options.show_nsfw == false) {
				return true;
			}
		}
		// Determine in which column to place the next picture
		var cur_col = (state.count % 4) + 1;
		var placeHolder = $('#col-' + cur_col);
		element.data.col = 'col-' + cur_col;

		if(element.data.thumbnail == 'self' || element.data.thumbnail == 'default' || element.data.thumbnail == ''){
			if(options.show_text == true) {
				if (element.data.stickied == false) {
					var html = info_template(element); // Generate the HTML for each post
					placeHolder.append(html); // Render the posts into the page
				}
			}
		} else {
			if (element.data.stickied == false) {
				var html = pic_template(element); // Generate the HTML for each post
				placeHolder.append(html); // Render the posts into the page
			}
		}
		state.after = element.data.name;
		state.count++;
	});
}