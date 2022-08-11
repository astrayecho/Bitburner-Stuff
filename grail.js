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
		// FOR HGW TIMES, THIS DIVIDES BY 1000 TO GET SECONDS
		// THEN AGAIN BY 60 TO GET THE TIME IN MINUTES
		var htime = ns.getHackTime(target);
		var h2 = Math.round(htime) / 1000 / 60;
		var gtime = ns.getGrowTime(target);
		var g2 = Math.round(gtime) / 1000 / 60;
		var wtime = ns.getWeakenTime(target);
		var w2 = Math.round(wtime) / 1000 / 60;

		// $$ FORMATTING IS WEIRD STILL, I MAY FIND A FIX LATER
		var moneyAvailable = ns.getServerMoneyAvailable(target);
		var formattedMoney = ns.nFormat(moneyAvailable,"0.00a")
		var maxmoney = ns.nFormat(ns.getServerMaxMoney(target), "0.00a")

		// BASICALLY MAKING VARS FOR ALL INFO TO BE ABLE TO
		// .print IT WITH FORMATTING/WITHOUT GETTING ERRORS
		var myhacklevel = ns.getHackingLevel();
		var srvhacklevel = ns.getServerRequiredHackingLevel(target);
		var serverseclevel = ns.getServerSecurityLevel(target);
		var serverminlevel = ns.getServerMinSecurityLevel(target);
		var serverram = ns.getServerMaxRam(target);
		var serverusedram = ns.getServerUsedRam(target);
		var serverGrowth = ns.getServerGrowth(target);
		var hackingchance = ns.hackAnalyzeChance(target) * 100;
		
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
		ns.print("* $ AVAIL/MAX: $" + formattedMoney + "/" + maxmoney);
		ns.print("*****************************************");
		ns.print("* HACK LVL/MY LVL: " + srvhacklevel + "/" + myhacklevel);
		ns.print("* SECURITY LVL/MIN: " + serverseclevel.toFixed(2) + "/" + serverminlevel);
		ns.print("* GROWTH PAR.: " + serverGrowth + " HACK CHANCE: " + hackingchance.toFixed(0) + "%");
		
		// HGW TIME CALCULATIONS ARE ALREADY FACTORED INTO MINUTES ABOVE
		// THE ".toFixed(2)" HERE TRUNCATES IT TO 2 DECIMAL PLACES
		ns.print("*****************************************");
		ns.print("* HACK/GROW/WEAKEN TIMES: ");
		ns.print("* H: " + h2.toFixed(1) + "mins G: " + g2.toFixed(1) + "mins W: " + w2.toFixed(1) + "mins");
		ns.print("*****************************************");
		
		// YOU CAN MOVE ns.tail OUTSIDE OF THE WHILE LOOP SO IT DOESN'T RESPAWN,
		// HOWEVER THIS IS A *FEATURE* SO YOU DON'T END UP WITH A BUNCH OF 
		// THESE PROCESSES LEFT OPEN & EATING UP RAM IN THE BACKGROUND
		await ns.tail("grail.js", "home", target);

		// PAUSE BEFORE RESETTING
		// YOU CAN CHANGE THE .sleep VALUE HERE BUT DON'T REMOVE IT
		// OR IT WILL CRASH THE while LOOP THIS RUNS IN
		await ns.sleep(1479);
		//KEEP THE PARTY GOING
		continue;
	}
}
