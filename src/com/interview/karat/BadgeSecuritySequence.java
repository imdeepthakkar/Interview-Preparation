package com.interview.karat;

import java.util.*;

public class BadgeSecuritySequence {

    /*
     * PART 1: Find employees who entered without exiting, or exited without entering.
     * Input format: [Name, Action]
     * Time: O(N), Space: O(N)
     */
    public static void findMismatchedBadges(String[][] records) {
        Set<String> inBuilding = new HashSet<>();
        Set<String> exitWithoutEnter = new HashSet<>();
        Set<String> enterWithoutExit = new HashSet<>();

        for (String[] record : records) {
            String name = record[0];
            String action = record[1];

            if (action.equals("enter")) {
                if (inBuilding.contains(name)) {
                    enterWithoutExit.add(name);
                }
                inBuilding.add(name); // add to the building as entered
            } else if (action.equals("exit")) {
                if (!inBuilding.contains(name)) {
                    exitWithoutEnter.add(name);
                }
                inBuilding.remove(name); //remove from the building as exited
            }
        }
        //Add rest of the people who have entered and not exited
        enterWithoutExit.addAll(inBuilding);

        System.out.println("Exited without entering: " + exitWithoutEnter);
        System.out.println("Entered without exiting: " + enterWithoutExit);
    }

    /*
     * PART 2: Find employees who badged in 3 or more times within a 1-hour window.
     * Input format: [Name, Time]
     * Time: O(N log N) per user due to sorting times. Space: O(N)
     */
    public static Map<String, List<Integer>> findSuspiciousAccess(String[][] records) {
        Map<String, List<Integer>> userTimes = new HashMap<>();
        Map<String, List<Integer>> suspicious = new HashMap<>();

        //create a map with name as key and list of times
        /*
            {
                 "Paul" -> [1355, 1405],
                 "Eli"  -> [1400]
            }
        */
        for (String[] record : records) {
            String name = record[0];
            int time = Integer.parseInt(record[1]);
            userTimes.putIfAbsent(name, new ArrayList<>());
            userTimes.get(name).add(time);
        }

        for (Map.Entry<String, List<Integer>> entry : userTimes.entrySet()) {
            String name = entry.getKey();
            List<Integer> times = entry.getValue();
            Collections.sort(times);
            //check for the next 3 times
            for (int i = 0; i <= times.size() - 3; i++) {
                if (isWithinOneHour(times.get(i), times.get(i + 2))) {
                    suspicious.put(name, Arrays.asList(times.get(i), times.get(i+1), times.get(i+2)));
                    break;
                }
            }
        }
        return suspicious;
    }

    private static boolean isWithinOneHour(int time1, int time2) {
        int totalMins1 = (time1 / 100 * 60) + (time1 % 100);
        int totalMins2 = (time2 / 100 * 60) + (time2 % 100);
        return (totalMins2 - totalMins1) <= 60;
    }

    /*
     * PART 3: Given [Name, Action, Room, Time], return the chronological sequence
     * of rooms entered for each employee.
     * Time: O(N log N) due to sorting logs. Space: O(N)
     */
    public static Map<String, List<String>> getEmployeeRoomPaths(String[][] records) {
        Map<String, List<String[]>> userLogs = new HashMap<>();
        Map<String, List<String>> roomPaths = new HashMap<>();
        //create a new hashmap and add a employee as key and add record as value
        for (String[] record : records) {
            String name = record[0];
            userLogs.putIfAbsent(name, new ArrayList<>());
            userLogs.get(name).add(record);
        }

        for (Map.Entry<String, List<String[]>> entry : userLogs.entrySet()) {
            String name = entry.getKey();
            List<String[]> logs = entry.getValue();

            // Sort chronologically by Time (Index 3)
            logs.sort((a, b) -> Integer.compare(Integer.parseInt(a[3]), Integer.parseInt(b[3])));
//            logs.sort(Comparator.comparingInt(a -> Integer.parseInt(a[3])));

            List<String> path = new ArrayList<>();
            for (String[] log : logs) {
                if (log[1].equals("enter")) {
                    path.add(log[2]);
                }
            }
            //if there are path by employee add to the list
            if (!path.isEmpty()) {
                roomPaths.put(name, path);
            }
        }
        return roomPaths;
    }

    public static void main(String[] args) {

        // ---------------------------------------------------------
        // PART 1: Mismatched Badges (Enter without Exit / Exit without Enter)
        // ---------------------------------------------------------
        String[][] part1Logs = {
                {"Martha", "exit"},    // Exits without entering
                {"Paul", "enter"},     // Enters
                {"Martha", "enter"},   // Enters normally
                {"Martha", "exit"},    // Exits normally
                {"Jennifer", "enter"}, // Enters but never exits
                {"Paul", "exit"},      // Paul exits
                {"John", "exit"}       // Exits without entering
        };

        System.out.println("--- PART 1: Mismatched Badges ---");
        findMismatchedBadges(part1Logs);
        // Expected Output:
        // Exited without entering: [Martha, John]
        // Entered without exiting: [Jennifer]


        // ---------------------------------------------------------
        // PART 2: Suspicious Access (3+ badge-ins within 1 hour)
        // Input Format: [Name, Time in HHMM]
        // ---------------------------------------------------------
        String[][] part2Logs = {
                {"Paul", "1355"},
                {"Eli", "1400"},
                {"Paul", "1405"},
                {"Paul", "1430"}, // Paul's 3rd badge in 35 minutes (1355 to 1430) -> Suspicious
                {"Eli", "1435"},
                {"Eli", "1500"},  // Eli's 3rd badge in exactly 60 minutes (1400 to 1500) -> Suspicious
                {"Paul", "1630"},
                {"John", "0830"},
                {"John", "0945"}  // John is safe (only 2 badges)
        };

        System.out.println("\n--- PART 2: Suspicious Access ---");
        Map<String, List<Integer>> suspicious = findSuspiciousAccess(part2Logs);
        for (Map.Entry<String, List<Integer>> entry : suspicious.entrySet()) {
            System.out.println(entry.getKey() + ": " + entry.getValue());
        }
            // Expected Output:
            // Paul: [1355, 1405, 1430]
            // Eli: [1400, 1435, 1500]


        // ---------------------------------------------------------
        // PART 3: Room Paths (Chronological sequence of rooms entered)
        // Input Format: [Name, Action, Room, Time]
        // Note: Intentionally scrambled to test chronological sorting.
        // ---------------------------------------------------------
        String[][] part3Logs = {
                {"Paul", "enter", "Engineering", "1410"},
                {"Eli", "enter", "Lobby", "1400"},
                {"Paul", "enter", "Kitchen", "1355"},     // Happened before Engineering
                {"Paul", "exit", "Kitchen", "1405"},
                {"Eli", "exit", "Lobby", "1430"},
                {"Eli", "enter", "ServerRoom", "1435"}
        };

        System.out.println("\n--- PART 3: Employee Room Paths ---");
        Map<String, List<String>> roomPaths = getEmployeeRoomPaths(part3Logs);
        for (Map.Entry<String, List<String>> entry : roomPaths.entrySet()) {
            System.out.println(entry.getKey() + ": " + entry.getValue());
        }
        // Expected Output:
        // Paul: [Kitchen, Engineering]  <-- Kitchen must come first because of the time!
        // Eli: [Lobby, ServerRoom]
    }
}
