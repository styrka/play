var url = "https://api.twitch.tv/kraken/streams?channel=";
var stream = "sodapoppin,affinitiibl&callback=?"

$.getJSON(url + stream, function(data) {
  var items = [];
  $.each(data, function(id, node) {
      items.push('<li> ENTRY </li>');
      var typea = node.length;
      items.push('<li>' + id + ':' + node + ':' + typea + '</li>');
      $.each(node, function(key, val) {
        var type = typeof val;
        items.push('<li>' + key + ':' + val + ':' + type + '</li>');
        if (typeof val === 'object') {
          items.push('<li> STREAMS INFO </li>');
          $.each(val, function(item, iden) {
            items.push('<li>' + item + ':' + iden + '</li>');
            if(item==='channel') {
              items.push('<li> CHANNEL INFO </li>');
              $.each(iden, function(one, two) {
                items.push('<li>' + one + ':' + two + '</li>');
              });
              items.push('<li> END CHANNEL INFO </li>');
            };
          });
          items.push('<li> END STREAMS INFO </li>');
        };
      });
  });
 
  $('<ul/>', {
    'class': 'list',
    html: items.join('')
  }).appendTo('#streams');
});
