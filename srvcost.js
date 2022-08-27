/** @param {NS} ns */
export async function main(ns) {
	if (ns.args[0] == "help") {
		ns.tprint("Function: prints out current server costs for reference.");
		ns.tprint("Use: run srvcost.js or alias: cost");
	}

	// Start with the array of available server memory sizes
	var sizeArray = [8,16,32,64,128,256,512,1024,2048,4096,8192,16384,32768,65536,131072,262144,524288,1048576];

	ns.tprint("******* Personal Server Costs *******");
	ns.tprint("*************************************");

	// Now the fun part
	for (var i = 0; i < sizeArray.length; ++i) {
        let ram= sizeArray[i];
		let fram = ns.nFormat(ram * 1000000000, '0 b');
		if (fram.length < 5) {
			fram = "00" + fram;
		}
		if (fram.length < 6) {
			fram = "0" + fram;
		}
		ns.tprint("***** " + fram + ": $" + ns.nFormat(ns.getPurchasedServerCost(ram),"0.00a"));
	}
	ns.tprint("*************************************");

}