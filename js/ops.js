// inits
var ops = [];
ops.url = "https://api.twitch.tv/kraken/streams";
ops.stream = "?limit=9&callback=?";
ops.streamSelection = [];
ops.streamProm = ["styrka","healthbar","velna","amiye","gnorrior"];
ops.streamdata = [];
ops.streamsActive = [];
ops.removeItem = '<a class="remove">X</a>';
// flash vars
ops.flash = [];
ops.flash.Height = 295;
ops.flash.Width = 353;
ops.flash.Type = "application/x-shockwave-flash";
ops.flash.Data = "http://www.twitch.tv/widgets/live_embed_player.swf";
ops.flash.Color = "#000"
ops.flash.FS = "true";
ops.flash.SA = "always";
ops.flash.Vars = "auto_play=false&start_volume=25&channel=";
ops.flash.lock = true;
//remove from array
function removeA(arr) {
  var what, a = arguments, L = a.length, ax;
  while (L > 1 && arr.length) {
      what = a[--L];
      while ((ax= arr.indexOf(what)) !== -1) {
          arr.splice(ax, 1);
      }
  }
  return arr;
}
//art
function artIt() {
  setInterval(function () {
    $('#art1').css('width', moment().format("ss")*3 + Math.random()*180);
    $('#art2').css('width', moment().format("SS")*2 + Math.random()*160);
    $('#art3').css('width', moment().format("SS")*1 + Math.random()*260);
  }, 100);
}
//clock
function ticktock() {
  $('#testinfo').html(moment().format('M,D'));
  setInterval(function() {
    $('#theTime').html('<h2 class="responsive zero" data-compression="8.25" data-min="20" data-max="200"> <a class="colortoBG clock">' + moment().format("H:mm:ss") + '</a></h3>')
    $('#month').css('height', moment().format("H")*3 + moment().format("D")/10);
    $('#day').css('height', moment().format("D")*4);
    $('#hour').css('height', moment().format("H")*5);
    $('#minute').css('height', moment().format("mm")*2);
  }, 500);
  setInterval(function() {
    $('#second').css('height', moment().format("ss")*2 + moment().format("SS")/50);
  }, 250);
}
//cookies
function setCookie(c_name,value,exdays) {
  var exdate = new Date();
  exdate.setDate(exdate.getDate() + exdays);
  var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
  document.cookie = c_name + "=" + c_value;
}

function getCookie(cookieName) {
  var theCookie=" "+document.cookie;
  var ind=theCookie.indexOf(" "+cookieName+"=");
  if (ind==-1) ind=theCookie.indexOf(";"+cookieName+"=");
  if (ind==-1 || cookieName=="") return "";
  var ind1=theCookie.indexOf(";",ind+1);
  if (ind1==-1) ind1=theCookie.length; 
  return unescape(theCookie.substring(ind+cookieName.length+2,ind1));
}

function streamCookie() {
  var streamListing = "?channel=" + ops.streamSelection.toString() + "&callback=?";
  setCookie("lastStream",streamListing,365);
}

function lastStreamLoad() {
  var lastStream = getCookie("lastStream");
  if (lastStream !== '') {
    ops.stream = lastStream;
  }
  else {
    ops.stream = "?limit=9&callback=?";
  }
}
//stream ui
$(document).on('click', '#streamAdd', function() {
  var alreadyIn;
  for (i=0;i<ops.streamSelection.length;i++) {
    if ($('#streamName').val()===ops.streamSelection[i]) {
      alreadyIn = true;
    }
  }
  if (!alreadyIn) {
    ops.streamSelection.push($('#streamName').val());
    streamUpdate($('#streamName').val());
  };
  $('#streamName').val('');
});
$(document).on('click', '#streamClear', function() {
  emptyStreams();
});
$(document).on('click', '#streamMove', function(){
  if (ops.flash.lock) {
    $('#streams').sortable('enable');
    $('#streams').disableSelection();
    $('#streamMove').html('Lock');
    ops.flash.lock = false;
  }
  else if (!ops.flash.lock) {
    $('#streams').sortable('disable');
    $('#streams').enableSelection();
    $('#streamMove').html('Move');
    ops.flash.lock = true;
  };
});
$(document).on('click', 'a.remove', function() {
  removeA(ops.streamSelection, $(this).parent().parent()[0].id);
  $(this).parent().parent().parent().remove();
  streamCookie();
});
$(document).on('click', '#streamTop9', function() {
  ops.streamSelection = [];
  $('#streams').html('<i class="icon-spinner icon-4x icon-spin"></i>');
  ops.stream = "?limit=9&callback=?";
  loadStreams();
});
$(document).on('click', '#streamDota', function() {
  ops.streamSelection = [];
  ops.stream = "?game=Dota+2&limit=9&callback=?";
  $('#streams').html('<i class="icon-spinner icon-4x icon-spin"></i>');
  loadStreams();
});
$(document).on('click', '#streamWoW', function() {
  ops.streamSelection = [];
  ops.stream = "?game=World+of+Warcraft:+Mists+of+Pandaria&limit=9&callback=?";
  $('#streams').html('<i class="icon-spinner icon-4x icon-spin"></i>');
  loadStreams();
});
$(document).on('click', '#streamProm', function() {
  ops.streamSelection = [];
  $('#streams').html('<i class="icon-spinner icon-4x icon-spin"></i>');
  streamUpdate(ops.streamProm);
});
//stream functions
function emptyStreams() {
  $('#streams').html('');
  ops.streamSelection = [];
}

function streamUpdate(selection) {
  if ($('#streams').html()==='') $('#streams').html('<i class="icon-spinner icon-4x icon-spin"></i>');
  ops.stream = "?channel=" + selection.toString() + "&callback=?";
  loadStreams();
}

function streamList(input) {
  var alreadyInList;
  for (n=0;n<ops.streamSelection.length;n++) {
    if (input===ops.streamSelection[n]) {
      alreadyInList = true;
    }
  }
  if (!alreadyInList) {
    ops.streamSelection.push(input);
  };
}

function loadStreams() {
  $.getJSON(ops.url + ops.stream, function(data) {
    var datact = 0;
    $.each(data, function(id, node) {
      if (id==='streams') {
        datact = node.length;
        for (i=0; i<datact; i++) {
          ops.streamdata[i] = [];
          $.each(node[i], function(key, val) {
            if (key==='viewers') ops.streamdata[i].viewers = val;
            if (key==='channel') {
              ops.streamdata[i].name = val.name;
              ops.streamdata[i].game = val.game;
              ops.streamdata[i].title = val.status;
            }
          });
        };
      };
    });
    ops.streamsActive = [];
    for (i=0;i<datact;i++) {
      ops.streamsActive[i] = [];
      streamCreate(ops.streamdata[i]);
    }
    streamPlacement();
    streamCookie();
    $('#streams').sortable("refresh");
    setTimeout(function(){if ($('#streams').html()==='' ||$('#streams').html()==='<i class="icon-spinner icon-4x icon-spin"></i>') $('#streams').html('<h2><i class="icon-lemon"></i> no streams available <i class="icon-lemon"></i></h2>')}, 500);
  });
}

function streamPlacement() {
  $('i.icon-spinner').remove();
  for (i=0;i<ops.streamsActive.length;i++) {
    $('#streams').append('<li class="ui-state-default" id="' + ops.streamsActive[i].id + 'Link">');
    $('#streams').children().last().append('<section id="' + ops.streamsActive[i].id + '"> <h3> <a class="inline cursorDefault" target="_blank" href="http://www.twitch.tv/' + ops.streamsActive[i].id + '">' + ops.streamsActive[i].id + '</a>' + ops.removeItem + '</h3>' + ops.streamsActive[i].object + '<p class="subtext">' + ops.streamsActive[i].title + '</p> </section>');
    $('#streams').append('</li>');
  }
}

function streamCreate(streamA) {
  ops.streamsActive[i].id = streamA.name;
  ops.streamsActive[i].object = '<object type="' + ops.flash.Type + '" height="' + ops.flash.Height + '" width="' + ops.flash.Width + '" id="live_embed_player_flash" data="'+ ops.flash.Data + '?channel=' + name + '" bgcolor="' + ops.flash.Color + '"><param name="allowFullScreen" value="' + ops.flash.FS + '" /><param name="allowScriptAccess" value="' + ops.flash.SA + '" /><param name="movie" value="' + ops.flash.Data + '" /><param name="flashvars" value="' + ops.flash.Vars + streamA.name + '" /></object>';
  ops.streamsActive[i].title = streamA.title;
  streamList(streamA.name);
}
//page inits
$('document').ready(function(){
  $('#streams').sortable();
  $('#streams').sortable('disable');
  lastStreamLoad();
  ticktock();
  //artIt();
  setTimeout(loadStreams(), 500);
});
