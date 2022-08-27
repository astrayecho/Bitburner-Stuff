// *** MADE FOR THE GAME BITBURNER ***
// THIS IS A BASIC INFO PAGE FOR USE WHEN YOU WANT MORE
// INFO ABOUT A SERVER WITHOUT HAVING TO CONNECT TO IT FIRST

// USAGE: run gr0k.js HOST
// EXAMPLE: run gr0k.js n00dles
// THIS PRINTS AN INFOPAGE TO THE TERMINAL DISPLAYING
// UPDATED RAM, SECURITY, HGW PROCESS TIMES AND SO ON

// NEW! CONNECT PATH USAGE: run gr0k.js HOST c
// EXAMPLE 2: run gr0k.js n00dles c
// THIS PRINTS THE SAME INFO PAGE BUT WITH A COPY/PASTE-ABLE
// CONNECT PATH TO A SERVER - THANKS TO REDDIT USER u/Vorthod

// COPY/PASTE THE FOLLOWING TO YOUR TERMINAL FOR EASY ACCESS:
// alias gr0k="run gr0k.js"
// THIS WAY YOU CAN JUST TYPE "gr0k n00dles" or "gr0k n00dles c"

/** @param {NS} ns */
export async function main(ns) {
	var target = ns.args[0];

    // Thanks to @saynt-garmo on github for formatting help!
	var htime = ns.getHackTime(target) / 1000; // hack time
	var h2 = ns.nFormat(htime, '00:00'); // formatted hack time
	var gtime = ns.getGrowTime(target) / 1000; // grow time
	var g2 = ns.nFormat(gtime, '00:00');
	var wtime = ns.getWeakenTime(target) / 1000; // weaken time
	var w2 = ns.nFormat(wtime, '00:00');

	// var moneyAvailable = ns.getServerMoneyAvailable(target);
	var moneyAvailable = ns.getServerMoneyAvailable(target).toLocaleString('en-US');
	var maxmoney = ns.getServerMaxMoney(target);
	var myhacklevel = ns.getHackingLevel();
	var srvhacklevel = ns.getServerRequiredHackingLevel(target);
	var serverseclevel = ns.getServerSecurityLevel(target);
	var serverminlevel = ns.getServerMinSecurityLevel(target);
	var serverram = ns.getServerMaxRam(target);
	var serverusedram = ns.getServerUsedRam(target);
	var serverGrowth = ns.getServerGrowth(target);
	var hackingchance = ns.hackAnalyzeChance(target) * 100;

	// BEGIN THE DIALOGS PRINTING TO TERMINAL
	ns.tprint("***************************************");
	ns.tprint("*** SERVER INFO: " + target);
	ns.tprint("***************************************");

	if (ns.hasRootAccess(target) == true) {
		ns.tprint("***********  ! ROOTED !  **************");
	} else {
		ns.tprint("*********  ! NOT ROOTED !  ************");
	}

    // CODE TO ALERT YOU IF YOU'RE UNABLE TO HACK IT YET
	if (myhacklevel < srvhacklevel){
		ns.tprint("***************************************");
		ns.tprint("******* > > > CAN NOT h4CK! ! ! *******");
	}

	ns.tprint("*** SERVER USED/TOTAL RAM: " + serverusedram.toFixed(1) + "/" + serverram + "gb");
	ns.tprint("***************************************");
	ns.tprint("*** MONEY AVAIL.: $" + moneyAvailable);
	ns.tprint("*** MAX: $" + maxmoney.toLocaleString('en-US'));
	ns.tprint("***************************************");
	ns.tprint("*** HACK LVL/MY LVL: " + srvhacklevel + " | " + myhacklevel);
	ns.tprint("*** SECURITY LVL/MIN: " + serverseclevel.toFixed(2) + "/" + serverminlevel);
	ns.tprint("*** GROWTH PAR.: " + serverGrowth + " HACK CHANCE: " + hackingchance.toFixed(0) + "%");
	ns.tprint("***************************************");
	ns.tprint("*** HACK/GROW/WEAKEN TIMES: ");
	ns.tprint("*** H: " + h2 + " G: " + g2 + " W: " + w2);
	ns.tprint("***************************************");

	if (ns.args[1] == "c") {
		ns.tprint("CONNECT PATH (Copy/paste to terminal): ");
		ns.tprint(connectCommandToServer(findPathToServer(ns, "home", ns.args[0])));
	} else {
		ns.tprint("*** CONNECT PATH: gr0k " + target + " c");
		ns.tprint("*** OR: run gr0k.js " + target + " c");
		ns.tprint("***************************************");
	}
}

/**
 * CONNECT PATH FUNCTIONALITY ADDED WITH MANY THANKS TO REDDIT USER u/Vorthod
 * returns an array containing all servers between currentServer and the target
 */
export function findPathToServer(ns, currentServer, target, previousServer) {
 
    //if we were asked to find the server we're currently on, we're done. 
    //Return an array with just that.
    if (currentServer == target) {
        return [currentServer];
    }
 
    //otherwise, see if the target is connected to one of our neighbors
    let neighbors = ns.scan(currentServer);
    for (var i = 0; i < neighbors.length; i++) {
        var neighbor = neighbors[i];
 
        //ignore any server we just visited, we don't want to go backwards
        //I don't think scan returns currentServer, but in case it does, treat it the same as the previous server
        if (neighbor == previousServer || neighbor == currentServer) {
            continue;
        }
 
        //recursively call findserver using neighbor as our new currentServer (and currentServer is our new previousServer)
        //Basically, check if our target is down this path
        let findResult = findPathToServer(ns, neighbor, target, currentServer);
 
        //if we got an actual answer back, create an array starting at currentServer followed by the findResult(s)
        //This will collapse the recursion into an array of all connections from home to target
        if (findResult != null) {
            var newResult = [currentServer].concat(findResult)
            return newResult;
        }
 
    }
 
    //If we get here, we didn't find our target connected to any of these neighbors. 
    //The target must've been down a different branch
    return null;
}
 
/**
 * Given an array of servers, make a copy-pasteable command that will chain terminal "connect" commands from first to last.
 * Useful for making things like commands that can take you from home to CSEC (and other faction-related servers).
 */
export function connectCommandToServer(pathArray) {
    var connectCommand = "";
    for (var i = 0; i < pathArray.length; i++) {
        if (pathArray[i] != "home") {
            connectCommand += "connect "
        }
        connectCommand += pathArray[i] + ";"
    }
    return connectCommand;
}