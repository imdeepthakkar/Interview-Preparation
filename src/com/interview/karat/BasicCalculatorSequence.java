package com.interview.karat;

import java.util.*;

public class BasicCalculatorSequence {

    /*
     * PART 1: Evaluate a string with positive integers, '+', and '-'.
     * Time: O(N), Space: O(1)
     */
    public static int calculateBasic(String s) {
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
    public static int calculateWithParentheses(String s) {
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
    public static int calculateWithVariables(String s, Map<String, Integer> variables) {
        Stack<Integer> stack = new Stack<>();
        int result = 0, currentNum = 0, sign = 1;

        for (char c : s.toCharArray()) {

            if (Character.isDigit(c)) {
                currentNum = currentNum * 10 + (c - '0');
            }
            else if (Character.isLetter(c)) {
                currentNum = variables.getOrDefault(String.valueOf(c), 0);
            }
            else if (c == '+' || c == '-') {
                result += sign * currentNum;
                currentNum = 0;
                sign = (c == '+') ? 1 : -1;
            }
            else if (c == '(') {
                stack.push(result);
                stack.push(sign);
                result = 0;
                sign = 1;
            }
            else if (c == ')') {
                result += sign * currentNum;
                currentNum = 0;
                result *= stack.pop();
                result += stack.pop();
            }
        }

        return result + (sign * currentNum);
    }

    public static void main(String[] args) {

        // ---------------------------------------------------------
        // PART 1: Basic Math (No parentheses, only + and -)
        // ---------------------------------------------------------
        System.out.println("--- PART 1: Basic Expression ---");

        String expr1 = "2+3-1";
        System.out.println(expr1 + " = " + calculateBasic(expr1));
        // Expected Output: 4

        String expr2 = "10 - 2 - 3"; // Tests multi-digit numbers and spaces
        System.out.println(expr2 + " = " + calculateBasic(expr2));
        // Expected Output: 5

        String expr3 = "-5 + 8"; // Tests leading negative sign
        System.out.println(expr3 + " = " + calculateBasic(expr3));
        // Expected Output: 3


        // ---------------------------------------------------------
        // PART 2: With Parentheses
        // ---------------------------------------------------------
        System.out.println("\n--- PART 2: With Parentheses ---");

        String expr4 = "2+(3-1)";
        System.out.println(expr4 + " = " + calculateWithParentheses(expr4));
        // Expected Output: 4

        String expr5 = "12 - (8 - 4) + 3";
        System.out.println(expr5 + " = " + calculateWithParentheses(expr5));
        // Expected Output: 11


        // ---------------------------------------------------------
        // PART 3: With Variables
        // ---------------------------------------------------------
        System.out.println("\n--- PART 3: With Variables ---");

        Map<String, Integer> variables = new HashMap<>();
        variables.put("a", 10);
        variables.put("b", 2);
        variables.put("c", 5);

        String expr6 = "a + (a - b) - c";
        System.out.println(expr6 + " = " + calculateWithVariables(expr6, variables));
        // Expected Output: 13 (10 + (10 - 2) - 5)
    }
}