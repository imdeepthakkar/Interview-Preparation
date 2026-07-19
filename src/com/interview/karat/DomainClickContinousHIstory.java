package com.interview.karat;

import java.util.*;

public class DomainClickContinousHIstory {
    /*
     * PART 1: Aggregate raw log pairs into a map of UserId -> List of Domains visited.
     * Input: [["user1", "google.com"], ["user1", "yahoo.com"], ["user2", "google.com"]]
     * Time: O(N), Space: O(N)
     */
    public static Map<String, List<String>> buildUserHistories(String[][] logs) {
        Map<String, List<String>> userHistories = new HashMap<>();

        // Guard clause to prevent crashes from empty inputs
        if (logs == null || logs.length == 0) {
            return userHistories;
        }

        for (String[] log : logs) {
            String userId = log[0];
            String domain = log[1];

            userHistories.putIfAbsent(userId, new ArrayList<>());
            userHistories.get(userId).add(domain);
        }

        return userHistories;
    }

    /*
     * PART 2: Find the longest contiguous sequence of domains shared by two users.
     * Strategy: Dynamic Programming table (Longest Common Substring algorithm).
     * Time: O(M * N), Space: O(M * N)
     */
    public static List<String> findLongestCommon(List<String> history1, List<String> history2) {
        if (history1 == null || history2 == null) {
            return new ArrayList<>();
        }

        int maxLen = 0;
        int endIndex = -1; // Tracks where the sequence ends in history1

        // Extract sizes to clean variables to prevent IDE bracket-swallowing glitches
        int len1 = history1.size();
        int len2 = history2.size();

        // Initialize DP matrix using the clean variables
        int[][] dp = new int[len1 + 1][len2 + 1];

        for (int i = 1; i <= len1; i++) {
            for (int j = 1; j <= len2; j++) {

                // If the domains match, add 1 to the diagonal value
                if (history1.get(i - 1).equals(history2.get(j - 1))) {
                    dp[i][j] = dp[i - 1][j - 1] + 1;

                    // Update max length and end index if we found a new longest sequence
                    if (dp[i][j] > maxLen) {
                        maxLen = dp[i][j];
                        endIndex = i;
                    }
                }
            }
        }

        if (maxLen == 0) {
            return new ArrayList<>();
        }

        // Extract the sublist using the end index and max length
        return history1.subList(endIndex - maxLen, endIndex);
    }

    /*
     * PART 3: Find if a user's path contains a specific start and end domain,
     * with exactly one intermediate click between them.
     * Example: "Home" -> (Any 1 page) -> "Checkout"
     * Time: O(N), Space: O(1)
     */
    public static boolean hasOneStepCheckout(List<String> userHistory, String startPage, String endPage) {
        if (userHistory == null || userHistory.size() < 3) {
            return false;
        }

        // Slide a window of size 3 across the history
        for (int i = 0; i <= userHistory.size() - 3; i++) {
            // Check if index matches startPage AND index+2 matches endPage
            if (userHistory.get(i).equals(startPage) && userHistory.get(i + 2).equals(endPage)) {
                return true;
            }
        }

        return false;
    }
}
