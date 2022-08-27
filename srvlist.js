/** @param {NS} ns */
// Get a quick array of all of your purchased servers printed to terminal.
// If you're anything like me, you can forget what you named a purchased server
// Or maybe you mistype a servername during purchase.
// This shows you what's up. 

// Just "run srvlist.js" for the goods. 
// That's all.

export async function main(ns) {
	// Gets a list of all purchased servers and outputs the array to the terminal
	var slist = ns.getPurchasedServers();
	ns.tprint(slist);
}