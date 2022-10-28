function CrowlCommon() {

}

CrowlCommon.TimeWaiter = function (ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

CrowlCommon.ElemWaiter = function (checkCallback, maxTimeMs) {
    //usage: ElemWaiter(()=>typeof(test2) !== 'undefined', 20000).then(()=>"not found").catch(()=>"found")
    let checkMs = 500;
    let pf = () => new Promise((resolve, reject) => {
        setTimeout(() => {
            if (!checkCallback()) {
//                console.log("check again")
                resolve("check again")
            }
            else {
//                console.log("found")
                reject("found!")
            }
        }, checkMs);
    });
    let p = Promise.resolve();
    for (let i = 0; i < maxTimeMs; i += checkMs) {
        p = p.then(() => pf())
    }
    //p.then(() => console.log("not found"))
    //p.catch(() => console.log("found"))
    return p
}
