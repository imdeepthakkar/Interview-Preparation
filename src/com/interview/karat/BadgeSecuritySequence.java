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
                if (inBuilding.contains(name)) enterWithoutExit.add(name);
                inBuilding.add(name);
            } else if (action.equals("exit")) {
                if (!inBuilding.contains(name)) exitWithoutEnter.add(name);
                inBuilding.remove(name);
            }
        }
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

        for (String[] record : records) {
            String name = record[0];
            userLogs.putIfAbsent(name, new ArrayList<>());
            userLogs.get(name).add(record);
        }

        Map<String, List<String>> roomPaths = new HashMap<>();

        for (Map.Entry<String, List<String[]>> entry : userLogs.entrySet()) {
            String name = entry.getKey();
            List<String[]> logs = entry.getValue();

            // Sort chronologically by Time (Index 3)
            logs.sort((a, b) -> Integer.compare(Integer.parseInt(a[3]), Integer.parseInt(b[3])));

            List<String> path = new ArrayList<>();
            for (String[] log : logs) {
                if (log[1].equals("enter")) {
                    path.add(log[2]);
                }
            }
            if (!path.isEmpty()) roomPaths.put(name, path);
        }
        return roomPaths;
    }
}
