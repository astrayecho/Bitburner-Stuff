/** @param {NS} ns */
// PHASE 2: THE GROWNING
// THIS PHASE FOCUSES ON GROWING THE SERVER TO FULL CAPACITY,
// WHILE SIMULTANEOUSLY WEAKENING IT BACK TO THE MINIMUM 
// SECURITY LEVEL, TO GET THE IDEAL GROWTH PARAMETER PER
// CYCLE. 

// USAGE NOTE: THIS PHASE WILL RUN AUTOMATICALLY AFTER RUNNING
// THE PHASE 1 SCRIPT, BUT YOU CAN CALL IT MANUALLY WITH
// THE USAGE EXAMPLE BELOW.

// USAGE: run phase2.js TARGET HOSTNAME PORTNUMBER
// EXAMPLE: run phase2.js n00dles home 1
// EXAMPLE SHOWN WILL TARGET n00dles FROM THE HOME SERVER AND
// BROADCAST PHASE TRANSITIONS ON PORT 1

export async function main(ns) {
	var target = ns.args[0]; // Target server name
	var hostName = ns.args[1]; // host server name

	// Port number to use to signal phase transition
	var portNumber = ns.args[2];
	await ns.sleep(135);

	// RAM needed per grow() and weaken() thread
	var growRAM = 1.75; // Adjust this if the requirements change in the future
	var weakenRAM = 1.75; // Adjust this if the requirements change in the future
	
	// Adding grow/weaken together below since they go hand in hand
	// For 10x grow threads, only 1 weaken thread is needed
	// Since grow increases security only 0.004/thread
	var needRAMx1 = growRAM + weakenRAM; // Updates dynamically cause magic
	var needRAMx10 = (growRAM * 10) + weakenRAM; // Updates dynamically cause magic

	// TARGET VARIABLES
	var curMoney = ns.getServerMoneyAvailable(target);
	var maxMoney = ns.getServerMaxMoney(target);
	var growParam = ns.getServerGrowth(target);	

	// Threads run, used as iterator
	var runningThreads = 0;
	
	while (ns.getServerMoneyAvailable(target) < ns.getServerMaxMoney(target)) {
		// VARS inside while loop so they remain updated during the script run time
		var hostRAM = ns.getServerMaxRam(hostName) - ns.getServerUsedRam(hostName); // Available RAM
		var curMoney = ns.getServerMoneyAvailable(target);
		var moneyMultiplier = maxMoney / curMoney; // Divide max / current $
		var growThreads = Math.floor(ns.growthAnalyze(target, moneyMultiplier)) - runningThreads;
		var weakenThreads = Math.floor(growThreads / 5);
		var requiredRAM = (growThreads * growRAM) + (weakenThreads * weakenRAM);

		// Disable logging for sleep and exec functions for easier readability of log windows
		ns.disableLog("sleep");
		ns.disableLog("exec");

		// Clears any logging the prior functions might have output for readability
		ns.clearLog();
		ns.tail();

		ns.print("* Target server: " + target + " Host: " + hostName);
		ns.print("* Port #: " + portNumber);
		ns.print("* Target current/max money: $" + curMoney.toFixed(0) + "/$" + maxMoney);
		ns.print("* Growth parameter: " + growParam);
		ns.print("* Threads run: " + runningThreads);
		ns.print("* Grow threads needed: " + growThreads + " weakens: " + weakenThreads);
		ns.print("* RAM Avail.: " + hostRAM + " RAM Required: " + requiredRAM);
		

		if (growThreads >= 10 && hostRAM > needRAMx10) {
            var rt10 = runningThreads + 10;
            ns.exec("1xgrow.js", hostName, 10, target, rt10);
			ns.exec("1xweak.js", hostName, 1, target, rt10);
            var runningThreads = rt10;
            await ns.sleep(45);
			continue;
        } else {
			// take a breather
			await ns.sleep(555);
		}
        if (growThreads < 10 && growThreads > 0 && hostRAM > needRAMx1) {
            var rt1 = runningThreads + 1;
            ns.exec("1xgrow.js", hostName, 1, target, rt1);
            var runningThreads = rt1;
            await ns.sleep(45);
			continue;
        } else {
			// take a breather
			await ns.sleep(555);
		}

		if (growThreads == 0 && ns.getServerMoneyAvailable(target) != ns.getServerMaxMoney(target)) {
		ns.print("* Grow threads processed. Final grow/weaken just in case... ");
		//one bonus weaken thread just in case
		await ns.exec("1xgrow.js", hostName, 10, target, "stray");
		await ns.exec("1xweak.js", hostName, 1, target, "stray");
		await ns.sleep(111);

		ns.print("* Phase 3 initiating once grow threads complete... ");
		// Sleep just in case so the while loop doesn't hang
		await ns.sleep(111);
		}
		
	}
	// Finally, phase 2 completed! 
	// Initiate phase 3...
	//var portNumber = 1;
	if (ns.getServerMoneyAvailable(target) == maxMoney) {
		ns.print("*** Phase 2: Min/Maxing completed!")
		await ns.writePort(portNumber, "3");
		await ns.sleep(111);
		ns.print("*** Phase 3 initiated.");
		await ns.sleep(111);
	}
	//just to try something
	await ns.sleep(159);

}