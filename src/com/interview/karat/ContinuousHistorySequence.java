package com.interview.karat;

import java.util.*;

public class ContinuousHistorySequence {

    /*
     * PART 1: Aggregate raw log pairs into a map of UserId -> List of Domains visited.
     * Time: O(N), Space: O(N)
     */
    public static Map<String, List<String>> buildUserHistories(String[][] logs) {
        Map<String, List<String>> userHistories = new HashMap<>();
        for (String[] log : logs) {
            userHistories.putIfAbsent(log[0], new ArrayList<>());
            userHistories.get(log[0]).add(log[1]);
        }
        return userHistories;
    }

    /*
     * PART 2: Find the longest contiguous sequence of domains shared by two users.
     * Strategy: DP table (Longest Common Substring).
     * Time: O(M * N), Space: O(M * N)
     */
    public static List<String> findLongestCommon(List<String> history1, List<String> history2) {
        int maxLen = 0;
        int endIndex = -1;
        int[][] dp = new int[history1.size() + 1][history2.size() + 1];

        for (int i = 1; i <= history1.size(); i++) {
            for (int j = 1; j <= history2.size(); j++) {
                if (history1.get(i - 1).equals(history2.get(j - 1))) {
                    dp[i][j] = dp[i - 1][j - 1] + 1;
                    if (dp[i][j] > maxLen) {
                        maxLen = dp[i][j];
                        endIndex = i;
                    }
                }
            }
        }

        if (maxLen == 0) return new ArrayList<>();
        return history1.subList(endIndex - maxLen, endIndex);
    }

    /*
     * PART 3: Find if a user's path contains a specific start and end domain,
     * with exactly one intermediate click.
     * Example: Did they go from "Home" -> (Any 1 page) -> "Checkout"?
     * Time: O(N), Space: O(1)
     */
    public static boolean hasOneStepCheckout(List<String> userHistory, String startPage, String endPage) {
        if (userHistory == null || userHistory.size() < 3) return false;

        for (int i = 0; i <= userHistory.size() - 3; i++) {
            if (userHistory.get(i).equals(startPage) && userHistory.get(i + 2).equals(endPage)) {
                return true;
            }
        }
        return false;
    }
}