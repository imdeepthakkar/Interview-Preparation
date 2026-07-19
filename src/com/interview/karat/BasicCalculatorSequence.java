package com.interview.karat;

import java.util.*;

public class BasicCalculatorSequence {

    /*
     * PART 1: Evaluate a string with positive integers, '+', and '-'.
     * Time: O(N), Space: O(1)
     */
    public static int evaluateSimple(String s) {
        int result = 0, currentNum = 0, sign = 1;

        for (char c : s.toCharArray()) {
            if (Character.isDigit(c)) {
                currentNum = currentNum * 10 + (c - '0');
            } else if (c == '+') {
                result += sign * currentNum;
                currentNum = 0; sign = 1;
            } else if (c == '-') {
                result += sign * currentNum;
                currentNum = 0; sign = -1;
            }
        }
        return result + (sign * currentNum);
    }

    /*
     * PART 2: Evaluate with parentheses using a Stack to hold previous contexts.
     * Time: O(N), Space: O(N)
     */
    public static int evaluateWithParentheses(String s) {
        Stack<Integer> stack = new Stack<>();
        int result = 0, currentNum = 0, sign = 1;

        for (char c : s.toCharArray()) {
            if (Character.isDigit(c)) {
                currentNum = currentNum * 10 + (c - '0');
            } else if (c == '+' || c == '-') {
                result += sign * currentNum;
                currentNum = 0;
                sign = (c == '+') ? 1 : -1;
            } else if (c == '(') {
                stack.push(result);
                stack.push(sign);
                result = 0; sign = 1;
            } else if (c == ')') {
                result += sign * currentNum;
                currentNum = 0;
                result *= stack.pop(); // Multiply by sign before parenthesis
                result += stack.pop(); // Add to result from before parenthesis
            }
        }
        return result + (sign * currentNum);
    }

    /*
     * PART 3: Evaluate an expression containing alphabetic variables.
     * You are provided a Map containing the integer values of the variables.
     * Time: O(N), Space: O(N)
     */
    public static int evaluateWithVariables(String s, Map<String, Integer> variables) {
        Stack<Integer> stack = new Stack<>();
        int result = 0, sign = 1;

        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);

            if (Character.isDigit(c)) {
                int currentNum = 0;
                while (i < s.length() && Character.isDigit(s.charAt(i))) {
                    currentNum = currentNum * 10 + (s.charAt(i) - '0');
                    i++;
                }
                i--; // Step back for outer loop
                result += sign * currentNum;

            } else if (Character.isLetter(c)) {
                StringBuilder varName = new StringBuilder();
                while (i < s.length() && Character.isLetter(s.charAt(i))) {
                    varName.append(s.charAt(i));
                    i++;
                }
                i--; // Step back for outer loop
                int val = variables.getOrDefault(varName.toString(), 0);
                result += sign * val;

            } else if (c == '+' || c == '-') {
                sign = (c == '+') ? 1 : -1;
            } else if (c == '(') {
                stack.push(result);
                stack.push(sign);
                result = 0; sign = 1;
            } else if (c == ')') {
                result *= stack.pop();
                result += stack.pop();
            }
        }
        return result;
    }
}