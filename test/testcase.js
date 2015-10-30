var ModuleTestM3U = (function(global) {

global["BENCHMARK"] = false;

var test = new Test("M3U", {
        disable:    false, // disable all tests.
        browser:    true,  // enable browser test.
        worker:     true,  // enable worker test.
        node:       true,  // enable node test.
        nw:         true,  // enable nw.js test.
        el:         true,  // enable electron (render process) test.
        button:     true,  // show button.
        both:       true,  // test the primary and secondary modules.
        ignoreError:false, // ignore error.
        callback:   function() {
        },
        errorback:  function(error) {
            console.error(error.message);
        }
    }).add([
        testM3U_parseMasterPlayList,
        testM3U_parseIndexPlayList,
        testM3U_buildMasterPlayList,
        testM3U_buildIndexPlayList,
    ]);

if (IN_BROWSER || IN_NW || IN_EL) {
    test.add([
        // Browser, NW.js and Electron test
    ]);
} else if (IN_WORKER) {
    test.add([
        // WebWorkers test
    ]);
} else if (IN_NODE) {
    test.add([
        // Node.js test
    ]);
}

// --- test cases ------------------------------------------
function testM3U_parseMasterPlayList(test, pass, miss) {

    var str = '\n\
#EXTM3U\n\
#EXT-X-VERSION:3\n\
#EXT-X-STREAM-INF:BANDWIDTH=710852,CODECS="avc1.66.30,mp4a.40.2",RESOLUTION=432x768\n\
chunklist_w1076224352.m3u8\n\
';

    var m3u = M3U.parse(str);

    console.dir(m3u);

    if (m3u["version"] === 3) {
        if (m3u["file"][0].bandwidth === 710852 &&
            m3u["file"][0].codecs === "avc1.66.30,mp4a.40.2" &&
            m3u["file"][0].resolution === "432x768") {

            test.done(pass());
            return;
        }
    }
    test.done(miss());
}

function testM3U_parseIndexPlayList(test, pass, miss) {

    var str = "\n\
#EXTM3U\n\
#EXT-X-VERSION:3\n\
#EXT-X-ALLOW-CACHE:NO\n\
#EXT-X-TARGETDURATION:2\n\
#EXT-X-MEDIA-SEQUENCE:1459\n\
#EXTINF:0.858,\n\
media_w1360442349_1459.ts\n\
#EXTINF:0.886,\n\
media_w1360442349_1460.ts\n\
#EXTINF:0.835,\n\
media_w1360442349_1461.ts\n\
";

    var m3u = M3U.parse(str);

    console.dir(m3u);

    if (m3u["version"] === 3) {
        if (m3u["cache"] === false) {
            if (m3u["duration"] === 2) {
                if (m3u["sequence"] === 1459) {
                    if (m3u["file"][0].duration === 0.858) {
                        if (m3u["file"][1].duration === 0.886) {
                            if (m3u["file"][2].duration === 0.835) {
                                test.done(pass());
                                return;
                            }
                        }
                    }
                }
            }
        }
    }
    test.done(miss());
}

function testM3U_buildMasterPlayList(test, pass, miss) {

    var str = '#EXTM3U\n\
#EXT-X-VERSION:3\n\
#EXT-X-STREAM-INF:BANDWIDTH=710852,CODECS="avc1.66.30,mp4a.40.2",RESOLUTION=432x768\n\
chunklist_w1076224352.m3u8';

    var m3u = M3U.parse(str);
    var result = M3U.build(m3u);

    if (str === result) {
        test.done(pass());
    } else {
        test.done(miss());
    }
}

function testM3U_buildIndexPlayList(test, pass, miss) {

    var str = '#EXTM3U\n\
#EXT-X-VERSION:3\n\
#EXT-X-ALLOW-CACHE:NO\n\
#EXT-X-TARGETDURATION:2\n\
#EXT-X-MEDIA-SEQUENCE:1459\n\
#EXTINF:0.858,\n\
media_w1360442349_1459.ts\n\
#EXTINF:0.886,\n\
media_w1360442349_1460.ts\n\
#EXTINF:0.835,\n\
media_w1360442349_1461.ts';

    var m3u_1 = M3U.parse(str);
    var tmp   = M3U.build(m3u_1);
    var m3u_2 = M3U.parse(tmp);
    var result1 = JSON.stringify(m3u_1);
    var result2 = JSON.stringify(m3u_2);

    if (result1 === result2) {
        test.done(pass());
    } else {
        test.done(miss());
    }
}

return test.run();

})(GLOBAL);

