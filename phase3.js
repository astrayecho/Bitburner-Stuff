/** @param {NS} ns */
// PHASE 3: THE PHASENATOR!!!
// AFTER PHASE 1: THE WEAKENING AND PHASE 2: THE GROWNING COMES
// THE PHASE TO RULE THEM ALL... THE PHASENATOR! THIS PHASE WILL
// RUN CONCURRENT H/G/W THREADS AT YOUR TARGET SERVER, UNLOCKING
// AS MUCH PROFIT AS POSSIBLE IN AS LITTLE TIME AS POSSIBLE.

// USAGE NOTE: THIS PHASE WILL RUN AUTOMATICALLY AFTER RUNNING
// THE PHASE 1/2 SCRIPTS, BUT YOU CAN CALL IT MANUALLY WITH
// THE USAGE EXAMPLE BELOW.

// USAGE: run phase3.js TARGET HOST PORTNUMBER
// EXAMPLE: run phase3.js n00dles home 1
// EXAMPLE SHOWN WILL TARGET n00dles FROM THE home SERVER 
// AND BROADCAST PHASE TRANSITIONS ON PORT 1

export async function main(ns) {
	var target = ns.args[0]; 
	var hostName = ns.args[1];

	// Port number to use to signal phase transition
	var portNumber = ns.args[2];

	// Player hack chance/growth multipliers
	const {chance, growth} = ns.getHackingMultipliers();

	// RAM needed per grow() and weaken() and hack() thread
	var growRAM = 1.75; // Adjust this if the requirements change in the future
	var weakenRAM = 1.75; // Adjust this if the requirements change in the future
	var hackRAM = 1.7; // Adjust this if the requirements change in the future

	// H/G/W Times output to milliseconds, so divide by 1000
	// to get real seconds.
	var hackTime = ns.getHackTime(target) / 1000; 
	var growTime = ns.getGrowTime(target) / 1000; 
	var weakenTime = ns.getWeakenTime(target) / 1000;

	// Target server variables
	var curMoney = Math.floor(ns.getServerMoneyAvailable(target) / 1000); // Current $ available on target server in thousands
	var maxMoney = ns.getServerMaxMoney(target) / 1000; // Maximum $ for target server in thousands
	var money15 = maxMoney * 0.15; // 15% of max money, a rough target for staying at/above 85% in funds

	// Hack variables
	var hackAmount = ns.hackAnalyze(target) * 100; // % of server money hacked per thread
	var hack15Threads = Math.floor(15 / hackAmount) + 1; // # of threads needed to hack 15% of server money
	var hack15Impact = hack15Threads * 0.002; // Security impact of running (hack() x hack15Threads)
	var hack15Time = hackTime * hack15Threads / 60; // Time in minutes to run it all

	// Grow variables
	var growthParameter = ns.getServerGrowth(target); // Target's growth parameter. Higher = better.
	var grow15Threads = Math.floor(ns.growthAnalyze(target, 1.18015) + 1); // # of threads to grow back 15%
	var grow15Impact = grow15Threads * 0.004; // Security lvl impact of running (grow() x grow15Threads)
	var grow15Time = (grow15Threads * growTime) / 60; // Time in minutes to complete grow threads 
	
	// Weaken Variables
	var weaken15Threads = Math.floor(hack15Impact / 0.05) + 1 + Math.floor(grow15Impact / 0.05); // # of threads to weaken host back to minimum, +1 just in case
	var weaken15Time = (weaken15Threads * weakenTime) / 60;  // Time in minutes to complete weaken threads

	ns.clearLog();
	// ns.tail();

	ns.print("Target: " + target + " 15% of target: " + (money15 / 1000) + "k");
	ns.print("Current/Max $$: " + curMoney.toLocaleString('en-us') + "k/" + maxMoney.toLocaleString('en-us') + "k");
	ns.print("Player hack chance multiplier: " + chance.toFixed(4));
	ns.print("Player growth multiplier: " + growth.toFixed(4));
	ns.print("H/G/W Times (seconds): H " + hackTime.toFixed(0) + "/G " + growTime.toFixed(0) + "/W " + weakenTime.toFixed(0));
	ns.print("Hack% per thread: " + hackAmount.toFixed(2) + "% Threads to 15%: " + hack15Threads);
	ns.print("Security Impact: " + hack15Impact.toFixed(3) + " Weakens needed: " + weaken15Threads);
	ns.print("Growth parameter: " + growthParameter + " Threads to 15%: " + grow15Threads);
	ns.print("Times to H/G/W 15% of this server: ");
	ns.print("Hack: " + hack15Time.toFixed(2) + "mins. Grow: " + grow15Time.toFixed(2) + "mins. Weaken: " + weaken15Time.toFixed(2) + "mins.");

	// holy crap time to actually do something
	// but first the iterator var
	// this will be incremented in the if loops below...
	var hackThreadsRun = 0;

	while (hackThreadsRun < hack15Threads) {
		// First come vars
		var hackThreadsRemaining = hack15Threads - hackThreadsRun;
		var hostRAM = ns.getServerMaxRam(hostName) - ns.getServerUsedRam(hostName); // Available RAM

		// Adding hack/weaken together below since they go hand in hand
		// For 10x and 20x hack threads, < 1 weaken thread is needed
		// For 50x, 2 weaken threads are needed. Should equal 88.5gb if hack = 1.7 & weaken = 1.75.
		// Since grow increases security only 0.004/thread
		var hackRAMx1 = hackRAM; // Updates dynamically cause magic
		var hackRAMx10 = (hackRAM * 10) + weakenRAM; // Updates dynamically cause magic
		var hackRAMx20 = (hackRAM * 20) + weakenRAM; // Updates dynamically cause magic
		var hackRAMx50 = (hackRAM * 50) + (weakenRAM * 2); // Updates dynamically cause magic

		if (hackThreadsRemaining >= 50 && hostRAM > hackRAMx50) {
            var rt50 = hackThreadsRun + 50;
            ns.exec("1xhack.js", hostName, 50, target, rt50);
			ns.exec("1xweak.js", hostName, 1, target, rt50);
            var hackThreadsRun = rt50;
            await ns.sleep(55);
			continue;
        } 
		if (hackThreadsRemaining >= 20 && hostRAM > hackRAMx20) {
            var rt20 = hackThreadsRun + 20;
            ns.exec("1xhack.js", hostName, 20, target, rt20);
			ns.exec("1xweak.js", hostName, 1, target, rt20);
            var hackThreadsRun = rt20;
            await ns.sleep(55);
			continue;
        } 
		if (hackThreadsRemaining >= 10 && hostRAM > hackRAMx10) {
            var rt10 = hackThreadsRun + 10;
            ns.exec("1xhack.js", hostName, 10, target, rt10);
			ns.exec("1xweak.js", hostName, 1, target, rt10);
            var hackThreadsRun = rt10;
            await ns.sleep(55);
			continue;
        } 
        if (hackThreadsRemaining < 10 && hackThreadsRemaining > 0 && hostRAM > hackRAMx1) {
            var rt1 = hackThreadsRun + 1;
            ns.exec("1xhack.js", hostName, 1, target, rt1);
            var hackThreadsRun = rt1;
            await ns.sleep(55);
			continue;
        } else {
			// take a breather
			await ns.sleep(255);
		}
		// best keep this just in case!
		await ns.sleep(111);
		continue;
	}

	var delayed = false;
	var postSetup = false;
	
	while (postSetup == false) {
		// Wind down with a delay before pushing it back to phase 2
		if (hackThreadsRun == hack15Threads) {
			var finishDelay = weakenTime;
			await ns.writePort(portNumber, "P3 Finishing 0%");
			await ns.sleep(finishDelay / 3);
			await ns.writePort(portNumber, "P3 Finishing 33%");
			await ns.sleep(finishDelay / 3);
			await ns.writePort(portNumber, "P3 Finishing 67%");
			await ns.sleep((finishDelay / 3) + 100); // Add an extra second for safety
			var delayed = true;
			postSetup = true;
		}
	}
	// Now we can wrap up and sent to phase 2
	if (delayed == true) {
		ns.print("* Hack threads run: " + hackThreadsRun);
		ns.print("* Returning to phase 2, stand by...");
		await ns.sleep(151);
		await ns.writePort(portNumber, 2);
		ns.print("Thanks for playing.");
		await ns.sleep(133);
		await ns.exit();
		// ns.closeTail();
	}

}