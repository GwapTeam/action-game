function generateData(blocks, blockset) {
    var count = 0;
    for(var i = 0; i< 20; i++) {
        for(var j = 0; j < blockset.length; j++) {
            count = blockset[j];
            if(i >= 15 - count && i < 15) {
                if(i == (15 - count)) {
                    blocks[i][j] = 4;
                } else {
                    blocks[i][j] = 3;
                }
            } else {
                blocks[i][j] = -1;
            }
        }
    }
    return blocks;
}
