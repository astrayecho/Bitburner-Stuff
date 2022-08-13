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
    // SETUP WORK ENVIRONMENT BY DECLARING THE ESSENTIAL VARIABLES:
    // target:      The server you will be hacking $$$ from
    // hostName:    The server hosting hack, grow, and weaken processes
    // portNumber:  The *unique* port number (1-20) the commander process uses
    //              to listen for phase change transitions. Use only 1 per target!
    // selfHosted*: If the host server will be hosting the commander & phase # 
    //              processes as well as the individual hack/grow/weaken threads.
    //              *defaults to false

    // IMPORTANT: 
    // If no arguments are passed to this script, it will request the essential
    // information via the following UI prompts. Upon completion, it will then
    // respawn a new commander process with those arguments (so that you can run
    // more than one commander process at a time) and exit() the original. In 
    // this way, you never have to worry about memorizing the syntax for script
    // arguments, nor worry about being limited to only one process because you
    // don't remember them. 

    while (ns.args[0] == null) { 
        ns.tprint("*** commander.js run with no arguments!");
        await ns.sleep(505);
        ns.tprint("*** To begin, please enter your target server.");
        var target = await ns.prompt("Enter name of target server:", {type: "text"});
        ns.tprint("*** Target server: " + target);
        await ns.sleep(505);
        ns.tprint("*** Please enter host server.");
        var hostName = await ns.prompt("Enter name of host server:", {type: "text"});
        await ns.sleep(505);
        ns.tprint("*** Host server: " + hostName);
        await ns.sleep(505);
        ns.tprint("*** Choose a *UNIQUE* port number to listen on.");
        ns.tprint("*** >> If other scripts or active commander processes use the same port,");
        ns.tprint("*** >> errors may occur. Only use port 1-20.");
        var portNumber = await ns.prompt("Choose unique port #: ", {type: "select", choices: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]});
        ns.tprint("*** Listen on port #: " + portNumber);
        ns.tprint("*** Now choose to if you wish to run the commander & phase processes on the host server");
        ns.tprint("*** as well as the individual hack/grow/weaken threads.");
        ns.tprint("*** >> Only recommended if your server is 64gb or larger.");
        var selfHosted = await ns.prompt("Self hosted?", {type: "boolean"});
        ns.tprint("******* SUMMARY: *******");
        ns.tprint("*** Target: " + target);
        ns.tprint("*** Host: " + hostName);
        ns.tprint("*** Port #: " + portNumber);
        ns.tprint("*** Self-host: " + selfHosted);
        await ns.sleep(505);
        ns.tprint("******** READY? ********");
        var readyCheckPrompt = await ns.prompt("Ready to continue?", {type: "boolean"});

        // Now we relaunch the process either here or on hostName with the specified 
        // arguments, that way we can run more than 1 commander process at a time. 
        if (readyCheckPrompt == true) {

            if (selfHosted == false) {
                // only re-launch the commander from here with the arguments specified
                await ns.run("commander.js", 1, target, hostName, portNumber);
                await ns.sleep(505);
                ns.exit();
                await ns.sleep(505); // extra sleep cause exit() is being weird.
            } // end if selfHosted = false
            if (selfHosted == true) {
                // if selfHosted = true we launch it there after sending files over
                var fileBox = ["commander.js","1xhack.js","1xweak.js","1xgrow.js","phase1.js","phase2.js","phase3.js","grail.js"];
                await ns.scp(fileBox, hostName, "home");
                await ns.exec("commander.js", hostName, 1, target, hostName, portNumber);
                await ns.sleep(1511);
                ns.exit();
                await ns.sleep(111);
            } // End selfHosted = true

        } //ends ready check=true

        if (readyCheckPrompt == false) {
            await ns.sleep(155);
            ns.exit(); // ready check canceled so exit
            await ns.sleep(101);
        } // ends ready check=false

    } // end: while ns.args[0] == null

    if (ns.args[0] != null) {
        // If the target argument was specified, but not others, it can still error out,
        // but honestly I'm good with that. 
        var target = ns.args[0]; // the server to hack $$ from
        var hostName = ns.args[1]; // the server to host scripts on
        var portNumber = ns.args[2]; // the port number to listen on
        var selfHosted = ns.args[3]; // if true, host the Phase 1/2/3 processes on the host server as well
    } // end if ns.args[0] is not null
	
	ns.disableLog("sleep"); // so we don't get a lot of sleep spam in the logs
    
    // runs a grail thread while this is going so we can see the money roll in
    // this is called outsite of any while loops so you can just kill the process
    // if you don't want it.
    ns.run("grail.js", 1, target);
	
    var serverArray = [target, hostName]; // array used for the root access check
        
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
    } // end for loop to process root access

    // now check root access to verify
    if (ns.hasRootAccess(target) == true && ns.hasRootAccess(hostName) == true) {
        // nothing
    } else {
        await ns.alert("Could not verify root access! Process ending.");
        ns.exit();
        await ns.sleep(101);
    } // end if check for root access
    

    if (selfHosted == true) {
        // Include commander, grail, and phase 1/2/3 files in fileBox to send to host server
        var fileBox = ["commander.js","1xhack.js","1xweak.js","1xgrow.js","phase1.js","phase2.js","phase3.js","grail.js"];
        await ns.scp(fileBox, hostName, "home");
        ns.exec("commander.js", hostName, 1, target, hostName, portNumber);
        await ns.sleep(505);
        ns.exit(); // new commander process should be launched, so shut down!
        await ns.sleep(111);
    } else {
        // just send the basics
        var fileBox = ["1xhack.js","1xweak.js","1xgrow.js"];
        await ns.scp(fileBox, hostName, "home");
    } //end if/else check to scp needed files

    await ns.sleep(1111); //always a sleep just in case...

    var activePhase;
            
    // first up, if the target needs weakening, launch phase 1
    if (ns.getServerSecurityLevel(target) > ns.getServerMinSecurityLevel(target)) {
        ns.print("*** Executing phase 1: weaken " + target);
        await ns.run("phase1.js", 1, target, hostName, portNumber);
        activePhase = "Phase 1";
        ns.print("*** Completed.");
    }

    // Begin target server funds check 
    if (ns.getServerMoneyAvailable(target) != ns.getServerMaxMoney(target)) {
        ns.print("*** Executing phase 2: grow funds on " + target);
        await ns.run("phase2.js", 1, target, hostName, portNumber);
        activePhase = "Phase 2";
        ns.print("*** Completed.");
    } else {
        ns.print("*** Executing phase 3: hack " + target);
        await ns.run("phase3.js", 1, target, hostName, portNumber);
        activePhase = "Phase 3";
        ns.print("*** Completed.");
    } // end target funds check


    // BEGIN LISTENER CODE
    // THIS WILL LISTEN TO A PORT SPECIFIED TO COMMAND THE PHASE 2 AND 3 SCRIPTS TO FIRE
    // (It only activates phase 1 on first-run for the initial weaken, all other weakens
    // are fired alongside the grow/hack thread processes.)

    var lastSignal = "(awaiting)"; // default message until first signal is received
    var statusMessage = "Ready."; // message when off cooldown
    var i = 1; // Iterator to (hopefully) count loop cycles

    while (true) {
        var pauseCycle = false;
        var curSignal = "...echoes..."

        while (pauseCycle == false) {
            // LISTENER SCRIPT GOOOOOO....
            let signal = ns.readPort(portNumber);
            ns.disableLog("run","sleep");
            ns.clearLog();
            ns.print(statusMessage);
            ns.print("Current signal: " + curSignal);
            ns.print("Last signal: " + lastSignal);
            ns.print("Current phase: " + activePhase);
            ns.print("Port #: " + portNumber + " Loop #: " + i);

            if (signal == 3) {
                ns.run("phase3.js", 1, target, hostName, portNumber);
                var lastSignal = "Activate: Phase 3";
                activePhase = "Phase 3";
                curSignal = 3;
                var pauseCycle = true;
                await ns.sleep(33);
                continue;
            }
            if (signal == 2) {
                ns.run("phase2.js", 1, target, hostName, portNumber);
                ++i;
                lastSignal = "Activate: Phase 2";
                activePhase = "Phase 2";
                curSignal = 2;
                var pauseCycle = true;
                await ns.sleep(33);
                continue;
            }
            if (signal == "NULL PORT DATA") {
                curSignal = "...echoes...";
                await ns.sleep(202);
                continue;
            } else {
                curSignal = signal;
                var lastSignal = signal;
                pauseCycle = true;
                await ns.sleep(179);
                continue;
            }
        } // end pauseCycle=false loop
        while (pauseCycle == true) {
            statusMessage = "*** ON 0.7 SECOND COOLDOWN ***";
            await ns.sleep(711);
            var pauseCycle = false;
        } // end pauseCycle=true loop
        // sleep. always sleep.
        await ns.sleep(31);

    } // end listener while loop
}