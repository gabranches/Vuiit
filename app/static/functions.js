// ----  Functions ---- //

function resize(){
	var height = $(window).height();
	$("#left-menu").css("height", height + "px");
	$("#gallery").css("height", height + "px");
}

function refreshSub(){
	$(".load-button-wrapper").hide();
	state.count = 0;
	state.after = null;
	clearCols();
	getItems(subs.join('+'));
}

function clearCols(){
	$("#col-1").empty();
	$("#col-2").empty();
	$("#col-3").empty();
	$("#col-4").empty();
}

function addSub(sub){
	if (state.events == 1){
		if (subs.indexOf(sub) == -1){
			subs.push(sub);
			addToSubList(sub);
			createCookie('subsCookie', subs.join(','), 60);
			refreshSub();
			$(".share-button-wrapper").show();
			$(".share-result").hide();
			$("#front-page-label").hide();

		}
	}
}

function removeSub(sub){
	var index = subs.indexOf(sub);
	subs.splice(index,1);
	createCookie('subsCookie', subs.join(','), 60);
	if (subs.length == 0){
		eraseCookie('subsCookie');
		$("#front-page-label").show();
		$(".share-button-wrapper").hide();
	} else {
		$(".share-button-wrapper").show();
	}
	$(".share-result").hide();
	refreshSub();
	

}

function addToSubList(sub){
	if (state.page == "main") {
		$("#sub-list").append('<div sub-id="' +
			sub + '" class="row sub"><span class="sub-link">r/' +
			sub + '</span> <span class="remove-button" sub-id="' +
			sub + '"><small>[remove]</small></span></div>');
	} else {
		$("#sub-list").append('<div sub-id="' +
			sub + '" class="row sub"><span class="sub-link">r/' +
			sub + '</span></div>');
	}
	$(".share-button-wrapper").show();
	
}

function getItems(){

	sub = subs.join('+');
	state.events = 0;
	var subUrl 	= (sub == '' ) ? "" : "r/" + sub;
	var limitUrl 	= "limit=" + options.limit;
	var afterUrl 	= (state.after == null) ? "" : "&after=" + state.after;
	var countUrl 	= (state.count == 0) ? "" : "&count=" + state.count;

	switch(options.sort) {
		case "hot":
			var sortType = "hot";
			var sortUrl = "sort=hot";
			break;
		case "new":
			var sortType = "new";
			var sortUrl = "sort=new";
			break;
		case "day":
			var sortType = "top";
			var sortUrl = "sort=top&t=day";
			break;
		case "week":
			var sortType = "top";
			var sortUrl = "sort=top&t=week";
			break;
		case "month":
			var sortType = "top";
			var sortUrl = "sort=top&t=month";
			break;
		case "year":
			var sortType = "top";
			var sortUrl = "sort=top&t=year";
			break;
		case "all":
			var sortType = "top";
			var sortUrl = "sort=top&t=all";
			break;
	}
	
	var url = "http://www.reddit.com/" + subUrl + "/" + sortType + "/.json?" + sortUrl + "&" + limitUrl + afterUrl + countUrl;

	$.getJSON( url, function(data) {
		state.events = 1;
		state.url = url;
		listItems(data);
		$(".load-button-wrapper").show();
	}).fail(function(){
		window.alert("Could not fetch data. Please check that the subreddits are valid.");
		state.events = 1;
	});
}

function whichColumn(){
	// Returns the shortest columns
	var c1 = cols['col-1'];
	var c2 = cols['col-2'];
	var c3 = cols['col-3'];
	var c4 = cols['col-4'];

	var c_name = ['1','2','3','4']
	var c_height = [c1,c2,c3,c4];
	var min_height = 0;
	var min_name = '1';

	for (i = 0; i < c_name.length; i ++){
		if (c_height[i] < min_height){
			min_name = c_name[i];
		}
		min_height = c_height[i];
	}
	return min_name;
}

function loadCookies(){
	optionsCookie = JSON.parse(readCookie("options"));
	// Show text posts
	if (optionsCookie.show_text != false) {
		options.show_text = optionsCookie.show_text;
		$("#options-text").prop("checked", true);
	}
	// Show NSFW posts
	if (optionsCookie.show_nsfw != false) {
		options.show_nsfw = optionsCookie.show_nsfw;
		$("#options-nsfw").prop("checked", true);
	}
}

function createOptionsCookie(){
	createCookie("options", JSON.stringify(options));
}

function listItems(json){

	// Compile handlebars template
	var raw_template = $('#simple-template').html();
	var pic_template = Handlebars.compile(raw_template);
	var raw_template = $('#info-template').html();
	var info_template = Handlebars.compile(raw_template);
 
	$.each(json.data.children, function(i, element){ // Iterate through JSON object

		if (element.length == 0){
			$(".load-button-wrapper").hide();
		}

		if(element.data.thumbnail == "nsfw"){
			element.data.thumbnail = "/static/images/nsfw.png";
		}
		// Determine in which column to place the next picture
		var cur_col = (state.count % 4) + 1;
		var placeHolder = $("#col-"+cur_col);
		element.data.col = "col-" + cur_col;

		if(element.data.thumbnail == 'self' || element.data.thumbnail == 'default' || element.data.thumbnail == ''){
			

			if(options.show_text == true){
				if (element.data.stickied == false){
					var html = info_template(element); // Generate the HTML for each post
					placeHolder.append(html); // Render the posts into the page
				}
			}
				
		} else {
			if (element.data.stickied == false){
				var html = pic_template(element); // Generate the HTML for each post
				placeHolder.append(html); // Render the posts into the page
			}
		}
		state.after = element.data.name;
		state.count++;
	});
}