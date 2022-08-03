// *** MADE FOR THE GAME BITRUNNER ***
// THIS IS A BASIC INFO PAGE FOR USE WHEN YOU
// WANT TO SEE MORE INFO ABOUT A SERVER WITHOUT
// HAVING TO CONNECT TO IT FIRST

// USAGE: run gr0k.js HOST
// EXAMPLE: run gr0k.js n00dles
// THIS PRINTS AN INFOPAGE TO THE TERMINAL DISPLAYING
// UPDATED RAM, SECURITY, HGW PROCESS TIMES AND SO ON

// COPY/PASTE THE FOLLOWING TO YOUR TERMINAL FOR EASY
// ACCESS, YOU CAN JUST TYPE "gr0k n00dles" THIS WAY
// alias gr0k="run gr0k.js"

/** @param {NS} ns */
export async function main(ns) {
	var target = ns.args[0];

    // FOR HGW TIMES, DIVIDE BY 1000 TO GET SECONDS
    // THEN BY 60 TO GET THE TIME IN MINUTES
	var htime = ns.getHackTime(target);
	var h2 = Math.round(htime) / 1000 / 60;
	var gtime = ns.getGrowTime(target);
	var g2 = Math.round(gtime) / 1000 / 60;
	var wtime = ns.getWeakenTime(target);
	var w2 = Math.round(wtime) / 1000 / 60;

	var moneyAvailable = ns.getServerMoneyAvailable(target);
	var maxmoney = ns.getServerMaxMoney(target);
	var myhacklevel = ns.getHackingLevel();
	var srvhacklevel = ns.getServerRequiredHackingLevel(target);
	var serverseclevel = ns.getServerSecurityLevel(target);
	var serverram = ns.getServerMaxRam(target);
	var serverusedram = ns.getServerUsedRam(target);

	// BEGIN THE DIALOGS PRINTING TO TERMINAL
    ns.tprint("*** ");
	ns.tprint("***************************************");
	ns.tprint("***** SERVER INFO FOR " + target + " *****");
    
    // CODE TO ALERT YOU IF YOU'RE UNABLE TO HACK IT YET
	if (myhacklevel < srvhacklevel){
		ns.tprint("*** ");
		ns.tprint("*** _>_>_>_CAN_!_NOT_!_h4CK_!_!_!_ ***");
		ns.tprint("*** ");
	}

	ns.tprint("***************************************");
	ns.tprint("*** ");
	ns.tprint("*** SERVER USED/TOTAL RAM: " + serverusedram + "/" + serverram + "gb");
	ns.tprint("*** ");
	ns.tprint("***************************************");
	ns.tprint("*** SERVER MONEY AVAILABLE: $" + moneyAvailable.toFixed(0));
	ns.tprint("*** SERVER MAX MONEY: $" + maxmoney);
	ns.tprint("***************************************");
	ns.tprint("*** ");
	ns.tprint("*** SERVER'S REQUIRED HACKING LEVEL IS: " + srvhacklevel);
	ns.tprint("*** MY HACKING LEVEL IS CURRENTLY " + myhacklevel);
	ns.tprint("*** CURRENT SECURITY LEVEL: " + serverseclevel.toFixed(2));
	ns.tprint("*** ");

    // HGW TIME CALCULATIONS ARE ALREADY FACTORED INTO MINUTES ABOVE
    // THE ".toFixed(2)" HERE TRUNCATES IT TO 2 DECIMAL PLACES
	ns.tprint("*** CURRENT HACK TIME: " + h2.toFixed(2) + " minutes");
	ns.tprint("*** CURRENT GROW TIME: " + g2.toFixed(2) + " minutes");
	ns.tprint("*** CURRENT WEAKEN TIME: " + w2.toFixed(2) + " minutes");

	ns.tprint("*** ");
}