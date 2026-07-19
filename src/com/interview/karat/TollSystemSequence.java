package com.interview.karat;

import java.util.*;

public class TollSystemSequence {

    /*
     * PART 1: Given a list of log strings, return a Map showing the total number
     * of complete journeys each license plate took. A journey starts with "ENTRY".
     * Input format: "34400.409 SXY288 210E ENTRY"
     * Time: O(N), Space: O(U) where U is unique license plates.
     */
    public static Map<String, Integer> countJourneys(String[] logs) {
        Map<String, Integer> journeyCounts = new HashMap<>();
        if (logs == null || logs.length == 0) return journeyCounts;

        for (String log : logs) {
            String[] parts = log.split(" ");
            // parts[0] = Timestamp, parts[1] = Plate, parts[2] = Location, parts[3] = Type (action)

            if (parts.length == 4) {
                String plate = parts[1];
                String type = parts[3];

                // We only need to count entries to know how many journeys occurred
                if (type.equals("ENTRY")) {
                    journeyCounts.put(plate, journeyCounts.getOrDefault(plate, 0) + 1);
                }
            }
        }
        return journeyCounts;
    }

    /*
     * PART 2: Catch Extreme Speeders. Return a Set of license plates that drove
     * 130 km/h or faster in ANY single 10km segment.
     * Note: Consecutive logs for a vehicle during a journey represent a 10km segment.
     * Speed formula: (10km / time_diff_in_seconds) * 3600 sec/hr
     * Time: O(N), Space: O(U)
     */
    public static Set<String> catchExtremeSpeeders(String[] logs) {
        Set<String> speeders = new HashSet<>();
        Map<String, Double> lastSeenTime = new HashMap<>();

        for (String log : logs) {
            String[] parts = log.split(" ");

            // TRAP AVOIDED: Must parse as Double, not Integer
            double timestamp = Double.parseDouble(parts[0]);
            String plate = parts[1];
            String type = parts[3];

            if (type.equals("ENTRY")) {
                lastSeenTime.put(plate, timestamp);
            }
            else if (type.equals("MAINROAD") || type.equals("EXIT")) {
                if (lastSeenTime.containsKey(plate)) {
                    double prevTime = lastSeenTime.get(plate);
                    double timeDiff = timestamp - prevTime;

                    // Calculate km/h
                    double speed = (10.0 / timeDiff) * 3600.0;

                    if (speed >= 130.0) {
                        speeders.add(plate);
                    }
                }

                // Reset or update state
                if (type.equals("EXIT")) {
                    lastSeenTime.remove(plate); // Journey ended
                } else {
                    lastSeenTime.put(plate, timestamp); // Update for the next segment
                }
            }
        }
        return speeders;
    }

    /*
     * PART 3: Catch All Speeders. The logs might be UNSORTED.
     * Unsafe speed is defined as:
     * 1. >= 130 km/h in ANY single 10km segment.
     * 2. >= 120 km/h in ANY TWO 10km segments within the SAME journey.
     * Strategy: Group by user, sort chronologically, and track violation counts.
     */
    public static Set<String> catchAllSpeeders(String[] logs) {
        Set<String> speeders = new HashSet<>();
        Map<String, List<String[]>> userLogs = new HashMap<>();

        // 1. Parse and group logs by license plate
        for (String log : logs) {
            String[] parts = log.split(" ");
            String plate = parts[1];
            userLogs.putIfAbsent(plate, new ArrayList<>());
            userLogs.get(plate).add(parts);
        }

        // 2. Evaluate each vehicle's chronological history
        for (Map.Entry<String, List<String[]>> entry : userLogs.entrySet()) {
            String plate = entry.getKey();
            List<String[]> history = entry.getValue();

            // Sort chronologically by the timestamp (Index 0)
            history.sort((a, b) -> Double.compare(Double.parseDouble(a[0]), Double.parseDouble(b[0])));

            double lastTime = -1;
            int segmentsOver120 = 0;

            for (String[] log : history) {
                double timestamp = Double.parseDouble(log[0]);
                String type = log[3];

                if (type.equals("ENTRY")) {
                    lastTime = timestamp;
                    segmentsOver120 = 0; // Reset violation count for a new journey
                }
                else if (type.equals("MAINROAD") || type.equals("EXIT")) {
                    if (lastTime != -1) {
                        double timeDiff = timestamp - lastTime;
                        double speed = (10.0 / timeDiff) * 3600.0;

                        // Apply the two speeding rules
                        if (speed >= 130.0) {
                            speeders.add(plate);
                        } else if (speed >= 120.0) {
                            segmentsOver120++;
                            if (segmentsOver120 >= 2) {
                                speeders.add(plate);
                            }
                        }
                    }

                    // State Management
                    if (type.equals("EXIT")) {
                        lastTime = -1;
                        segmentsOver120 = 0; // End of journey
                        } else {
                            lastTime = timestamp;
                        }
                }
            }
        }
        return speeders;
    }

    public static Map<String, Integer> getStrictCompletedJourneys(String[] logs) {
        Map<String, Integer> journeyCounts = new HashMap<>();

        // Tracks cars that have officially entered but not yet exited
        Set<String> onHighway = new HashSet<>();

        if (logs == null || logs.length == 0) return journeyCounts;

        for (String log : logs) {
            String[] parts = log.split(" ");
            String plate = parts[1];
            String action = parts[3];

            if (action.equals("ENTRY")) {
                // Mark the car as currently on a valid journey
                onHighway.add(plate);
            }
            else if (action.equals("EXIT")) {
                // Only count as complete IF we actually saw them enter
                if (onHighway.contains(plate)) {
                    journeyCounts.put(plate, journeyCounts.getOrDefault(plate, 0) + 1);
                    // Remove them from the highway so we don't double-count future exits
                    onHighway.remove(plate);
                }
            }
        }

        return journeyCounts;
    }

    public static void main(String[] args) {
        // Unsorted sample logs demonstrating various scenarios
        String[] logs = {
                // GHI333: Journey 2 (Safe driver, ~90 km/h)
                "4000.000 GHI333 210E ENTRY",
                "4400.000 GHI333 211E MAINROAD",
                "4800.000 GHI333 212E EXIT",

                // ABC111: Journey 1 (Extreme speeder, 200s for 10km = 180 km/h)
                "100.000 ABC111 210E ENTRY",
                "300.000 ABC111 211E MAINROAD",
                "800.000 ABC111 212E EXIT",

                // DEF222: Journey 1 (Moderate speeder, 290s for 10km = ~124 km/h)
                // Two violations in the same journey will trigger the Part 3 rule
                "1000.000 DEF222 210E ENTRY",
                "1290.000 DEF222 211E MAINROAD",
                "1580.000 DEF222 212E EXIT",

                // GHI333: Journey 1 (Safe driver, ~90 km/h)
                "2000.000 GHI333 210E ENTRY",
                "2400.000 GHI333 211E EXIT"
        };

        System.out.println("--- PART 1: Count Journeys ---");
        Map<String, Integer> journeys = countJourneys(logs);
        for (Map.Entry<String, Integer> entry : journeys.entrySet()) {
            System.out.println("Plate " + entry.getKey() + " made " + entry.getValue() + " journey(s).");
        }
        // Expected: GHI333=2, ABC111=1, DEF222=1

        System.out.println("\n--- PART 2: Extreme Speeders (>= 130 km/h in any single segment) ---");
        Set<String> extremeSpeeders = catchExtremeSpeeders(logs);
        System.out.println("Extreme Speeders: " + extremeSpeeders);
        // Expected: [ABC111] (DEF222 was only going ~124 km/h, so they escape this rule)

        System.out.println("\n--- PART 3: All Speeders (Includes >= 120 km/h in two segments) ---");
        Set<String> allSpeeders = catchAllSpeeders(logs);
        System.out.println("All Speeders: " + allSpeeders);
        // Expected: [ABC111, DEF222] (DEF222 gets caught here for two 124 km/h segments)

        System.out.println("\n--- PART 4: Count Journeys -including entry and exit ---");
        Map<String, Integer> strictJourneys = getStrictCompletedJourneys(logs);
        for (Map.Entry<String, Integer> entry : journeys.entrySet()) {
            System.out.println("Plate " + entry.getKey() + " made " + entry.getValue() + " journey(s).");
        }
    }
}