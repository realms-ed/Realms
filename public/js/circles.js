function onResize(event) {
    var x = paper.view.size.width;
    var y = paper.view.size.height;

    var happy = 40;
    var unsure = 14;
    var sad = 20;

    project.clear()

    var N = happy + unsure + sad;

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
                new Path.Circle(new Point(x, y), radius).fillColor = fillColor;
            }
            id++;
        }
    }
}