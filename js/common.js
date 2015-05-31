var PAGE = "/";
var ARGS = "";
var DEPTH= 0;
var UH = "";

$(document).ready(
    function() 
    {
	$("a").click(linkClick);

	$("#login").submit(
	    function()
	    {
		$("#login-status").hide();
		$("#login-loading").fadeIn();

		$.get("cgi/login.cgi?" + $("#username").val() + "+" + $("#password").val(), 
		      function(d)
		      {
			  $("#login-loading").hide();

			  if(d.match(/reddit_session/))
			  {
			      $.cookie('user', $("#username").val());

			      $("#username, #password").fadeOut().unbind();
			      $("#login-status")
				  .html("Logged in as <strong>" + $("#username").val() + "</strong>")
				  .removeClass("login-incorrect")
				  .addClass("login-ok")
				  .slideDown();
			  }

			  else
			  {
			      //invalid login
			      $("#password").val("");
			      $("#login-status")
				  .text("Login incorrect!")
				  .addClass("login-incorrect")
				  .slideDown();
			  }
			     
		      }
		     );
		return false;
	    }
	);

	if($.cookie("user"))
	{
	    $("#username, #password").fadeOut();
	    $("#login-status")
		.html("Logged in as <strong>" + $.cookie("user") + "</strong>")
		.removeClass("login-incorrect")
		.addClass("login-ok")
		.slideDown();
	}
	
	$("#hide-subreddits").click(
	    function()
	    {
		$("#subreddits")
		    .animate( 
			{ height: "0px" },
			300
		    );
		
		$("header")
		    .animate(
			{ height: "66px" },
			300
		    );
		
		$("#show-subreddits").html("&darr;");
	    }
	);

	$("#show-subreddits").click(
	    function()
	    {
		$("#show-subreddits").html("");
		
		$("header")
		    .animate( 
			{ height: "89px" },
			300
		    );
		
		$("#subreddits")
		    .animate(
			{ height: "21px" },
			300
		    );
	    }
	);
	
	$("#tabs li a").click(
	    function()
	    {
		var txt = $(this).text() == "hot" ? "" : $(this).text();
		var page = PAGE.replace(/(\/controversial|\/new|\/top|\/saved)/, "");
		var url = page + "/" + txt
		getPage(url.replace(/^\/\//, "/").replace(/\/+$/, ""));
	    }
	);

	$("#query").focus(
	    function()
	    {
		$(this).fadeTo(400, 1);
		if($(this).val() == "search") $(this).val("");
	    }
	);

	$("#query").blur(
	    function()
	    {
		if($(this).val() == "") $(this).val("search");
		$(this).fadeTo(400, .6);
	    }
	);

	$("#search").submit(
	    function()
	    {
		var page = PAGE.replace(/(\/controversial|\/new|\/top|\/saved)/, "");
		getPage(page + "/search", "q=" + $("#query").val());
		return false;
	    }
	);

	$("#submit-link").click(
	    function()
	    {
		if($.cookie("user"))
		{
		    $("#submit").slideDown();
		    $("#submit-link").fadeOut();
		}

		else
		{
		    $("#login-status")
			.text("Please login first!")
			.addClass("login-incorrect")
			.slideDown();
		}
	    }
	);

	$("#link-link").click(
	    function()
	    {
		$('#submit label[for="link-url"]').text("URL");
		$("#link-url").replaceWith('<input type="text" id="link-url" />');
	    }
	);

	$("#link-self").click(
	    function()
	    {
		$('#submit label[for="link-url"]').text("Text");
		$("#link-url").replaceWith('<textarea id="link-url" /></textarea>');
	    }
	);

	$("#submit").submit(
	    function()
	    {
		$("#submit-status").hide();
                $("#submit-loading").fadeIn();
		
		$.get("cgi/submit.cgi?" + 
		      UH + "+" +
		      $('#submit input[name="kind"]:checked').val() + "+" +
		      encodeURIComponent($("#link-url").val()) + "+" +
		      encodeURIComponent($("#link-sr").val().replace(/^\/r\//, "")) + "+" +
		      encodeURIComponent($("#link-title").val()) + "+" +
		      $.cookie("user"),
		      function(r)
		      {
			  $("#submit-loading, #link-fields, #submit label, #submit input").hide();

			  $("#submit-status")
                              .text(r)
                              .addClass("submit-ok")
                              .slideDown();
		      }
		     );
		return false;
	    }
	);

	$("#username, #password").focus(
	    function()
	    {
		$(this).fadeTo(400, 1);
		if($(this).val() == "username" || $(this).val() == "password") $(this).val("");
	    }
	);

	$("#username, #password").blur(
	    function()
	    {
		if($(this).val() == "" && $(this).attr("id") == "username") $(this).val("username");
		else if($(this).val() == "" && $(this).attr("id") == "password") $(this).val("password");
		$(this).fadeTo(400, .4);
	    }
	);

	$('#username, #password').keyup(
	    function(e) 
	    {
		if(e.keyCode == 13)
		{
		    $("#login").submit();
		}
	    }
	);

	//accept a destination to make things easy
	if(window.location.href.match(/\#\!/)) 
	{
	    var urls = window.location.href.replace(/.*\#\!/, "").split("?");
	    if(urls.length == 1) getPage(urls[0]);
	    else getPage(urls[0], urls[1]);
	}
	 
	//or get homepage
	else getPage("/");
    }
);

function linkClick()
{
    if($(this).attr('href'))
    {
	if($(this).attr('href').match(/^http\:\/\//) || $(this).attr('href').match(/^\#[^!]/))
	{ return true; }

	else if($(this).attr('href').match(/^\?/))
	{
	    getPage(PAGE, $(this).attr('href').replace(/^\?/, ""));
	    return false;
	}

	else  
	{
	    if($(this).attr('href').match(/\/user/)) 
	    { }

	    else if($(this).attr('href').match(/\?/))
	    {
		var urls = $(this).attr('href').split('?');
		getPage(urls[0], urls[1]);
	    }
	    
	    else 
	    {
		getPage($(this).attr('href').replace('#!', ''));
	    }

	    return false;
	}
    }
}

function getPage(url, args)
{
    var extraArgs = args ? args : "";

    if(extraArgs.match(/before/)) DEPTH--;
    else if(extraArgs.match(/after/)) DEPTH++;
    else DEPTH = 0;

    if(DEPTH == 0 && extraArgs.match(/count/)) extraArgs = "";

    if(extraArgs) window.location.href = window.location.href.replace(/\#.*/, "") + "#!" + url + "?" + extraArgs;
    else window.location.href = window.location.href.replace(/\#.*/, "") + "#!" + url;

    PAGE = url;
    ARGS = extraArgs;

    var tab = "hot";
    if(url.match(/\/new/)) tab = "new";
    if(url.match(/\/controversial/)) tab = "controversial";
    if(url.match(/\/top/)) tab = "top";
    if(url.match(/\/saved/)) tab = "saved";

    $("#tabs li").removeClass("selected");
    $("#tabs li a:contains(" + tab + ")").parent().addClass("selected");
        
    $("#selftext, #comments, #pagination, #subreddit-logo").empty().hide();

    $("#items").fadeOut(
	'fast',
	function()
	{
	    $("#items").empty();

	    $("#loading").fadeIn(
		'fast',
		function()
		{
		    var user = $.cookie('user') ? $.cookie('user') : ""; 
		    $.get(
			"cgi/get.cgi?" + url + "+" + encodeURIComponent(extraArgs.replace("?", "")) + "+" + user,
			processPage
		    );
		}
	    );
	}
    );
}

function processPage(d)
{
   //are we looking at the comments?
    var areComments = false;
    if($.isArray(d) && d.length > 1) areComments = true;

    var items;
    if(areComments)
    {
	items = d[0].data.children;
	UH = d[0].data.modhash;
    }

    else 
    {
	items = d.data.children;
	UH = d.data.modhash;
    }

    

    if(items.length == 0)
    {
	$("#items").append('<li class="empty nohover">lol there doesn\'t seem to be anything here!</li>');
    }

    //set the subreddit logo and menu
    if(PAGE == "/") {}
    else
    {
	$("#subreddits li").removeClass("selected");    
	$("#subreddits li a:contains(" + items[0].data.subreddit + ")").parent().addClass("selected");
	$("#subreddit-logo").html('<img src="http://thumbs.reddit.com/' + items[0].data.subreddit_id + '.png" />').fadeIn('fast'); 
	$("#link-sr").val("/r/" + items[0].data.subreddit);
    }


    //draw items
    for(var i = 0; i < items.length; i++)
    {
	var data = items[i].data;

	if(DEPTH > 0 && !areComments && i == 0)
	{
	    d.data.before = data.name;
	}

	var scoreVote = "";
	if(data.likes == true) scoreVote = " upvote-voted";
	if(data.likes == false) scoreVote = " downvote-voted";

	var thumbnailCode = data.thumbnail != "" ? 
	    '<div class="thumbnail"><a href="' + data.url.replace("http://www.reddit.com", "") + '"><img src="' + data.thumbnail + '" /></a></div>' : "";

	var indentMore = data.thumbnail != "" ?
	    ' indent-more' : "";
	
	var domainAction = data.domain.match(/^self\./) ?
	    'href="' + data.domain.replace(/^self\./, "/r/") + '"' :
	    'href="http://' + data.domain + '"';

	var item =
	    '<a name="' + data.name + '"></a>' +	    
	    '<div class="rank">' + parseInt(i + 1 + (25 * DEPTH)) + '</div>' + 
            '<div class="score' + scoreVote + '" id="score-' + data.name + '">' + data.score + '</div>' +
            '<div class="vote">' +
	    '    <a id="up-' + data.name + '" class="upvote"></a>' +
	    '    <a id="down-' + data.name + '" class="downvote"></a>' +
	    '</div>' +
	    thumbnailCode.replace("/static/", "http://www.reddit.com/static/") +
            '<div class="title' + indentMore + '"><a href="' + data.url.replace("http://www.reddit.com", "") + '">' + data.title + '</a></div>'+
            '<div class="meta' + indentMore + '">' + 
            '    <p>' + 
            '        <span class="domain"><a ' + domainAction + '>' + data.domain + '</a></span> - ' + 
            '        <span class="time">' + makeDateReadable(data.created_utc) + ' ago</span>' + 
            '        <span class="author">by <a href="/user/' + data.author + '">' + data.author + '</a></span>' + 
            '        <span class="subreddit">to <a href="/r/' + data.subreddit + '">/r/' + data.subreddit + '</a></span>' +
            '    </p>' + 
            '    <p>' + 
            '        <span class="comments"><a href="' + data.permalink + '">' + data.num_comments + ' comments</a></span> - ' +
            '        <span class="share"><a>share</a></span>' + 
            '    </p>' + 
            '</div>';
	
	var liClass = areComments ? ' class="nohover"' : '';
	$("#items").append('<li' + liClass + '>' + item + '</li>');
    }

    //Draw self text and comments
    if(areComments)
    {
	//selftext is easy
	if(items[0].data.selftext != "")
	{
	    $("#selftext").html(filter(items[0].data.selftext)).show();
	}

	//comments, not so much
	parseComments(d[1].data.children, $("#comments"));
	$("#comments").show();
    }

    if(!areComments)
    {
	var prev = d.data.before ? '<a id="prev-link" href="' + PAGE + '?count=25&before=' + d.data.before + '">&laquo; prev</a> - ' : "";
	var next = d.data.after ? '<a id="next-link" href="' + PAGE + '?count=25&after=' + d.data.after + '">next &raquo;</a>' : "";
	$("#pagination").html(prev + next).show();
    }

   
    //Bind some events
    $("#main a").unbind('click').click(linkClick);


    $("#items li").hover(
	function() 
	{
	    $(this).children(".score").animate({ paddingTop: "30px" }, 150);
	    $(this).children(".vote").fadeIn(250);
	},
	
	function() 
	{
	    $(this).children(".score").animate({ paddingTop: "5px" }, 150);
	    $(this).children(".vote").fadeOut(250);
	}
    );
    
    $(".upvote, .downvote").click(
	function()
	{
	    $(this)
		.removeClass("upvote-voted downvote-voted")
	    
	    var vote = $(this).attr("class");

	    $(this).siblings()
		.removeClass("upvote-voted downvote-voted");

	    $("#score-" + $(this).attr("id").replace(/(up\-|down\-)/, ""))
		.removeClass("upvote-voted downvote-voted")
		.addClass(vote + "-voted");

	    $(this).addClass(vote + "-voted");	

	    if($.cookie("user"))
	    {
		var dir = $(this).attr("class").match("upvote") ? "1" : "-1";
		var args = $(this).attr("id").replace(/(up\-|down\-)/, "") + "+" + dir + "++" + UH + "+" + $.cookie("user");
		$.get("cgi/vote.cgi?" + args);
	    }
	}
    );
    
    $(".minmax-tgl").click(
	function()
	{
	    if($(this).attr('state') == "hide")
	    {
		$(this).attr('state',  "show").html("&uArr;");
		$("#" + $(this).attr('id').replace('tgl-', "")).height('100%'); 
	    }
	    else
	    {
		$(this).attr('state', "hide").html("&dArr;");
		$("#" + $(this).attr('id').replace('tgl-', "")).animate( 
		    { height: "24px" },
		    500
		);
	    }
	}
    );

    $("#loading").hide();
    $("#items").show()    
}

function parseComments(comments, container)
{
    //shift the first node and append it to the container
    var c = comments.shift();

    if(!c.data.author) return;
    var comment = 
	'<div class="comment" id="' + c.data.name + '">' +
	'    <a name="' + c.data.name + '"></a>' +
	'    <p class="meta meta-top">' +
	'         <span class="minmax"><a class="minmax-tgl" id="tgl-' + c.data.name + '" state="show">&uArr;</a></span>' + 
	'         <span class="author"><a href="/user/' + c.data.author + '">' + c.data.author + '</a></span>' + 
	'    </p>' +
	'    <div class="comment-body">' + filter(c.data.body) + '</div>' +
	'    <p class="meta meta-btm">' +
	'         <span class="score">' + parseInt(c.data.ups - c.data.downs) + '</span>' + 
	'         <span class="permalink"><a>link</a> -&nbsp;</span>' +  
	'         <span class="parent"><a href="#' + c.data.parent_id + '">parent</a> -&nbsp;</span>' +
        '         <span class="time">' + makeDateReadable(c.data.created_utc) + ' ago</span>' + 
	'    </p>' +
	'</div>';

    container.append(comment);

    //recurse?
    if(c.data.replies && c.data.replies != "")
    {
	parseComments(c.data.replies.data.children, $("#" + c.data.name));

	if(comments.length > 0)
	{
            parseComments(comments, container);
	}
    }

    else if(comments.length > 0)
    {
	parseComments(comments, container);
    }

    else return;
}

function filter(s)
{
    if(!s) return "";

    //Mimic reddit's filter
    return "<p>" + s
	.replace(/^    (.*)$/mg, "<pre>$1</pre>")
	.replace(/^&gt;(.*)$/mg, "<blockquote>$1</blockquote>")
	.replace(/^\*[^\*]*$/mg, "&nbsp;&nbsp;&nbsp;&bull;&nbsp;")
	.replace(/\n\n/g, "</p><p>")
	.replace(/\n/g, "<br />")
	.replace(/\\\*/g, "&#42;")
	.replace(/\*([^\*]*)\*/g, "<em>$1</em>")
	.replace(/\*\*([^\*]*)\*\*/g, "<strong>$1</strong>")
	.replace(/~~([^~]*)~~/g, "<del>$1</del>")
	.replace(/\^(\w*)\s/g, "<sup>$1</sup>")
	.replace(/\[([^\]]*)\]\(([^\)]*)\)/g, "<a href=\"$2\">$1</a>")
	.replace(/<p><br \/>/g, "<p>")
	.replace(/<p><\/p>/, "")
        .replace(/[^\"](http:\/\/\S*)[^\"]/g, " <a href=\"$1\">$1</a> ");
	+ "</p>";
}

function makeDateReadable(created)
{
    var readableTime = "a little bit";
    var now = new Date();
    var diff = now.getTime()/1000  - (created);
    if(diff > 86400) readableTime = Math.floor(diff/86400) + " days";
    else if(diff > 3600) readableTime = Math.floor(diff/3600) + " hours";
    else readableTime = Math.floor(diff/60) + " minutes";
    return readableTime;
}