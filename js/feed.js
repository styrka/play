function feeds() {
  var dataload;

  $.ajax({
     dataType: "jsonp",
     url: "http://www.comeatmeco.blogspot.com/feeds/posts/default?alt=json",
     crossDomain: true,
     success: function(data) {
    dataload = data;
    content(dataload);
     }});
}

function content(inc) {
  var loading = inc.feed.entry;
  for (i = 0; i < loading.length; i++) {
    $('.content').append('<li class="ui-state-default">'+loading[i].content.$t+'</li>');
  };
}

function paginate(tar){
  setTimeout(function() {
    $("#"+tar).pajinate({
      items_per_page : 4,
      item_container_id : '.content',
      nav_panel_id : '.page_navigation'
    });
    $("#posts h4 a").each(function() {
        $("<span>" + $(this).html() + "</span>").replaceAll(this);
    });
    $("#posts .rssRow").append('<div class="divider"></div>')
  }, 1000);
};

$('document').ready(function() {
  feeds();
  $('#blag .content').sortable();
  $('#blag .content').sortable('disable');
  paginate("blag");
});
