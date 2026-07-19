package com.interview.karat;

import java.util.*;

public class WordGameSequence {

    /*
     * PART 1: Determine if a single target word can be built from available letters.
     * Time: O(L + W), Space: O(1)
     */
    public static boolean canBuildWord(String availableLetters, String targetWord) {
        int[] letterCounts = new int[26];

        for (char c : availableLetters.toCharArray()) {
            letterCounts[c - 'a']++;
        }

        for (char c : targetWord.toCharArray()) {
            letterCounts[c - 'a']--;
            if (letterCounts[c - 'a'] < 0) {
                return false;
            }
        }
        return true;
    }

    /*
     * PART 2: Find the longest valid word from a dictionary using available letters.
     * Strategy: Reuses Part 1 as a helper method.
     * Time: O(L + N * W), Space: O(1)
     */
    public static String findLongestWord(String availableLetters, List<String> dictionary) {
        String longestWord = "";

        for (String word : dictionary) {
            if (word.length() > longestWord.length()) {
                if (canBuildWord(availableLetters, word)) {
                    longestWord = word;
                }
            }
        }
        return longestWord;
    }

    /*
     * PART 3: The available letters now contain wildcards ('-').
     * Determine if the word can be built.
     * Time: O(L + W), Space: O(1)
     */
    public static boolean canBuildWordWithWildcard(String availableLetters, String targetWord) {
        int[] letterCounts = new int[26];
        int wildcards = 0;

        for (char c : availableLetters.toCharArray()) {
            if (c == '-') {
                wildcards++;
            } else {
                letterCounts[c - 'a']++;
            }
        }

        for (char c : targetWord.toCharArray()) {
            if (letterCounts[c - 'a'] > 0) {
                letterCounts[c - 'a']--;
            } else if (wildcards > 0) {
                wildcards--;
            } else {
                return false;
            }
        }
        return true;
    }
}