Handlebars.registerHelper("formatTitle", function(data){
	return (data.title.length > options.text_limit) ? data.title.substring(0, options.text_limit) + "..." : data.title;
});

Handlebars.registerHelper("picHelper", function(data){
	if ('preview' in data && data['preview']['images'][0]['resolutions'].length > 1) {
		return data['preview']['images'][0]['resolutions'][1]['url'];
	} else {
		return data['thumbnail'];
	}
});