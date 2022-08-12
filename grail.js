// *** MADE FOR THE GAME BITBURNER ***
// GRAIL IS A BASIC INFO PAGE FOR USE WHEN YOU WANT ONGOING
// DATA ABOUT A SERVER, TO VERIFY YOUR SCRIPTS ARE WORKING
// CORRECTLY, OR JUST TO WATCH THE $$$s GO UP AND DOWN :D

// !! REQUIRES 3.55gb/RAM WHILE IN USE !!
// !! BE SURE TO *KILL* THE PROCESS BEFORE CLOSING THE TAIL
// !! WINDOW OR IT WILL CONTINUE TO KEEP SPAWNING ITSELF
// !! THIS IS COMMENTED NEAR THE BOTTOM OF THE FILE IN CASE
// !! YOU WISH TO DISABLE THIS FEATURE.

// USAGE: run grail.js HOST
// EXAMPLE: run grail.js n00dles
// THIS PRINTS AN INFOPAGE TO A TAIL WINDOW DISPLAYING
// UPDATED $, RAM, SECURITY, H/G/W TIMES AND MORE INFO

// AS MENTIONED ABOVE, YOU DO NOT NEED TO ADD "--tail"
// TO THE END OF YOUR COMMAND, IT SPAWNS THE TAIL
// SCREEN FOR YOU. 

// COPY/PASTE THE FOLLOWING TO YOUR TERMINAL FOR EASY ACCESS:
// alias grail="run grail.js"
// THIS WAY YOU CAN JUST TYPE "grail n00dles" or "grail n00dles c"

// ***** TAIL VERSION *****

/** @param {NS} ns */
export async function main(ns) {
	var target = ns.args[0];
	ns.disableLog("sleep");
	
	while (true) {
		// Thanks to @saynt-garmo on github for formatting help!
		var htime = ns.getHackTime(target) / 1000; // hack time
		var h2 = ns.nFormat(htime, '00:00'); // formatted hack time
		var gtime = ns.getGrowTime(target) / 1000; // grow time
		var g2 = ns.nFormat(gtime, '00:00');
		var wtime = ns.getWeakenTime(target) / 1000; // weaken time
		var w2 = ns.nFormat(wtime, '00:00');
		var moneyAvailable = ns.nFormat(ns.getServerMoneyAvailable(target),"0.00a"); // current $$ available
		var maxmoney = ns.nFormat(ns.getServerMaxMoney(target), "0.00a"); // maximum $$ possible

		// BASICALLY MAKING VARS FOR ALL THE INFOS TO BE ABLE TO
		// .print IT WITH FORMATTING/WITHOUT GETTING ERRORS
		var myhacklevel = ns.getHackingLevel(); // player's hacking level
		var srvhacklevel = ns.getServerRequiredHackingLevel(target); // server hacking level requirement
		var serverseclevel = ns.getServerSecurityLevel(target); // current server security level
		var serverminlevel = ns.getServerMinSecurityLevel(target); // minimum server sec. level
		var serverram = ns.getServerMaxRam(target); // server RAM
		var serverusedram = ns.getServerUsedRam(target); // server's used RAM
		var serverGrowth = ns.getServerGrowth(target); // the server's growth parameter, higher = better!
		var hackingchance = ns.hackAnalyzeChance(target) * 100; // player's chance to hack the server
		
		// THIS CLEARS ALL THE LOGS THE ABOVE FUNCTIONS SPIT OUT
		await ns.clearLog();

		// BEGIN THE DIALOGS PRINTING TO TAIL WINDOW
		ns.print("*****************************************");
		ns.print("*** SERVER INFO: " + target + " ***");

		// ROOT/NUKE.exe ACCESS CHECK
		if (ns.hasRootAccess(target) == true) {
			ns.print("************  ! ROOTED !  ***************");
		} else {
			ns.print("**********  ! NOT ROOTED !  *************");
		}

		// CODE TO ALERT YOU IF YOU'RE UNABLE TO HACK IT YET
		if (myhacklevel < srvhacklevel){
			ns.print("******* > > > CAN NOT h4CK! ! ! *********");
		}

		// FORMATTED INFO DIALOGS
		ns.print("*****************************************");
		ns.print("* SERVER USED/TOTAL RAM: " + serverusedram.toFixed(1) + "/" + serverram + "gb");
		ns.print("*****************************************");
		ns.print("* $ AVAIL/MAX: $" + moneyAvailable + "/" + maxmoney);
		ns.print("*****************************************");
		ns.print("* HACK LVL/MY LVL: " + srvhacklevel + "/" + myhacklevel);
		ns.print("* SECURITY LVL/MIN: " + serverseclevel.toFixed(2) + "/" + serverminlevel);
		ns.print("* GROWTH PAR.: " + serverGrowth + " HACK CHANCE: " + hackingchance.toFixed(0) + "%");
		
		// HGW TIME CALCULATIONS ARE ALREADY FACTORED INTO MINUTES ABOVE
		// THE ".toFixed(2)" HERE TRUNCATES IT TO 2 DECIMAL PLACES
		ns.print("*****************************************");
		ns.print("* HACK/GROW/WEAKEN TIMES: ");
		ns.print("* H: " + h2 + " G: " + g2 + " W: " + w2);
		ns.print("*****************************************");
		
		// YOU CAN MOVE ns.tail OUTSIDE OF THE WHILE LOOP SO IT DOESN'T RESPAWN,
		// HOWEVER THIS IS A *FEATURE* SO YOU DON'T END UP WITH A BUNCH OF 
		// THESE PROCESSES LEFT OPEN & EATING UP RAM IN THE BACKGROUND
		await ns.tail();

		// PAUSE BEFORE RESETTING
		// YOU CAN CHANGE THE .sleep VALUE HERE BUT DON'T REMOVE IT
		// OR IT WILL CRASH THE while LOOP THIS RUNS IN
		await ns.sleep(1479);
		//KEEP THE PARTY GOING
		continue;
	}
}
