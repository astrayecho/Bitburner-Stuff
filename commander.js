/** @param {NS} ns */
// PHASE 1: THE WEAKENING
// THIS PHASE FOCUSES ON SETTING THE STAGE FOR THE ACTUAL HGW
// CYCLE, BY ROOTING HOST AND TARGET SERVERS IF NECESSARY,
// THEN CALCULATING AND RUNNING CONCURRENT WEAKENS UNTIL THE
// TARGET IS AT ITS MINIMUM SECURITY LEVEL.

// USAGE: run commander.js TARGET HOST PORT Optional:PHASEHOST(bool)
// EXAMPLE 1: "run commander.js n00dles home 1"
// EXAMPLE SHOWN WILL TARGET n00dles FROM THE HOME SERVER
// WHILE RUNNING THE PHASE 1/2/3 PROCESSES FROM WHICHEVER
// SERVER THIS WAS ORIGINALLY CALLED FROM. 

// EXAMPLE 2: "run commander.js n00dles psrv2048.01 1 true"
// EXAMPLE SHOWN WILL TARGET n00dles FROM THE psrv2048.01 
// PURCHASED SERVER, LISTEN ON PORT 1 FOR PHASE TRANSITION
// SIGNALS, AND HOST THE PHASE PROCESSES ON psrv2048.01 TOO.

export async function main(ns) {
    // SETUP WORK ENVIRONMENT
    var target = prompt("Enter name of target server:", {type: "text"});
    var hostName = prompt("Enter name of host server:", {type: "text"});
    var ram = prompt("Choose unique port #:", {type: "select", choices: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]});
    
	var target = ns.args[0];
    var portNumber = ns.args[2];
    var selfHosted = ns.args[3]; // if true, host the Phase 1/2/3 processes on the host server as well
	
	var serverArray = [target, hostName];
	ns.disableLog("sleep","exit");
	await ns.sleep(45);

    var setupStatus = false; // This activates the setup process
    var isNuked = false; // Set to false until root is verified

    while (setupStatus == false) {
        // run a grail thread while this is going so we can see the money roll in
	    ns.run("grail.js", 1, target);

        // BEGIN ROOT ACCESS VERIFICATION/PROCESSINGs
        if (isNuked == false) {
            for (var i = 0; i < serverArray.length; ++i) {
                let tar = serverArray[i];
                ns.tprint("Processing root on: " + tar);

                if (tar != "home" && ns.hasRootAccess(tar) == false) {
                    if (ns.fileExists("BruteSSH.exe", "home")) {ns.brutessh(tar);}
                    if (ns.fileExists("FTPCrack.exe", "home")) {ns.ftpcrack(tar);}
                    if (ns.fileExists("HTTPWorm.exe", "home")) {ns.httpworm(tar);}
                    if (ns.fileExists("SQLInject.exe", "home")) {ns.sqlinject(tar);}
                    if (ns.fileExists("relaySMTP.exe", "home")) {ns.relaysmtp(tar);}
                    // NUKE IT
                    await ns.nuke(tar);
                }
            } // end for loop
            if (ns.hasRootAccess(target) == true && ns.hasRootAccess(hostName) == true) {
                isNuked =true;
            } else {
                ns.alert("Could not verify root access");
                var proceed = ns.prompt("Attempt to continue?", {type: "boolean"});
                if (proceed == true) {
                    isNuked=true;
                } else {
                    ns.exit();
                    await ns.sleep(101);
                }
            }
        } // end "if (isNuked == false)"

        await ns.sleep(111); //always a sleep just in case...
    } // end "while (setupStatus == false)"


    // 
    if (hostName != "home") {
            if (selfHosted == true) {
            // Include phase 1/2/3 files in fileBox to send to host server
            var fileBox = ["commander.js","1xhack.js","1xweak.js","1xgrow.js","phase1.js","phase2.js","phase3.js","grail.js"];
            await ns.scp(fileBox, hostName, "home");
            ns.exec("commander.js", hostName, 1, target, hostName, portNumber);
            ns.exit();
            await ns.sleep(111);
        } else {
            // just the basics
            var fileBox = ["1xhack.js","1xweak.js","1xgrow.js"];
            await ns.scp(fileBox, hostName, "home");
        }   
    }

    // set up the default states of our status check variables
    var listenerReady = false;
    var weakened = false;
    var grown = false;

    if (ns.getServerSecurityLevel(target) < ns.getServerMinSecurityLevel(target)) {
        ns.print("*** Executing phase 1: weaken " + target);
        await ns.run("phase1.js", 1, target, hostName, portNumber);
        var listenerReady = true;
        ns.print("*** Completed.");
    } else {
        weakened = true;
    } // end target security level check

    // Begin target server funds check 
    if (ns.getServerMoneyAvailable(target) != ns.getServerMaxMoney(target)) {
        ns.print("*** Executing phase 2: grow funds on " + target);
        await ns.run("phase2.js", 1, target, hostName, portNumber);
        var listenerReady = true;
        ns.print("*** Completed.");
    } else {
        grown = true;
    }

    // BEGIN COMMANDER MODE CODE
    // THIS WILL LISTEN TO A PORT SPECIFIED TO COMMAND THE PHASE 2 AND 3 SCRIPTS TO FIRE

    var lastSignal = "(awaiting)";
    var statusMessage = "Ready.";
    var i = 1; // Iterator to count loop cycles

    while (listenerReady == true) {
        var pauseCycle = false;

        while (pauseCycle == false) {
            // LISTENER SCRIPT GOOOOOO....
            let signal = ns.readPort(portNumber);
            ns.disableLog("run");
            ns.clearLog();
            ns.print(statusMessage);
            ns.print("Current signal: " + signal);
            ns.print("Last signal: " + lastSignal);
            ns.print("Port #: " + portNumber + " Loop #: " + i);

            if (signal == 3) {
                ns.run("phase3.js", 1, target, hostName, portNumber);
                var lastSignal = "Activate Phase 3";
                var pauseCycle = true;
                await ns.sleep(33);
                continue;
            }
            if (signal == 2) {
                ns.run("phase2.js", 1, target, hostName, portNumber);
                ++i;
                var lastSignal = "Activate Phase 2";
                var pauseCycle = true;
                await ns.sleep(33);
                continue;
            }
            if (signal == "NULL PORT DATA") {
                // pick your nose
                await ns.sleep(303);
                continue;
            } else {
                var lastSignal = signal;
                pauseCycle = true;
                await ns.sleep(179);
                continue;
            }
        }
        while (pauseCycle == true) {
            statusMessage = "*** ON 0.75 SECOND COOLDOWN ***";
            await ns.sleep(751);
            var pauseCycle = false;
        }
        // sleep. always sleep.
        await ns.sleep(31);
    }
}