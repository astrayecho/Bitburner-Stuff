/** @param {NS} ns */
// PHASE 1: THE WEAKENING
// THIS PHASE FOCUSES ON SETTING THE STAGE FOR THE ACTUAL HGW
// CYCLE, BY WEAKENING THE TARGET SERVER.

// STANDARD USAGE: YOU SHOULDN'T HAVE TO CALL THIS FUNCTION, IT
// GETS CALLED FROM THE commander.js PROCESS AND GETS PASSED THE
// NECESSARY ARGUMENTS AUTOMAGICALLY. BUTTTTT... IN CASE YOU WANT
// TO RUN IT MANUALLY GIVE THIS A GO:

// USAGE: run phase1.js TARGET HOST PORTNUMBER(int 1-20)
// EXAMPLE 1: "run phase1.js n00dles home 1"
// EXAMPLE SHOWN WILL TARGET n00dles FROM THE home SERVER AND
// SEND STATUS UPDATES TO PORT #1. ONLY USE PORTS 1-20.


export async function main(ns) {
	// Receives these as arguments from the commander.js process
    // or manually at run time
    var target = ns.args[0]; 
    var hostName = ns.args[1];
    var portNumber = ns.args[2];

    var runningThreads = 0; // iterator
    
    while (true) {
        
        while (ns.getServerSecurityLevel(target) == ns.getServerMinSecurityLevel(target)) {
            // while the two values are equal, signal for phase 2 and then exit:
            // no need to wait for anything to complete
            ns.print(target + "does not need weakened! peace.");
            await ns.writePort(portNumber, 2);
            ns.closeTail();
            ns.exit();
            await ns.sleep(101); // just in case
        }

        // Amt of RAM needed for 1 1xweak.js thread. Adjust if RAM requirements change.
        var weakenRAM = 1.75;

        ns.disableLog("sleep","exec"); // no sleep log spam please!

        var hostRAMTotal = ns.getServerMaxRam(hostName);
        var hostRAM = hostRAMTotal - ns.getServerUsedRam(hostName);

        var curSecurity = ns.getServerSecurityLevel(target);
        var minSecurity = ns.getServerMinSecurityLevel(target);
        var securityDifference = curSecurity - minSecurity;

        var weakenAmt = ns.weakenAnalyze(1); // default weaken level is 0.05 but this can change
        var weakThreads = securityDifference / weakenAmt; // total threads needed
        var threadsRemaining = weakThreads - runningThreads; // rounding down is fine

        var ram50 = weakenRAM * 50;
        var ram20 = weakenRAM * 20;
        var ram9 = weakenRAM * 9;
        var ram5 = weakenRAM * 5;

        // you can uncomment the line below if you want to always see tail logs
        ns.tail();
        ns.clearLog();
        
        // Print dialogs
        ns.print("Host: " + hostName + " Target: " + target);
        ns.print("Target security: " + curSecurity + "/" + minSecurity);
        ns.print("Weaken amount: " + weakenAmt);
        ns.print("Difference: " + securityDifference);
        ns.print("Total threads needed: " + weakThreads);
        ns.print("Threads remaining: " + threadsRemaining);
        ns.print("Threads run: " + runningThreads);
            
        // NOW we really do stuff
        if ((weakThreads - runningThreads) >= 50 && hostRAM > ram50) {
            var rt50 = runningThreads + 50;
            ns.exec("1xweak.js", hostName, 50, target, rt50);
            var runningThreads = rt50;
            await ns.sleep(45);
            continue;
        } // end 50x deployment
        await ns.sleep(75);
        if ((weakThreads - runningThreads) >= 20 && hostRAM > ram20) {
            var rt20 = runningThreads + 20;
            ns.exec("1xweak.js", hostName, 20, target, rt20);
            var runningThreads = rt20;
            await ns.sleep(45);
            continue;
        } // end 20x deployment
        await ns.sleep(75);
        if ((weakThreads - runningThreads) >= 9 && hostRAM > ram9) {
            var rt9 = runningThreads + 9;
            ns.exec("1xweak.js", hostName, 9, target, rt9);
            var runningThreads = rt9;
            await ns.sleep(45);
            continue;
        } // end 10x deployment
        await ns.sleep(75);
        if ((weakThreads - runningThreads) >= 5 && hostRAM > ram5) {
            var rt5 = runningThreads + 5;
            ns.exec("1xweak.js", hostName, 5, target, rt5);
            var runningThreads = rt5;
            await ns.sleep(45);
            continue;
        } // end 5x deployment
        await ns.sleep(75);
        if ((weakThreads - runningThreads) > 0 && hostRAM > weakenRAM) {
            var rt1 = runningThreads + 1;
            ns.exec("1xweak.js", hostName, 1, target, rt1);
            var runningThreads = rt1;
            await ns.sleep(45);
            continue;
        } // end single deployment
        
        if (hostRAM < weakenRAM || (weakThreads - runningThreads) == 0) {
            await ns.writePort(portNumber, "P1 Waiting 0/100%");
            await ns.sleep(ns.getWeakenTime(target) / 3);
            await ns.writePort(portNumber, "P1 Waiting 33/100%");
            await ns.sleep(ns.getWeakenTime(target) / 3);
            await ns.writePort(portNumber, "P1 Waiting 67/100%");
            await ns.sleep(ns.getWeakenTime(target) / 3.01);
            await ns.writePort(portNumber, "P1 Waiting 100%");

            if ((weakThreads - runningThreads) == 0) {
                await ns.writePort(portNumber, 2);
                ns.exit();
                await ns.sleep(111);
            }
            
            await ns.sleep(111);
            continue;
        }

        await ns.sleep(505); // just in case
        continue;
        // ns.exit();
        await ns.sleep(111); // f0r safe-keeping
    } // ends server security levels unequal check

} // end it all