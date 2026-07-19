package com.interview.karat;

import java.util.*;

public class VotingSystemSequence {

    /*
     * PART 1: Find the winner of a simple majority vote.
     * Time: O(N), Space: O(U) where U is unique candidates.
     */
    public static String findWinner(List<String> votes) {
        Map<String, Integer> counts = new HashMap<>();
        String winner = "";
        int maxVotes = 0;

        for (String candidate : votes) {
            int currentVotes = counts.getOrDefault(candidate, 0) + 1;
            counts.put(candidate, currentVotes);

            if (currentVotes > maxVotes) {
                maxVotes = currentVotes;
                winner = candidate;
            }
        }
        return winner;
    }

    /*
     * PART 2: Ranked Choice Voting (1st = 3 pts, 2nd = 2 pts, 3rd = 1 pt).
     * Time: O(N), Space: O(U)
     */
    public static String findRankedWinner(List<List<String>> ballots) {
        Map<String, Integer> scores = new HashMap<>();

        for (List<String> ballot : ballots) {
            if (ballot.size() == 3) {
                String first = ballot.get(0);
                String second = ballot.get(1);
                String third = ballot.get(2);

                scores.put(first, scores.getOrDefault(first, 0) + 3);
                scores.put(second, scores.getOrDefault(second, 0) + 2);
                scores.put(third, scores.getOrDefault(third, 0) + 1);
            }
        }

        String winner = "";
        int maxScore = 0;
        for (Map.Entry<String, Integer> entry : scores.entrySet()) {
            if (entry.getValue() > maxScore) {
                maxScore = entry.getValue();
                winner = entry.getKey();
            }
        }
        return winner;
    }

    /*
     * PART 3: Ranked Voting with Tie-Breakers.
     * Tie-breaker order: Total Score -> Most 1st place -> Most 2nd place.
     * Time: O(N + U log U) due to sorting candidates at the end.
     */
    public static String findUltimateWinner(List<List<String>> ballots) {
        // Maps Candidate -> [TotalPoints, 1stPlaceCount, 2ndPlaceCount, 3rdPlaceCount]
        Map<String, int[]> candidateStats = new HashMap<>();

        for (List<String> ballot : ballots) {
            if (ballot.size() == 3) {
                updateStats(candidateStats, ballot.get(0), 3, 1);
                updateStats(candidateStats, ballot.get(1), 2, 2);
                updateStats(candidateStats, ballot.get(2), 1, 3);
            }
        }

        List<Map.Entry<String, int[]>> results = new ArrayList<>(candidateStats.entrySet());

        results.sort((a, b) -> {
            int[] statsA = a.getValue();
            int[] statsB = b.getValue();

            if (statsA[0] != statsB[0]) return Integer.compare(statsB[0], statsA[0]);
            if (statsA[1] != statsB[1]) return Integer.compare(statsB[1], statsA[1]);
            if (statsA[2] != statsB[2]) return Integer.compare(statsB[2], statsA[2]);
            return 0;
        });

        return results.isEmpty() ? "" : results.get(0).getKey();
    }

    private static void updateStats(Map<String, int[]> stats, String candidate, int points, int rankIndex) {
        stats.putIfAbsent(candidate, new int[4]);
        int[] data = stats.get(candidate);
        data[0] += points;
        data[rankIndex] += 1;
    }
}