// ----  Functions ---- //

function resize(){
	var height = $(window).height();
	$("#left-menu").css("height", height + "px");
	$("#gallery").css("height", height + "px");
}

function refreshSub(sub, sort){
	count = 0;
	after = null;
	clearCols();
	getItems(sub, sort);
}

function clearCols(){
	$("#col-1").empty();
	$("#col-2").empty();
	$("#col-3").empty();
	$("#col-4").empty();
}

function addSub(sub){
	if (events == 1){
		if (subs.indexOf(sub) == -1){
			subs.push(sub);
			addToSubList(sub);
			createCookie('subsCookie', subs.join(','), 60);
		}
	}
}

function removeSub(sub){
	var index = subs.indexOf(sub);
	subs.splice(index,1);
	createCookie('subsCookie', subs.join(','), 60);
	if (subs.length == 0){
		eraseCookie('subsCookie');
	}
}

function addToSubList(sub){
	$("#sub-list").append('<div sub-id="' +
		sub + '" class="row sub"><span class="sub-link">r/' +
		sub + '</span> <span class="remove-button" sub-id="' +
		sub + '"><small>[remove]</small></span></div>');
}

function getItems(sub, sort){

	events = 0;
	var subUrl 	= (sub == null ) ? "" : "r/"+sub;
	var limitUrl 	= "limit=" + limit;
	var afterUrl 	= (after == null) ? "" : "&after="+after;
	var countUrl 	= (count == 0) ? "" : "&count="+count;

	switch(sort) {
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
		events = 1;
		console.log(url);
		listItems(data, false);
		$("#load-div").hide();
		}).fail(function(data) {
			console.log("Could not get data from subreddit '"+sub+"'. Please make sure that this subreddit exists, or try again in a few minutes.");
		});
	}

function listItems(json, printtext){

	// Compile handlebars template
	var raw_template = $('#simple-template').html();
	var template = Handlebars.compile(raw_template);
 
	$.each(json.data.children, function(i,element){ // Iterate through JSON object

		if(cols['col-1'] <= cols['col-2']){
			var placeHolder = $("#col-1");
			element.data.col = 'col-1';
		} else if (cols['col-2'] <= cols['col-3']){
			var placeHolder = $("#col-2");
			element.data.col = 'col-2';
		} else if (cols['col-3'] <= cols['col-4']){
			var placeHolder = $("#col-3");
			element.data.col = 'col-3';
		} else {
			var placeHolder = $("#col-4");
			element.data.col = 'col-4';
		}


		if((count % 12) == 0){
			$(placeHolder).append("<div class='row'>");
		}		

		if(element.data.thumbnail == "" || element.data.thumbnail =="self" || element.data.thumbnail =="default"){ 
		// Don't display thumbnail for self posts and posts with no image
			element.data.display = "infobox-nojs";
			element.data.thumbnailHelper = 'display:none;';
			element.data.ismedia = false;
		} else {
			element.data.display = "infobox";
			element.data.thumbnailHelper = null;
			element.data.ismedia = true;
		}

		if(element.data.thumbnail == "nsfw"){
			element.data.thumbnail = "images/nsfw.png"
		}

		if(printtext == true){
			if (element.data.stickied == false){
				var html = template(element); // Generate the HTML for each post
				placeHolder.append(html); // Render the posts into the page
				after = element.data.name;
				count++;
			}
		} else {
			if(element.data.ismedia == true){
				var html = template(element); // Generate the HTML for each post
				placeHolder.append(html); // Render the posts into the page
				after = element.data.name;
				count++;
			}
		}

		if((count % 12) == (11)){
			$(placeHolder).append("</div>");
		}	
	});
}