package com.interview.practice;

import java.util.*;

public class TollSystem {
    public static void main(String[] args) {
// The exact test scenario from the visualization
        String[][] testRecords = {
                {"ABC-123", "enter"}, // Perfect trip starts
                {"ABC-123", "exit"},  // Perfect trip ends
                {"XYZ-999", "exit"},  // Error: Missing entry
                {"LMN-456", "enter"}, // Error: First entry (missed exit after this)
                {"LMN-456", "enter"}  // Second entry triggers the error for the first one
        };

        // Run the logic
        List<List<String>> results = findCameraMistakes(testRecords);

        // Results come back as a List containing two Lists.
        // Index 0 is missingEntry, Index 1 is missingExit.
        List<String> missingEntry = results.get(0);
        List<String> missingExit = results.get(1);

        System.out.println("--- Toll Camera Error Report ---");

        System.out.println("\nVehicles with a Missing Entry (Exited without entering):");
        System.out.println(missingEntry.isEmpty() ? "[None]" : missingEntry);

        System.out.println("\nVehicles with a Missing Exit (Entered without exiting):");
        System.out.println(missingExit.isEmpty() ? "[None]" : missingExit);
    }
    public static List<List<String>> findCameraMistakes(String[][] records){

        Set<String> onHighway = new HashSet<>();
        Set<String> missingEntry = new HashSet<>();
        Set<String> missingExit = new HashSet<>();

        for(String [] record : records){

            String licensePlate = record[0];
            String action = record[1]; // entry/exit

            if(action.equals("enter")){
                // If add() returns false, the car was already on the highway
                if(!onHighway.add(licensePlate)){
                    missingExit.add(licensePlate);
                }
            } else if(action.equals("exit")){
                // If remove() returns false, the car was not on the highway
                if(!onHighway.remove(licensePlate)){
                    missingEntry.add(licensePlate);
                }
            }
        }
        // Any cars remaining on the highway at the end missed their exit
        missingExit.addAll(onHighway);
        return Arrays.asList(
                new ArrayList<>(missingEntry),
                new ArrayList<>(missingExit)
        );
    }
}
