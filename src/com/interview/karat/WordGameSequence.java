package com.interview.karat;

import java.util.*;

// @Title WordGameSequence
// @Category Counting

public class WordGameSequence {

        // @Part 1
    // @Subtitle Can Build Word
    // @Analogy Checking if you have the right Scrabble letters to spell a word.
    // @Trick Create `int[26]` frequency array. Add counts for available letters. Loop target word, decrement counts. If `< 0`, return false.
    // @Time O(L + W)
    // @Space O(1)
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

        // @Part 2
    // @Subtitle Longest Word
    // @Analogy Given a dictionary, find the longest word you can spell.
    // @Trick Loop dictionary, check `if (word.length() > longest.length())`. Use Part 1 helper function to check if buildable.
    // @Time O(N * W)
    // @Space O(1)
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

        // @Part 3
    // @Subtitle Wildcards
    // @Analogy You have blank Scrabble tiles '-' that can act as any letter.
    // @Trick Keep a separate `int wildcards` counter. If a target letter count is <= 0, decrement wildcards instead. If wildcards < 0, fail.
    // @Time O(L + W)
    // @Space O(1)
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