function test_CrowlSneackersDetail_append_2sneakers() {
    let sneaker1 = new CrowlSneackersDetail();
    sneaker1.Brand = "Nike"
    sneaker1.ModelName = "Air Max"
    sneaker1.ModelCode = "KJ984"
    sneaker1.Price = "100"
    sneaker1.SizesArray = [new CrowlSneackersSize("M", "Eu", "9"), new CrowlSneackersSize("M", "Eu", "8.5")]
    sneaker1.PageUrl = "1"

    let sneakerNoAdd = new CrowlSneackersDetail();
    sneakerNoAdd.PageUrl = "1";

    let sneaker2 = new CrowlSneackersDetail();
    sneaker2.Brand = "Nike"
    sneaker2.ModelName = "Next"
    sneaker2.ModelCode = "LO231"
    sneaker2.Price = "100"
    sneaker2.SizesArray = [new CrowlSneackersSize("M", "Eu", "9"), new CrowlSneackersSize("M", "Eu", "8.5")]
    sneaker2.PageUrl = "2"

    let dets = CrowlDetailStorage.fab();
    dets.clear();
    dets.append(sneaker1);
    dets.append(sneakerNoAdd);
    dets.append(sneaker2);

    let detCheck = CrowlDetailStorage.fab();
    return detCheck.Details[0].ModelCode == "KJ984" && detCheck.Details[1].ModelCode == "LO231"
}

function test_CrowlSneackersDetail_2sneakers_afterReload() {
    let detCheck = CrowlDetailStorage.fab();
    return detCheck.Details[0].ModelCode == "KJ984" && detCheck.Details[1].ModelCode == "LO231"
}

function test_CrowlSearchStorage_11append_10read() {
    let searcher = CrowlSearchStorage.fab()
    searcher.clear();
    for (let i = 0; i < 10; i++)
        searcher.append("url_" + i);
    searcher.append("url_0");
    return searcher.SearchResults.length == 10;
}

function test_CrowlSearchStorage_10urls_afterReload() {
    let searcher = CrowlSearchStorage.fab()
    return searcher.SearchResults.length == 10;
}

function test_CrowlSearchStorage_next_iterate10 () {
    let searcher = CrowlSearchStorage.fab()
    searcher.clear();
    for (let i = 0; i < 10; i++)
        searcher.append("url_" + i);
    let i = 0;
    while (true) {
        let r = searcher.next();
        if (r.done == true)
            break;
        i++
    }
    return i == 10;
}

function test_CrowlSearchStorage_next_afterReload() {
    let searcher = CrowlSearchStorage.fab()
    return searcher.next().value == 10 && searcher.next().done == true
}

function test_All() {
    let testStageCount = 2
    let testStageNum = window.sessionStorage.getItem("test_Stage_Num");
    if (testStageNum == null)
        testStageNum = 0;
    else {
        testStageNum = parseInt(testStageNum);
    }
    console.log("current stage: " + testStageNum);
    switch (testStageNum) {
        case 0:            
            console.log( "test_CrowlSneackersDetail_append_2sneakers() = " + test_CrowlSneackersDetail_append_2sneakers() )
            console.log("test_CrowlSearchStorage_11append_10read() = " + test_CrowlSearchStorage_11append_10read())
            console.log("test_CrowlSearchStorage_next_iterate10() = " + test_CrowlSearchStorage_next_iterate10())
            break;
        case 1:
            console.log("test_CrowlSneackersDetail_2sneakers_afterReload() = " + test_CrowlSneackersDetail_2sneakers_afterReload())
            console.log("test_CrowlSearchStorage_10urls_afterReload() = " + test_CrowlSearchStorage_10urls_afterReload())
            console.log("test_CrowlSearchStorage_next_afterReload() = " + test_CrowlSearchStorage_next_afterReload())
            break;
    }

    testStageNum++;
    if (testStageNum >= testStageCount)
        testStageNum = 0;
    window.sessionStorage.setItem("test_Stage_Num", testStageNum);
    console.log("next stage: " + testStageNum);
}