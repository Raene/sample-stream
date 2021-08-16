/**
 * 
 * @param {*} range 
 * @param {*} totalLength 
 * @returns a result object containing the start and end positions of the file
 */
async function readRangeHeader(range, totalLength) {
    if (range == null || range.length == 0)
        return null;

    var array = range.split(/bytes=([0-9]*)-([0-9]*)/);
    var start = parseInt(array[1]);
    var end = parseInt(array[2]);
    var result = {
        Start: isNaN(start) ? 0 : start,
        End: isNaN(end) ? (totalLength - 1) : end
    };

    if (!isNaN(start) && isNaN(end)) {
        result.Start = start;
        result.End = totalLength - 1;
    }

    if (isNaN(start) && !isNaN(end)) {
        result.Start = totalLength - end;
        result.End = totalLength - 1;
    }

    return result;
}

/**
 * 
 * @param {*} res response object
 * @param {*} start start location for range
 * @param {*} end end location for range
 * @param {*} stat stats for the file
 * @param {*} readable readable sream
 */
async function streamFile(res, start, end, stat, readable) {
    res.setHeader(`Content-Type`, `audio/mp3`);
    res.setHeader(`Content-Length`, stat.size);
    res.setHeader(`Content-Range`, `bytes ${start}-${end}/${stat.size}`);
    res.setHeader(`Accept-Ranges`, `bytes`);
    res.setHeader(`Cache-Control`, `no-cache`);
    readable.pipe(res);
}

module.exports = {
    streamFile,
    readRangeHeader
}