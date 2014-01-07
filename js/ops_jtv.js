var url = "http://api.justin.tv/api/stream/list.json";
var stream = "?channel=tobiwandota,versuta,minidota,wagamamatv,netolicrc,sexybamboe,dendi,wepla,alaito&callback=?";
var streamSelection = [];
var streamDota = ["dendi","tobiwandota","starladder1","wagamamatv","onemoregametv2","versuta","4cejkee","beyondthesummit","minidota"];
var streamWoW = ["styrka","affinitiibl","amiye","slootbag","zuperwtf","killars","syiler","sco","healthbar"];
var streamProm = ["styrka","greenyb","healthbar","velna","amiye","kynks"];
var streamdata = [];

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

$('#streamAdd').click(function() {
  streamSelection.push($('#streamName').val());
  $('#streamName').val('');
});
$('#streamRemove').click(function() {
  removeA(streamSelection, $('#streamName').val());
  $('#streamName').val('');
});
$('#streamUpdate').click(function() {
  if (streamSelection.length !== 0) streamUpdate(streamSelection);
});
$('#streamDota').click(function() {
  streamUpdate(streamDota);
});
$('#streamWoW').click(function() {
  streamUpdate(streamWoW);
});
$('#streamProm').click(function() {
  streamUpdate(streamProm);
});

function streamCategory(selection) {

  $('#streams').html('');
  loadStreams();
}
function streamUpdate(selection) {
  stream = "?channel=" + selection.toString() + "&callback=?";
  $('#streams').html('<i class="icon-spinner icon-4x icon-spin"></i>');
  loadStreams();
}

function loadStreams() {
  $.getJSON(url + stream, function(data) {
    var datact = 0;
    $.each(data, function(id, node) {
        streamdata[datact] = [];
        $.each(node, function(key, val) {
          if (key==='title') streamdata[datact].title = val;
          if (key==='stream_count') streamdata[datact].viewers = val;
          if (key==='meta_game') streamdata[datact].game = val;
          if(key==='channel') {
            streamdata[datact].stream = val.embed_code;
            streamdata[datact].name = val.login;
          }
        });
        datact++;
    });
   $('#streams').html('');
    for (i=0;i<datact;i++) {
      if (i%3===0) {
        $('#streams').append('<article class="row">');
      }
      $('#streams').children().last().append('<section id="' + streamdata[i].name + '" class="one third padded"> <h3>' + streamdata[i].name + '</h3>' + streamdata[i].stream + '<p>' + streamdata[i].title + '</p> </section>');
      if (i%3===2) {
        $('#streams').append('</article>');
      }
    }
    if (i%3!==2) {
      $('#streams').append('</article>');
    }
  });
}

$('document').ready(loadStreams());
