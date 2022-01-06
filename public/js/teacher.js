var url = window.location.href;
window.hash = url.split('/')[4];
window.u=0;
window.q=0;
window.d=0;

window.onload = function () {
    var canvas = document.getElementById('myCanvas');
    paper.setup(canvas);
}

function onResize(event) {
    draw(window.u, window.q, window.d);
}

function draw(happy, unsure, sad) {

    var x = paper.view.size.width;
    var y = paper.view.size.height;

    paper.project.clear()

    var N = happy + unsure + sad;

    if (N==0) { return}
    if(N==1) {
        if (happy==1) {new paper.Path.Circle(new paper.Point(x/2, y/2), Math.min(x/2, y/2)).fillColor = '#02ba42';}
        if (unsure==1) {new paper.Path.Circle(new paper.Point(x/2, y/2), Math.min(x/2, y/2)).fillColor = '#e3d149';}
        if (sad==1) {new paper.Path.Circle(new paper.Point(x/2, y/2), Math.min(x/2, y/2)).fillColor= '#d92e5b';}
        paper.view.draw();
        return    
    }

    var j=0;
    var arr = [];
    var flip = (x<y);

    var ncols; var nrows;
    var size;

    for (var i = 1; i < N; i++) {
        j=0;
        while (i * j <= N) {
            j++;
        }
        arr.push([i, j]);
        if (j<=(i+1)) {
            break;
        }
    }

    var mindiff=1000;
    var minpair; 

    for (var i = 0; i < arr.length; i++) {
        item = arr[i];

        if (flip) {
            if (Math.abs((item[0]/item[1])-x/y) < mindiff) {
                mindiff = Math.abs((item[0]/item[1])-x/y);
                minpair = item;
            }
        }
        else {
            if (Math.abs((item[0]/item[1])-y/x) < mindiff) {
                mindiff = Math.abs((item[0]/item[1])-y/x);
                minpair = item;
            }
        }
    }

    if (!flip) {
        nrows = minpair[0]; ncols = minpair[1];

    } else {
        nrows = minpair[1]; ncols = minpair[0];
    }

    size = Math.min(x/ncols, y/nrows);

    var radius = size/2;

    // distance between center coordinates

    var id = 1;

    for(var row = 1; row <= nrows; row++) {
        y = size/2 + (row - 1) * size;

        for(var col = 1; col <= ncols; col++) {
            x = size/2 + (col - 1) * size;
            if (id<=happy) {
                fillColor='#02ba42';
            } else if (id > happy &&  id <= happy+unsure) {
                fillColor='#e3d149';
            } else {
                fillColor = '#d92e5b';
            }
            if (id<=N) {
                new paper.Path.Circle(new paper.Point(x, y), radius).fillColor = fillColor;
            }
            id++;
        }
    }
    paper.view.draw();
}


var worker = new Worker('../../js/teacher_worker.js');
worker.onmessage = function() {
    try {
        fetch('/getdata/'+window.hash, {method: 'POST'}).catch(err => console.error("Err" + err))
        .then(response => response.json())
        .then(data => {
            console.log(data.understand);
            window.u=data.understand; window.q=data.question; window.d=data.dont_understand;
            draw(data.understand, data.question, data.dont_understand);
        });
    } catch(err) {
        console.log(err);
    }
}