const Image = require('ascii-art-image');
var image = new Image({
    filepath: 'angel.png',
    alphabet:'variant1',
    width: 60,
    height: 60
});

image.write(function(err, rendered){
    console.log(rendered);
})


