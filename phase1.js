/** @param {NS} ns */
// PHASE 1: THE WEAKENING
// THIS PHASE FOCUSES ON SETTING THE STAGE FOR THE ACTUAL HGW
// CYCLE, BY ROOTING HOST AND TARGET SERVERS IF NECESSARY,
// THEN CALCULATING AND RUNNING CONCURRENT WEAKENS UNTIL THE
// TARGET IS AT ITS MINIMUM SECURITY LEVEL.

// USAGE: run phase1.js TARGET HOST PORT Optional:PHASEHOST(bool)
// EXAMPLE 1: "run phase1.js n00dles home 1"
// EXAMPLE SHOWN WILL TARGET n00dles FROM THE HOME SERVER
// WHILE RUNNING THE PHASE 1/2/3 PROCESSES FROM WHICHEVER
// SERVER THIS WAS ORIGINALLY CALLED FROM. 

// EXAMPLE 2: "run phase1.js n00dles psrv2048.01 1 true"
// EXAMPLE SHOWN WILL TARGET n00dles FROM THE psrv2048.01 
// PURCHASED SERVER, LISTEN ON PORT 1 FOR PHASE TRANSITION
// SIGNALS, AND HOST THE PHASE PROCESSES ON psrv2048.01 TOO.

export async function main(ns) {
	var target = ns.args[0];
	var hostName = ns.args[1];
    var portNumber = ns.args[2];
    var selfHosted = ns.args[3]; // To host the Phase 1/2/3 processes on the host server as well
	var hostRAM = ns.getServerMaxRam(hostName) - ns.getServerUsedRam(hostName);
	var serverArray = [target, hostName];
	ns.disableLog("sleep","exit");
	await ns.sleep(45);

    // run a grail thread while this is going so we can see the money roll in
	ns.run("grail.js", 1, target);
	

	// BEGIN ROOT ACCESS VERIFICATION/PROCESSINGs
	for (var i = 0; i < serverArray.length; ++i) {
        var tar = serverArray[i];
        ns.tprint("Processing root on: " + tar);

        if (ns.hasRootAccess(target) == false) {
            if (ns.fileExists("BruteSSH.exe", "home")) {
                ns.brutessh(tar);
            }
            if (ns.fileExists("FTPCrack.exe", "home")) {
                ns.ftpcrack(tar);
            }
            if (ns.fileExists("HTTPWorm.exe", "home")) {
                ns.httpworm(tar);
            }
            if (ns.fileExists("SQLInject.exe", "home")) {
                ns.sqlinject(tar);
            }
            if (ns.fileExists("relaySMTP.exe", "home")) {
                ns.relaysmtp(tar);
            }
            // NUKE IT
            ns.nuke(tar);
        }
    }

    // 
    if (hostName != "home") {
            if (selfHosted == true) {
            // Include phase 1/2/3 files in fileBox to send to host server
            var fileBox = ["1xhack.js","1xweak.js","1xgrow.js","phase1.js","phase2.js","phase3.js"];
            await ns.scp(fileBox, hostName, "home");
            ns.exec("phase1.js", hostName, 1, target, hostName);
            ns.exit();
            await ns.sleep(111);
        } else {
            // just the basics
            var fileBox = ["1xhack.js","1xweak.js","1xgrow.js"];
            await ns.scp(fileBox, hostName, "home");
        }   
    }

    var runningThreads = 0;

    while (ns.getServerSecurityLevel(target) > ns.getServerMinSecurityLevel(target)) {
        var securityDifference = ns.getServerSecurityLevel(target) - ns.getServerMinSecurityLevel(target);
        var weakenAmt10 = ns.weakenAnalyze(10);
        var weakThreads = securityDifference.toFixed(2) / weakenAmt10 * 10 - runningThreads;
        var ramNeeded = 1.75 * weakThreads;

        ns.clearLog();
        ns.tail();

        ns.print("*** Targeting: " + target + " on " + hostName);
        ns.print("*** Security difference: " + securityDifference.toFixed(2));
        ns.print("*** Weaken x10 impact: " + weakenAmt10);
        ns.print("*** Threads run: " + runningThreads + " Threads needed: " + weakThreads.toFixed(0));
	    ns.print("*** " + hostName + " RAM available: " + hostRAM + "gb");
        ns.print("*** RAM required: " + ramNeeded);

        if (weakThreads >= 10 && hostRAM > 17.5) {
            var rt10 = runningThreads + 10;
            ns.exec("1xweak.js", hostName, 10, target, rt10);
            var runningThreads = rt10;
            await ns.sleep(45);
        }
        if (weakThreads < 10 && weakThreads > 0 && hostRAM > 1.75) {
            var rt1 = runningThreads + 1;
            ns.exec("1xweak.js", hostName, 1, target, rt1);
            var runningThreads = rt1;
            await ns.sleep(45);
        }
        if (weakThreads == 0) {
            // get weaken time
            var wTime = ns.getWeakenTime(target);
            ns.print("Awaiting script execution: " + ns.tFormat(wTime, "00:00"));
            await ns.sleep(wTime);
        }
        

        // ns.exit();
        await ns.sleep(111);
    }
    ns.print("*** Security level is now: " + ns.getServerSecurityLevel(target));
    ns.print("*** Executing phase 2 on " + hostName + " against " + target);
    ns.exec("phase2.js", hostName, 1, target, hostName, portNumber);
    ns.print("*** Completed.");

    // BEGIN COMMANDER MODE CODE
    // THIS WILL LISTEN TO A PORT SPECIFIED TO COMMAND THE PHASE 2 AND 3 SCRIPTS TO FIRE

    var lastSignal = "(awaiting)";
    var i = 1; // Iterator to count loop cycles

    while (true) {
        var pauseCycle = false;

        while (pauseCycle == false) {
            // LISTENER SCRIPT GOOOOOO....
            let signal = ns.readPort(portNumber);
            ns.disableLog("run");
            ns.clearLog();
            ns.print("Current signal: " + signal);
            ns.print("Last signal: " + lastSignal);
            ns.print("Port #: " + portNumber + " Loop #: " + i);

            if (signal == 3) {
                ns.run("phase3.js", 1, target, hostName, portNumber);
                var lastSignal = "Activate Phase 3";
                var pauseCycle = true;
                await ns.sleep(11);
                continue;
            }
            if (signal == 2) {
                ns.run("phase2.js", 1, target, hostName, portNumber);
                ++i;
                var lastSignal = "Activate Phase 2";
                var pauseCycle = true;
                await ns.sleep(31);
            }
            if (signal == "NULL PORT DATA") {
                // pick your nose
                await ns.sleep(19);
                continue;
            } else {
                var lastSignal = signal;
                pauseCycle = true;
                await ns.sleep(179);
                continue;
            }
        }
        while (pauseCycle == true) {
            ns.print("*** ON 0.9 SECOND COOLDOWN ***");
            await ns.sleep(901);
            var pauseCycle = false;
        }
        // sleep. always sleep.
        await ns.sleep(31);
    }
}