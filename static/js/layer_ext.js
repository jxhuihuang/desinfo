layer.config({
  path: '/static/plugins/layer-3.1.1/'
});

var layer_icon = function(category) {
    if (Number.isInteger(category) && category <= 6 && category >= 0) {
        return category;
    } else {
        switch(category)
        {
            case 'info':
                return 0;
            case 'success':
            case 'right':
                return 1;
            case 'danger':
            case 'error':
                return 2;
            case 'warning':
            case 'doubt':
                return 3;
            case 'lock':
                return 4;
            case 'unhappy':
                return 5;
            case 'happy':
                return 6;
            default:
                return 0;
        }
    }
};

var layer_flash = function(messages) {
    var i = messages.length - 1;
    layer.msg(messages[i][1], {closeBtn: 2, time: 2000, area: '200px', icon: layer_icon(messages[i][0])}, function() {
        messages.splice(i, 1);
        if (i > 0) layer_flash(messages);
    });
};