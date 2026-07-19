const javaClasses = [
    {
        id: "badge-security",
        title: "BadgeSecuritySequence",
        category: "Logs & States",
        fullCode: `package com.interview.karat;

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
                if (inBuilding.contains(name)) {
                    enterWithoutExit.add(name);
                }
                inBuilding.add(name); // add to the building as entered
            } else if (action.equals("exit")) {
                if (!inBuilding.contains(name)) {
                    exitWithoutEnter.add(name);
                }
                inBuilding.remove(name); //remove from the building as exited
            }
        }
        //Add rest of the people who have entered and not exited
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

        //create a map with name as key and list of times
        /*
            {
                 "Paul" -> [1355, 1405],
                 "Eli"  -> [1400]
            }
        */
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
            //check for the next 3 times
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
        Map<String, List<String>> roomPaths = new HashMap<>();
        //create a new hashmap and add a employee as key and add record as value
        for (String[] record : records) {
            String name = record[0];
            userLogs.putIfAbsent(name, new ArrayList<>());
            userLogs.get(name).add(record);
        }

        for (Map.Entry<String, List<String[]>> entry : userLogs.entrySet()) {
            String name = entry.getKey();
            List<String[]> logs = entry.getValue();

            // Sort chronologically by Time (Index 3)
            logs.sort((a, b) -> Integer.compare(Integer.parseInt(a[3]), Integer.parseInt(b[3])));
//            logs.sort(Comparator.comparingInt(a -> Integer.parseInt(a[3])));

            List<String> path = new ArrayList<>();
            for (String[] log : logs) {
                if (log[1].equals("enter")) {
                    path.add(log[2]);
                }
            }
            //if there are path by employee add to the list
            if (!path.isEmpty()) {
                roomPaths.put(name, path);
            }
        }
        return roomPaths;
    }

    public static void main(String[] args) {

        // ---------------------------------------------------------
        // PART 1: Mismatched Badges (Enter without Exit / Exit without Enter)
        // ---------------------------------------------------------
        String[][] part1Logs = {
                {"Martha", "exit"},    // Exits without entering
                {"Paul", "enter"},     // Enters
                {"Martha", "enter"},   // Enters normally
                {"Martha", "exit"},    // Exits normally
                {"Jennifer", "enter"}, // Enters but never exits
                {"Paul", "exit"},      // Paul exits
                {"John", "exit"}       // Exits without entering
        };

        System.out.println("--- PART 1: Mismatched Badges ---");
        findMismatchedBadges(part1Logs);
        // Expected Output:
        // Exited without entering: [Martha, John]
        // Entered without exiting: [Jennifer]


        // ---------------------------------------------------------
        // PART 2: Suspicious Access (3+ badge-ins within 1 hour)
        // Input Format: [Name, Time in HHMM]
        // ---------------------------------------------------------
        String[][] part2Logs = {
                {"Paul", "1355"},
                {"Eli", "1400"},
                {"Paul", "1405"},
                {"Paul", "1430"}, // Paul's 3rd badge in 35 minutes (1355 to 1430) -> Suspicious
                {"Eli", "1435"},
                {"Eli", "1500"},  // Eli's 3rd badge in exactly 60 minutes (1400 to 1500) -> Suspicious
                {"Paul", "1630"},
                {"John", "0830"},
                {"John", "0945"}  // John is safe (only 2 badges)
        };

        System.out.println("\\n--- PART 2: Suspicious Access ---");
        Map<String, List<Integer>> suspicious = findSuspiciousAccess(part2Logs);
        for (Map.Entry<String, List<Integer>> entry : suspicious.entrySet()) {
            System.out.println(entry.getKey() + ": " + entry.getValue());
        }
            // Expected Output:
            // Paul: [1355, 1405, 1430]
            // Eli: [1400, 1435, 1500]


        // ---------------------------------------------------------
        // PART 3: Room Paths (Chronological sequence of rooms entered)
        // Input Format: [Name, Action, Room, Time]
        // Note: Intentionally scrambled to test chronological sorting.
        // ---------------------------------------------------------
        String[][] part3Logs = {
                {"Paul", "enter", "Engineering", "1410"},
                {"Eli", "enter", "Lobby", "1400"},
                {"Paul", "enter", "Kitchen", "1355"},     // Happened before Engineering
                {"Paul", "exit", "Kitchen", "1405"},
                {"Eli", "exit", "Lobby", "1430"},
                {"Eli", "enter", "ServerRoom", "1435"}
        };

        System.out.println("\\n--- PART 3: Employee Room Paths ---");
        Map<String, List<String>> roomPaths = getEmployeeRoomPaths(part3Logs);
        for (Map.Entry<String, List<String>> entry : roomPaths.entrySet()) {
            System.out.println(entry.getKey() + ": " + entry.getValue());
        }
        // Expected Output:
        // Paul: [Kitchen, Engineering]  <-- Kitchen must come first because of the time!
        // Eli: [Lobby, ServerRoom]
    }
}
`,
        fullCode: `package com.interview.karat;

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
                if (inBuilding.contains(name)) {
                    enterWithoutExit.add(name);
                }
                inBuilding.add(name); // add to the building as entered
            } else if (action.equals("exit")) {
                if (!inBuilding.contains(name)) {
                    exitWithoutEnter.add(name);
                }
                inBuilding.remove(name); //remove from the building as exited
            }
        }
        //Add rest of the people who have entered and not exited
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

        //create a map with name as key and list of times
        /*
            {
                 "Paul" -> [1355, 1405],
                 "Eli"  -> [1400]
            }
        */
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
            //check for the next 3 times
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
        Map<String, List<String>> roomPaths = new HashMap<>();
        //create a new hashmap and add a employee as key and add record as value
        for (String[] record : records) {
            String name = record[0];
            userLogs.putIfAbsent(name, new ArrayList<>());
            userLogs.get(name).add(record);
        }

        for (Map.Entry<String, List<String[]>> entry : userLogs.entrySet()) {
            String name = entry.getKey();
            List<String[]> logs = entry.getValue();

            // Sort chronologically by Time (Index 3)
            logs.sort((a, b) -> Integer.compare(Integer.parseInt(a[3]), Integer.parseInt(b[3])));
//            logs.sort(Comparator.comparingInt(a -> Integer.parseInt(a[3])));

            List<String> path = new ArrayList<>();
            for (String[] log : logs) {
                if (log[1].equals("enter")) {
                    path.add(log[2]);
                }
            }
            //if there are path by employee add to the list
            if (!path.isEmpty()) {
                roomPaths.put(name, path);
            }
        }
        return roomPaths;
    }

    public static void main(String[] args) {

        // ---------------------------------------------------------
        // PART 1: Mismatched Badges (Enter without Exit / Exit without Enter)
        // ---------------------------------------------------------
        String[][] part1Logs = {
                {"Martha", "exit"},    // Exits without entering
                {"Paul", "enter"},     // Enters
                {"Martha", "enter"},   // Enters normally
                {"Martha", "exit"},    // Exits normally
                {"Jennifer", "enter"}, // Enters but never exits
                {"Paul", "exit"},      // Paul exits
                {"John", "exit"}       // Exits without entering
        };

        System.out.println("--- PART 1: Mismatched Badges ---");
        findMismatchedBadges(part1Logs);
        // Expected Output:
        // Exited without entering: [Martha, John]
        // Entered without exiting: [Jennifer]


        // ---------------------------------------------------------
        // PART 2: Suspicious Access (3+ badge-ins within 1 hour)
        // Input Format: [Name, Time in HHMM]
        // ---------------------------------------------------------
        String[][] part2Logs = {
                {"Paul", "1355"},
                {"Eli", "1400"},
                {"Paul", "1405"},
                {"Paul", "1430"}, // Paul's 3rd badge in 35 minutes (1355 to 1430) -> Suspicious
                {"Eli", "1435"},
                {"Eli", "1500"},  // Eli's 3rd badge in exactly 60 minutes (1400 to 1500) -> Suspicious
                {"Paul", "1630"},
                {"John", "0830"},
                {"John", "0945"}  // John is safe (only 2 badges)
        };

        System.out.println("\\n--- PART 2: Suspicious Access ---");
        Map<String, List<Integer>> suspicious = findSuspiciousAccess(part2Logs);
        for (Map.Entry<String, List<Integer>> entry : suspicious.entrySet()) {
            System.out.println(entry.getKey() + ": " + entry.getValue());
        }
            // Expected Output:
            // Paul: [1355, 1405, 1430]
            // Eli: [1400, 1435, 1500]


        // ---------------------------------------------------------
        // PART 3: Room Paths (Chronological sequence of rooms entered)
        // Input Format: [Name, Action, Room, Time]
        // Note: Intentionally scrambled to test chronological sorting.
        // ---------------------------------------------------------
        String[][] part3Logs = {
                {"Paul", "enter", "Engineering", "1410"},
                {"Eli", "enter", "Lobby", "1400"},
                {"Paul", "enter", "Kitchen", "1355"},     // Happened before Engineering
                {"Paul", "exit", "Kitchen", "1405"},
                {"Eli", "exit", "Lobby", "1430"},
                {"Eli", "enter", "ServerRoom", "1435"}
        };

        System.out.println("\\n--- PART 3: Employee Room Paths ---");
        Map<String, List<String>> roomPaths = getEmployeeRoomPaths(part3Logs);
        for (Map.Entry<String, List<String>> entry : roomPaths.entrySet()) {
            System.out.println(entry.getKey() + ": " + entry.getValue());
        }
        // Expected Output:
        // Paul: [Kitchen, Engineering]  <-- Kitchen must come first because of the time!
        // Eli: [Lobby, ServerRoom]
    }
}
`,
        parts: [
            {
                subtitle: "Part 1: Mismatched Badges",
                analogy: "Finding employees who entered without exiting, or exited without entering.",
                trick: "Use a HashSet to track who is currently in the building. Add on 'enter', remove on 'exit'. If they 'exit' but aren't in the Set, they sneaked in! Add leftover people to 'entered without exit'.",
                time: "O(N)", space: "O(N)",
                code: `Set<String> inBuilding = new HashSet<>();
Set<String> exitWithoutEnter = new HashSet<>();
Set<String> enterWithoutExit = new HashSet<>();

for (String[] record : records) {
    String name = record[0];
    String action = record[1];
    
    if (action.equals("enter")) {
        inBuilding.add(name);
    } else {
        if (!inBuilding.remove(name)) {
            exitWithoutEnter.add(name);
        }
    }
}
enterWithoutExit.addAll(inBuilding);`
            },
            {
                subtitle: "Part 2: Suspicious Access",
                analogy: "Someone badging in 3+ times in exactly 1 hour. Probably sneaking friends in.",
                trick: "Group logs into Map<String, List<Integer>>. Sort each employee's timestamps. Use a sliding window of size 3: just check `times.get(i+2) - times.get(i) <= 60`.",
                time: "O(N log N)", space: "O(N)",
                code: `Map<String, List<Integer>> times = new HashMap<>();
// ... populate times map parsing HHMM to minutes ...

for (Map.Entry<String, List<Integer>> entry : times.entrySet()) {
    List<Integer> list = entry.getValue();
    Collections.sort(list);
    
    for (int i = 0; i <= list.size() - 3; i++) {
        if (list.get(i + 2) - list.get(i) <= 60) {
            // Found suspicious activity!
            List<Integer> violation = list.subList(i, i + 3);
            result.put(entry.getKey(), violation);
            break;
        }
    }
}`
            },
            {
                subtitle: "Part 3: Employee Room Paths",
                analogy: "Reconstructing the exact chronological path an employee took through different rooms.",
                trick: "Map Name -> List of log records. Sort their logs chronologically by Timestamp. Iterate through and extract the Room name whenever the action is 'enter'.",
                time: "O(N log N)", space: "O(N)",
                code: `// Sort logs by timestamp
Arrays.sort(logs, (a, b) -> Integer.compare(Integer.parseInt(a[3]), Integer.parseInt(b[3])));

Map<String, List<String>> paths = new HashMap<>();
for (String[] log : logs) {
    String name = log[0];
    String action = log[1];
    String room = log[2];
    
    if (action.equals("enter")) {
        paths.putIfAbsent(name, new ArrayList<>());
        paths.get(name).add(room);
    }
}`
            }
        ]
    },
    {
        id: "basic-calc",
        title: "BasicCalculatorSequence",
        category: "Stack Parsing",
        fullCode: `package com.interview.karat;

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
        System.out.println("\\n--- PART 2: With Parentheses ---");

        String expr4 = "2+(3-1)";
        System.out.println(expr4 + " = " + calculateWithParentheses(expr4));
        // Expected Output: 4

        String expr5 = "12 - (8 - 4) + 3";
        System.out.println(expr5 + " = " + calculateWithParentheses(expr5));
        // Expected Output: 11


        // ---------------------------------------------------------
        // PART 3: With Variables
        // ---------------------------------------------------------
        System.out.println("\\n--- PART 3: With Variables ---");

        Map<String, Integer> variables = new HashMap<>();
        variables.put("a", 10);
        variables.put("b", 2);
        variables.put("c", 5);

        String expr6 = "a + (a - b) - c";
        System.out.println(expr6 + " = " + calculateWithVariables(expr6, variables));
        // Expected Output: 13 (10 + (10 - 2) - 5)
    }
}`,
        fullCode: `package com.interview.karat;

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
}`,
        parts: [
            {
                subtitle: "Part 1: Simple Evaluation",
                analogy: "Reading a basic math equation left to right with only +, -, and numbers.",
                trick: "Keep a running `result`, `currentNum`, and `sign` (1 or -1). On +/-, add `sign * currentNum` to result, reset currentNum, and update sign.",
                time: "O(N)", space: "O(1)",
                code: `int result = 0, currentNum = 0, sign = 1;

for (char c : expression.toCharArray()) {
    if (Character.isDigit(c)) {
        currentNum = currentNum * 10 + (c - '0');
    } else if (c == '+') {
        result += sign * currentNum;
        currentNum = 0;
        sign = 1;
    } else if (c == '-') {
        result += sign * currentNum;
        currentNum = 0;
        sign = -1;
    }
}
return result + (sign * currentNum);`
            },
            {
                subtitle: "Part 2: Parentheses",
                analogy: "When you hit a '(', you hit 'Save Game' and put your current score in your pocket. On ')', you pull it out and combine it.",
                trick: "Use a Stack! On `(`, push `result` and `sign`, then reset them. On `)`, pop the sign (multiply) and pop the result (add).",
                time: "O(N)", space: "O(N)",
                code: `Stack<Integer> stack = new Stack<>();
int result = 0, currentNum = 0, sign = 1;

for (char c : expression.toCharArray()) {
    if (Character.isDigit(c)) {
        currentNum = currentNum * 10 + (c - '0');
    } else if (c == '+' || c == '-') {
        result += sign * currentNum;
        currentNum = 0;
        sign = (c == '+') ? 1 : -1;
    } else if (c == '(') {
        stack.push(result);
        stack.push(sign);
        result = 0;
        sign = 1;
    } else if (c == ')') {
        result += sign * currentNum;
        currentNum = 0;
        result = result * stack.pop() + stack.pop();
    }
}
return result + (sign * currentNum);`
            },
            {
                subtitle: "Part 3: Variables",
                analogy: "Same as Part 2, but sometimes a number is a variable like 'cost' that you have to look up in a dictionary.",
                trick: "If `Character.isLetter(c)`, simply convert the single character to a String and look it up in the provided Map to get `currentNum`.",
                time: "O(N)", space: "O(N)",
                code: `// Inside the main character loop from Part 2:
if (Character.isLetter(c)) {
    currentNum = variables.getOrDefault(String.valueOf(c), 0);
}`
            }
        ]
    },
    {
        id: "calendar-seq",
        title: "CalendarSequence",
        category: "Intervals",
        fullCode: `package com.interview.karat;

import java.util.*;

public class CalendarSequence {

    /*
     * PART 1: Determine if a proposed new meeting conflicts with existing meetings.
     * Time: O(N), Space: O(1)
     */
    public static boolean canSchedule(int[][] existingMeetings, int[] newMeeting) {
        int newStart = newMeeting[0];
        int newEnd = newMeeting[1];

        for (int[] meeting : existingMeetings) {
            if (newStart < meeting[1] && newEnd > meeting[0]) {
                return false;
            }
        }
        return true;
    }

    /*
     * PART 2: Merge all overlapping meetings into consolidated blocks.
     * Time: O(N log N) due to sorting. Space: O(N)
     */
    public static int[][] mergeMeetings(int[][] meetings) {
        if (meetings == null || meetings.length <= 1) return meetings;

        Arrays.sort(meetings, (a, b) -> Integer.compare(a[0], b[0]));
        List<int[]> merged = new ArrayList<>();

        int[] currentMeeting = meetings[0];
        merged.add(currentMeeting);

        for (int[] nextMeeting : meetings) {
            if (nextMeeting[0] <= currentMeeting[1]) {
                currentMeeting[1] = Math.max(currentMeeting[1], nextMeeting[1]);
            } else {
                currentMeeting = nextMeeting;
                merged.add(currentMeeting);
            }
        }
        return merged.toArray(new int[merged.size()][]);
    }

    /*
     * PART 3: Given the merged booked times (from Part 2) and the working day's
     * start/end times, find all available free blocks.
     * Time: O(N), Space: O(N)
     */
    public static List<int[]> findFreeTime(int[][] mergedMeetings, int dayStart, int dayEnd) {
        List<int[]> freeBlocks = new ArrayList<>();
        int currentPointer = dayStart;

        for (int[] meeting : mergedMeetings) {
            if (currentPointer < meeting[0]) {
                freeBlocks.add(new int[]{currentPointer, meeting[0]});
            }
            currentPointer = Math.max(currentPointer, meeting[1]);
        }

        if (currentPointer < dayEnd) {
            freeBlocks.add(new int[]{currentPointer, dayEnd});
        }
        return freeBlocks;
    }
}
`,
        fullCode: `package com.interview.karat;

import java.util.*;

public class CalendarSequence {

    /*
     * PART 1: Determine if a proposed new meeting conflicts with existing meetings.
     * Time: O(N), Space: O(1)
     */
    public static boolean canSchedule(int[][] existingMeetings, int[] newMeeting) {
        int newStart = newMeeting[0];
        int newEnd = newMeeting[1];

        for (int[] meeting : existingMeetings) {
            if (newStart < meeting[1] && newEnd > meeting[0]) {
                return false;
            }
        }
        return true;
    }

    /*
     * PART 2: Merge all overlapping meetings into consolidated blocks.
     * Time: O(N log N) due to sorting. Space: O(N)
     */
    public static int[][] mergeMeetings(int[][] meetings) {
        if (meetings == null || meetings.length <= 1) return meetings;

        Arrays.sort(meetings, (a, b) -> Integer.compare(a[0], b[0]));
        List<int[]> merged = new ArrayList<>();

        int[] currentMeeting = meetings[0];
        merged.add(currentMeeting);

        for (int[] nextMeeting : meetings) {
            if (nextMeeting[0] <= currentMeeting[1]) {
                currentMeeting[1] = Math.max(currentMeeting[1], nextMeeting[1]);
            } else {
                currentMeeting = nextMeeting;
                merged.add(currentMeeting);
            }
        }
        return merged.toArray(new int[merged.size()][]);
    }

    /*
     * PART 3: Given the merged booked times (from Part 2) and the working day's
     * start/end times, find all available free blocks.
     * Time: O(N), Space: O(N)
     */
    public static List<int[]> findFreeTime(int[][] mergedMeetings, int dayStart, int dayEnd) {
        List<int[]> freeBlocks = new ArrayList<>();
        int currentPointer = dayStart;

        for (int[] meeting : mergedMeetings) {
            if (currentPointer < meeting[0]) {
                freeBlocks.add(new int[]{currentPointer, meeting[0]});
            }
            currentPointer = Math.max(currentPointer, meeting[1]);
        }

        if (currentPointer < dayEnd) {
            freeBlocks.add(new int[]{currentPointer, dayEnd});
        }
        return freeBlocks;
    }
}
`,
        parts: [
            {
                subtitle: "Part 1: Can Schedule?",
                analogy: "Checking if a new meeting overlaps with any existing meetings.",
                trick: "Two intervals overlap if `newStart < meeting.end AND newEnd > meeting.start`.",
                time: "O(N)", space: "O(1)",
                code: `public boolean canSchedule(int[][] meetings, int newStart, int newEnd) {
    for (int[] meeting : meetings) {
        if (newStart < meeting[1] && newEnd > meeting[0]) {
            return false; // Overlap detected
        }
    }
    return true;
}`
            },
            {
                subtitle: "Part 2: Merge Overlaps",
                analogy: "Painting time slots. If two paint strokes touch or overlap, they become one big stroke.",
                trick: "Sort intervals by Start Time! Then, compare `nextStart <= currEnd`. If so, `currEnd = Math.max(currEnd, nextEnd)`. Else, add to list.",
                time: "O(N log N)", space: "O(N)",
                code: `Arrays.sort(meetings, (a, b) -> Integer.compare(a[0], b[0]));
List<int[]> merged = new ArrayList<>();
int[] curr = meetings[0];
merged.add(curr);

for (int[] next : meetings) {
    if (next[0] <= curr[1]) {
        curr[1] = Math.max(curr[1], next[1]); // Merge
    } else {
        curr = next;
        merged.add(curr); // Disjoint, add new
    }
}
return merged;`
            },
            {
                subtitle: "Part 3: Find Free Time",
                analogy: "Walking from start of the day to the end. Any gap between your pointer and the start of the next meeting is free time.",
                trick: "Use merged meetings from Part 2. `pointer = dayStart`. If `pointer < meeting.start`, add `[pointer, meeting.start]` as free time. Move pointer to `Math.max(pointer, meeting.end)`.",
                time: "O(N)", space: "O(N)",
                code: `List<int[]> freeBlocks = new ArrayList<>();
int pointer = dayStart;

for (int[] meeting : mergedMeetings) {
    if (pointer < meeting[0]) {
        freeBlocks.add(new int[]{pointer, meeting[0]});
    }
    pointer = Math.max(pointer, meeting[1]);
}

if (pointer < dayEnd) {
    freeBlocks.add(new int[]{pointer, dayEnd});
}
return freeBlocks;`
            }
        ]
    },
    {
        id: "grid-seq",
        title: "GridSequence",
        category: "2D Grids",
        fullCode: `package com.interview.karat;

import java.util.*;

public class GridSequence {

    private static final int[][] DIRECTIONS = {{-1, 0}, {1, 0}, {0, -1}, {0, 1}};

    /*
     * PART 1: Find ALL reachable coordinates (0s) from a start point (DFS).
     * Time: O(R * C), Space: O(R * C)
     */
    public static List<int[]> findAllReachable(int[][] grid, int startRow, int startCol) {
        List<int[]> reachable = new ArrayList<>();

        // 1. Guard clause: Prevents crashes from null or completely empty grids
        if (grid == null || grid.length == 0 || grid[0].length == 0 || grid[startRow][startCol] == 1) {
            return reachable;
        }

        // 2. Extract dimensions cleanly into integers
        int rows = grid.length;
        int cols = grid[0].length;

        // 3. Initialize the 2D boolean array using the variables
        boolean[][] visited = new boolean[rows][cols];

        dfs(grid, startRow, startCol, visited, reachable);

        return reachable;
    }

    private static void dfs(int[][] grid, int row, int col, boolean[][] visited, List<int[]> reachable) {
        if (!isValidMove(grid, row, col, visited)) return;

        visited[row][col] = true;
        reachable.add(new int[]{row, col});

        for (int[] dir : DIRECTIONS) {
            dfs(grid, row + dir[0], col + dir[1], visited, reachable);
        }
    }

    /*
     * PART 2: Find the shortest path from Start to End (BFS).
     * Time: O(R * C), Space: O(R * C)
     */
    public static int findShortestPath(int[][] grid, int[] start, int[] end) {
        // 1. Guard clause: Prevent crashes if the grid is entirely empty
        if (grid == null || grid.length == 0 || grid[0].length == 0) return -1;

        // Check if start or end points are on walls
        if (grid[start[0]][start[1]] == 1 || grid[end[0]][end[1]] == 1) return -1;

        // 2. Extract dimensions cleanly into variables to bypass your IDE glitch
        int rows = grid.length;
        int cols = grid[0].length;

        Queue<int[]> queue = new LinkedList<>();

        // 3. Initialize the matrix using the clean integers
        boolean[][] visited = new boolean[rows][cols];

        queue.add(new int[]{start[0], start[1], 0}); // {row, col, distance}
        visited[start[0]][start[1]] = true;

        while (!queue.isEmpty()) {
            int[] curr = queue.poll();
            if (curr[0] == end[0] && curr[1] == end[1]) return curr[2];

            for (int[] dir : DIRECTIONS) {
                int nextRow = curr[0] + dir[0];
                int nextCol = curr[1] + dir[1];

                if (isValidMove(grid, nextRow, nextCol, visited)) {
                    visited[nextRow][nextCol] = true;
                    queue.add(new int[]{nextRow, nextCol, curr[2] + 1});
                }
            }
        }
        return -1;
    }

    /*
     * PART 3: Shortest Path with an Obstacle Limit. You are allowed to break
     * exactly 1 wall (1s) during the path.
     * Strategy: Add "wallsBroken" state to the BFS queue and visited array.
     */
    public static int findShortestPathWithOneWall(int[][] grid, int[] start, int[] end) {
        // 1. Guard clause: Prevent crashes if the grid is empty
        if (grid == null || grid.length == 0 || grid[0].length == 0) return -1;

        // 2. Extract dimensions to bypass the bracket-swallowing glitch
        int rows = grid.length;
        int cols = grid[0].length;

        Queue<int[]> queue = new LinkedList<>();

        // 3. Initialize the 3D visited matrix using the clean variables
        // [row][col][wallsBroken state]
        boolean[][][] visited = new boolean[rows][cols][2];

        // {row, col, distance, wallsBroken}
        queue.add(new int[]{start[0], start[1], 0, 0});
        visited[start[0]][start[1]][0] = true;

        while (!queue.isEmpty()) {
            int[] curr = queue.poll();
            int r = curr[0], c = curr[1], dist = curr[2], walls = curr[3];

            if (r == end[0] && c == end[1]) return dist;

            for (int[] dir : DIRECTIONS) {
                int nr = r + dir[0];
                int nc = c + dir[1];

                // 4. We can now use rows and cols for a much cleaner bounds check
                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
                    int nextWalls = walls + grid[nr][nc]; // grid value is 1 (wall) or 0 (space)

                    if (nextWalls <= 1 && !visited[nr][nc][nextWalls]) {
                        visited[nr][nc][nextWalls] = true;
                        queue.add(new int[]{nr, nc, dist + 1, nextWalls});
                    }
                }
            }
        }
        return -1;
    }

    // --- Helper for Part 1 & Part 2 ---
    private static boolean isValidMove(int[][] grid, int row, int col, boolean[][] visited) {
        return row >= 0 && row < grid.length &&
                col >= 0 && col < grid[0].length &&
                grid[row][col] == 0 &&
                !visited[row][col];
    }
}`,
        fullCode: `package com.interview.karat;

import java.util.*;

public class GridSequence {

    private static final int[][] DIRECTIONS = {{-1, 0}, {1, 0}, {0, -1}, {0, 1}};

    /*
     * PART 1: Find ALL reachable coordinates (0s) from a start point (DFS).
     * Time: O(R * C), Space: O(R * C)
     */
    public static List<int[]> findAllReachable(int[][] grid, int startRow, int startCol) {
        List<int[]> reachable = new ArrayList<>();

        // 1. Guard clause: Prevents crashes from null or completely empty grids
        if (grid == null || grid.length == 0 || grid[0].length == 0 || grid[startRow][startCol] == 1) {
            return reachable;
        }

        // 2. Extract dimensions cleanly into integers
        int rows = grid.length;
        int cols = grid[0].length;

        // 3. Initialize the 2D boolean array using the variables
        boolean[][] visited = new boolean[rows][cols];

        dfs(grid, startRow, startCol, visited, reachable);

        return reachable;
    }

    private static void dfs(int[][] grid, int row, int col, boolean[][] visited, List<int[]> reachable) {
        if (!isValidMove(grid, row, col, visited)) return;

        visited[row][col] = true;
        reachable.add(new int[]{row, col});

        for (int[] dir : DIRECTIONS) {
            dfs(grid, row + dir[0], col + dir[1], visited, reachable);
        }
    }

    /*
     * PART 2: Find the shortest path from Start to End (BFS).
     * Time: O(R * C), Space: O(R * C)
     */
    public static int findShortestPath(int[][] grid, int[] start, int[] end) {
        // 1. Guard clause: Prevent crashes if the grid is entirely empty
        if (grid == null || grid.length == 0 || grid[0].length == 0) return -1;

        // Check if start or end points are on walls
        if (grid[start[0]][start[1]] == 1 || grid[end[0]][end[1]] == 1) return -1;

        // 2. Extract dimensions cleanly into variables to bypass your IDE glitch
        int rows = grid.length;
        int cols = grid[0].length;

        Queue<int[]> queue = new LinkedList<>();

        // 3. Initialize the matrix using the clean integers
        boolean[][] visited = new boolean[rows][cols];

        queue.add(new int[]{start[0], start[1], 0}); // {row, col, distance}
        visited[start[0]][start[1]] = true;

        while (!queue.isEmpty()) {
            int[] curr = queue.poll();
            if (curr[0] == end[0] && curr[1] == end[1]) return curr[2];

            for (int[] dir : DIRECTIONS) {
                int nextRow = curr[0] + dir[0];
                int nextCol = curr[1] + dir[1];

                if (isValidMove(grid, nextRow, nextCol, visited)) {
                    visited[nextRow][nextCol] = true;
                    queue.add(new int[]{nextRow, nextCol, curr[2] + 1});
                }
            }
        }
        return -1;
    }

    /*
     * PART 3: Shortest Path with an Obstacle Limit. You are allowed to break
     * exactly 1 wall (1s) during the path.
     * Strategy: Add "wallsBroken" state to the BFS queue and visited array.
     */
    public static int findShortestPathWithOneWall(int[][] grid, int[] start, int[] end) {
        // 1. Guard clause: Prevent crashes if the grid is empty
        if (grid == null || grid.length == 0 || grid[0].length == 0) return -1;

        // 2. Extract dimensions to bypass the bracket-swallowing glitch
        int rows = grid.length;
        int cols = grid[0].length;

        Queue<int[]> queue = new LinkedList<>();

        // 3. Initialize the 3D visited matrix using the clean variables
        // [row][col][wallsBroken state]
        boolean[][][] visited = new boolean[rows][cols][2];

        // {row, col, distance, wallsBroken}
        queue.add(new int[]{start[0], start[1], 0, 0});
        visited[start[0]][start[1]][0] = true;

        while (!queue.isEmpty()) {
            int[] curr = queue.poll();
            int r = curr[0], c = curr[1], dist = curr[2], walls = curr[3];

            if (r == end[0] && c == end[1]) return dist;

            for (int[] dir : DIRECTIONS) {
                int nr = r + dir[0];
                int nc = c + dir[1];

                // 4. We can now use rows and cols for a much cleaner bounds check
                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
                    int nextWalls = walls + grid[nr][nc]; // grid value is 1 (wall) or 0 (space)

                    if (nextWalls <= 1 && !visited[nr][nc][nextWalls]) {
                        visited[nr][nc][nextWalls] = true;
                        queue.add(new int[]{nr, nc, dist + 1, nextWalls});
                    }
                }
            }
        }
        return -1;
    }

    // --- Helper for Part 1 & Part 2 ---
    private static boolean isValidMove(int[][] grid, int row, int col, boolean[][] visited) {
        return row >= 0 && row < grid.length &&
                col >= 0 && col < grid[0].length &&
                grid[row][col] == 0 &&
                !visited[row][col];
    }
}`,
        parts: [
            {
                subtitle: "Part 1: Find Reachable",
                analogy: "Pouring water starting at a single cell and seeing every cell it can flow into without hitting walls.",
                trick: "Classic DFS! Mutate a `visited` boolean matrix. Recursively explore 4 directions (up, down, left, right) if the cell is valid (0).",
                time: "O(R * C)", space: "O(R * C)",
                code: `private void dfs(int[][] grid, int r, int c, boolean[][] visited, List<int[]> result) {
    if (r < 0 || c < 0 || r >= grid.length || c >= grid[0].length || grid[r][c] == 1 || visited[r][c]) {
        return;
    }
    visited[r][c] = true;
    result.add(new int[]{r, c});
    
    dfs(grid, r + 1, c, visited, result);
    dfs(grid, r - 1, c, visited, result);
    dfs(grid, r, c + 1, visited, result);
    dfs(grid, r, c - 1, visited, result);
}`
            },
            {
                subtitle: "Part 2: Shortest Path",
                analogy: "Finding the absolute quickest way through a maze. Water expands outward one ripple at a time.",
                trick: "Use BFS with a Queue! Queue stores `[row, col, distance]`. The first time you reach the destination, it is guaranteed to be the shortest path.",
                time: "O(R * C)", space: "O(R * C)",
                code: `Queue<int[]> q = new LinkedList<>();
boolean[][] visited = new boolean[R][C];
q.add(new int[]{startR, startC, 0});
visited[startR][startC] = true;

int[][] dirs = {{1,0}, {-1,0}, {0,1}, {0,-1}};

while (!q.isEmpty()) {
    int[] curr = q.poll();
    if (curr[0] == endR && curr[1] == endC) return curr[2]; // Return dist
    
    for (int[] d : dirs) {
        int nr = curr[0] + d[0], nc = curr[1] + d[1];
        if (nr >= 0 && nr < R && nc >= 0 && nc < C && grid[nr][nc] == 0 && !visited[nr][nc]) {
            visited[nr][nc] = true;
            q.add(new int[]{nr, nc, curr[2] + 1});
        }
    }
}
return -1;`
            },
            {
                subtitle: "Part 3: Break 1 Wall",
                analogy: "You have a bomb that can destroy exactly ONE wall to make a shortcut.",
                trick: "Add 'state' to BFS. Queue stores `[row, col, dist, wallsBroken]`. Visited array becomes 3D: `visited[r][c][2]`. Increment wallsBroken when hitting a 1.",
                time: "O(R * C)", space: "O(R * C)",
                code: `Queue<int[]> q = new LinkedList<>();
boolean[][][] visited = new boolean[R][C][2];
q.add(new int[]{startR, startC, 0, 0}); // {r, c, dist, brokenWalls}
visited[startR][startC][0] = true;

while (!q.isEmpty()) {
    int[] curr = q.poll();
    if (curr[0] == endR && curr[1] == endC) return curr[2];
    
    for (int[] d : dirs) {
        int nr = curr[0] + d[0], nc = curr[1] + d[1];
        if (nr >= 0 && nr < R && nc >= 0 && nc < C) {
            int nextBroken = curr[3] + grid[nr][nc];
            if (nextBroken <= 1 && !visited[nr][nc][nextBroken]) {
                visited[nr][nc][nextBroken] = true;
                q.add(new int[]{nr, nc, curr[2] + 1, nextBroken});
            }
        }
    }
}`
            }
        ]
    },
    {
        id: "matrix-shapes",
        title: "MatrixShapesSequence",
        category: "2D Grids",
        fullCode: `package com.interview.karat;

import java.util.*;

public class MatrixShapesSequence {

    /*
     * PART 1: Find the top-left and bottom-right coordinates of a SINGLE
     * rectangular shape of 0s in a grid of 1s.
     * Output: [rowStart, colStart, rowEnd, colEnd]
     * Time: O(R * C), Space: O(1)
     */
    public static int[] findSingleBoundingBox(int[][] grid) {
        int top = -1, left = -1;
        for (int r = 0; r < grid.length && top == -1; r++) {
            for (int c = 0; c < grid[0].length; c++) {
                if (grid[r][c] == 0) {
                    top = r; left = c;
                    break;
                }
            }
        }
        if (top == -1) return new int[]{-1, -1, -1, -1};

        int right = left;
        while (right < grid[0].length && grid[top][right] == 0) right++;
        right--;

        int bottom = top;
        while (bottom < grid.length && grid[bottom][left] == 0) bottom++;
        bottom--;

        return new int[]{top, left, bottom, right};
    }

    /*
     * PART 2: Find the bounding boxes of MULTIPLE isolated rectangular shapes.
     * Strategy: Scan the grid. When a 0 is found, find its box, then mark
     * those 0s as "visited" (e.g., flip to 1) so you don't process them again.
     * Time: O(R * C), Space: O(1)
     */
    public static List<int[]> findMultipleBoundingBoxes(int[][] grid) {
        List<int[]> boxes = new ArrayList<>();

        for (int r = 0; r < grid.length; r++) {
            for (int c = 0; c < grid[0].length; c++) {
                if (grid[r][c] == 0) {
                    // We found the top-left of a new rectangle
                    int right = c;
                    while (right < grid[0].length && grid[r][right] == 0) right++;
                    right--;

                    int bottom = r;
                    while (bottom < grid.length && grid[bottom][c] == 0) bottom++;
                    bottom--;

                    boxes.add(new int[]{r, c, bottom, right});

                    // Mark as visited by mutating the grid
                    for (int i = r; i <= bottom; i++) {
                        for (int j = c; j <= right; j++) {
                            grid[i][j] = 1;
                        }
                    }
                }
            }
        }
        return boxes;
    }

    /*
     * PART 3: The shapes are no longer perfect rectangles; they are irregular
     * clusters of 0s. Find the bounding box for each isolated irregular shape.
     * Strategy: DFS/BFS connected components tracking min/max coordinates.
     * Time: O(R * C), Space: O(R * C) for recursion/queue.
     */
    public static List<int[]> findIrregularBoundingBoxes(int[][] grid) {
        List<int[]> boxes = new ArrayList<>();
        // 2. Extract dimensions into clean variables
        int rows = grid.length;
        int cols = grid[0].length;

        // 3. Initialize the boolean matrix using the variables
        boolean[][] visited = new boolean[rows][cols];

        for (int r = 0; r < grid.length; r++) {
            for (int c = 0; c < grid[0].length; c++) {
                if (grid[r][c] == 0 && !visited[r][c]) {
                    int[] bounds = new int[]{r, c, r, c}; // [minR, minC, maxR, maxC]
                    exploreShapeDFS(grid, r, c, visited, bounds);
                    boxes.add(bounds);
                }
            }
        }
        return boxes;
    }

    private static final int[][] DIRS = {{-1,0}, {1,0}, {0,-1}, {0,1}};

    private static void exploreShapeDFS(int[][] grid, int r, int c, boolean[][] visited, int[] bounds) {
        visited[r][c] = true;
        bounds[0] = Math.min(bounds[0], r); // minR
        bounds[1] = Math.min(bounds[1], c); // minC
        bounds[2] = Math.max(bounds[2], r); // maxR
        bounds[3] = Math.max(bounds[3], c); // maxC

        for (int[] dir : DIRS) {
            int nr = r + dir[0];
            int nc = c + dir[1];
            if (nr >= 0 && nr < grid.length && nc >= 0 && nc < grid[0].length
                    && grid[nr][nc] == 0 && !visited[nr][nc]) {
                exploreShapeDFS(grid, nr, nc, visited, bounds);
            }
        }
    }
}`,
        fullCode: `package com.interview.karat;

import java.util.*;

public class MatrixShapesSequence {

    /*
     * PART 1: Find the top-left and bottom-right coordinates of a SINGLE
     * rectangular shape of 0s in a grid of 1s.
     * Output: [rowStart, colStart, rowEnd, colEnd]
     * Time: O(R * C), Space: O(1)
     */
    public static int[] findSingleBoundingBox(int[][] grid) {
        int top = -1, left = -1;
        for (int r = 0; r < grid.length && top == -1; r++) {
            for (int c = 0; c < grid[0].length; c++) {
                if (grid[r][c] == 0) {
                    top = r; left = c;
                    break;
                }
            }
        }
        if (top == -1) return new int[]{-1, -1, -1, -1};

        int right = left;
        while (right < grid[0].length && grid[top][right] == 0) right++;
        right--;

        int bottom = top;
        while (bottom < grid.length && grid[bottom][left] == 0) bottom++;
        bottom--;

        return new int[]{top, left, bottom, right};
    }

    /*
     * PART 2: Find the bounding boxes of MULTIPLE isolated rectangular shapes.
     * Strategy: Scan the grid. When a 0 is found, find its box, then mark
     * those 0s as "visited" (e.g., flip to 1) so you don't process them again.
     * Time: O(R * C), Space: O(1)
     */
    public static List<int[]> findMultipleBoundingBoxes(int[][] grid) {
        List<int[]> boxes = new ArrayList<>();

        for (int r = 0; r < grid.length; r++) {
            for (int c = 0; c < grid[0].length; c++) {
                if (grid[r][c] == 0) {
                    // We found the top-left of a new rectangle
                    int right = c;
                    while (right < grid[0].length && grid[r][right] == 0) right++;
                    right--;

                    int bottom = r;
                    while (bottom < grid.length && grid[bottom][c] == 0) bottom++;
                    bottom--;

                    boxes.add(new int[]{r, c, bottom, right});

                    // Mark as visited by mutating the grid
                    for (int i = r; i <= bottom; i++) {
                        for (int j = c; j <= right; j++) {
                            grid[i][j] = 1;
                        }
                    }
                }
            }
        }
        return boxes;
    }

    /*
     * PART 3: The shapes are no longer perfect rectangles; they are irregular
     * clusters of 0s. Find the bounding box for each isolated irregular shape.
     * Strategy: DFS/BFS connected components tracking min/max coordinates.
     * Time: O(R * C), Space: O(R * C) for recursion/queue.
     */
    public static List<int[]> findIrregularBoundingBoxes(int[][] grid) {
        List<int[]> boxes = new ArrayList<>();
        // 2. Extract dimensions into clean variables
        int rows = grid.length;
        int cols = grid[0].length;

        // 3. Initialize the boolean matrix using the variables
        boolean[][] visited = new boolean[rows][cols];

        for (int r = 0; r < grid.length; r++) {
            for (int c = 0; c < grid[0].length; c++) {
                if (grid[r][c] == 0 && !visited[r][c]) {
                    int[] bounds = new int[]{r, c, r, c}; // [minR, minC, maxR, maxC]
                    exploreShapeDFS(grid, r, c, visited, bounds);
                    boxes.add(bounds);
                }
            }
        }
        return boxes;
    }

    private static final int[][] DIRS = {{-1,0}, {1,0}, {0,-1}, {0,1}};

    private static void exploreShapeDFS(int[][] grid, int r, int c, boolean[][] visited, int[] bounds) {
        visited[r][c] = true;
        bounds[0] = Math.min(bounds[0], r); // minR
        bounds[1] = Math.min(bounds[1], c); // minC
        bounds[2] = Math.max(bounds[2], r); // maxR
        bounds[3] = Math.max(bounds[3], c); // maxC

        for (int[] dir : DIRS) {
            int nr = r + dir[0];
            int nc = c + dir[1];
            if (nr >= 0 && nr < grid.length && nc >= 0 && nc < grid[0].length
                    && grid[nr][nc] == 0 && !visited[nr][nc]) {
                exploreShapeDFS(grid, nr, nc, visited, bounds);
            }
        }
    }
}`,
        parts: [
            {
                subtitle: "Part 1: Single Rectangle",
                analogy: "Finding a perfectly rectangular lake in a forest. Once you find the top-left, just walk right and down to find the bounds.",
                trick: "Scan grid. First 0 is top-left. Use a `while` loop going Right until you hit a 1, then a `while` loop going Down until you hit a 1.",
                time: "O(R * C)", space: "O(1)",
                code: `for (int i = 0; i < R; i++) {
    for (int j = 0; j < C; j++) {
        if (grid[i][j] == 0) {
            int right = j;
            while (right < C && grid[i][right] == 0) right++;
            right--;
            
            int bottom = i;
            while (bottom < R && grid[bottom][j] == 0) bottom++;
            bottom--;
            
            return new int[]{i, j, bottom, right};
        }
    }
}`
            },
            {
                subtitle: "Part 2: Multiple Rectangles",
                analogy: "Multiple lakes. When you find one, map it, then 'dry it up' (fill with 1s) so you don't discover it again.",
                trick: "Same as Part 1, but inside the double for-loop. After finding `[top, left, bottom, right]`, loop through those bounds and set `grid[i][j] = 1`.",
                time: "O(R * C)", space: "O(1)",
                code: `List<int[]> shapes = new ArrayList<>();
for (int i = 0; i < R; i++) {
    for (int j = 0; j < C; j++) {
        if (grid[i][j] == 0) {
            int right = j, bottom = i;
            while (right < C && grid[i][right] == 0) right++;
            while (bottom < R && grid[bottom][j] == 0) bottom++;
            
            // Mark as visited (fill with 1s)
            for (int r = i; r < bottom; r++) {
                for (int c = j; c < right; c++) {
                    grid[r][c] = 1;
                }
            }
            shapes.add(new int[]{i, j, bottom - 1, right - 1});
        }
    }
}
return shapes;`
            },
            {
                subtitle: "Part 3: Irregular Shapes",
                analogy: "The lakes aren't perfect rectangles anymore. You have to walk the entire shoreline to find the extreme North/South/East/West bounds.",
                trick: "DFS to explore all connected 0s. Pass a `bounds` array reference. Constantly update `Math.min` and `Math.max` for Rows and Cols during DFS.",
                time: "O(R * C)", space: "O(R * C)",
                code: `private void dfs(int[][] grid, int r, int c, int[] bounds) {
    if (r < 0 || c < 0 || r >= R || c >= C || grid[r][c] == 1) return;
    
    grid[r][c] = 1; // Mark visited
    
    bounds[0] = Math.min(bounds[0], r); // min row
    bounds[1] = Math.min(bounds[1], c); // min col
    bounds[2] = Math.max(bounds[2], r); // max row
    bounds[3] = Math.max(bounds[3], c); // max col
    
    dfs(grid, r + 1, c, bounds);
    dfs(grid, r - 1, c, bounds);
    dfs(grid, r, c + 1, bounds);
    dfs(grid, r, c - 1, bounds);
}`
            }
        ]
    },
    {
        id: "parent-child",
        title: "ParentChildSequence",
        category: "Graph Theory",
        fullCode: `package com.interview.karat;

import java.util.*;

public class ParentChildSequence {

    /*
     * PART 1: Find individuals with exactly zero parents and exactly one parent.
     * Time: O(N) where N is number of pairs. Space: O(N)
     */
    public static void findZeroAndOneParents(int[][] pairs) {
        Map<Integer, Integer> inDegree = new HashMap<>();

        for (int[] pair : pairs) {
            inDegree.putIfAbsent(pair[0], 0);
            inDegree.put(pair[1], inDegree.getOrDefault(pair[1], 0) + 1);
        }

        List<Integer> zeroParents = new ArrayList<>();
        List<Integer> oneParent = new ArrayList<>();

        for (Map.Entry<Integer, Integer> entry : inDegree.entrySet()) {
            if (entry.getValue() == 0) zeroParents.add(entry.getKey());
            if (entry.getValue() == 1) oneParent.add(entry.getKey());
        }

        System.out.println("Zero Parents: " + zeroParents);
        System.out.println("One Parent: " + oneParent);
    }

    /*
     * PART 2: Do two individuals share a common ancestor?
     * Reuses buildParentMap() and getAncestors() helpers.
     * Time: O(V + E) for traversal. Space: O(V)
     */
    public static boolean hasCommonAncestor(int[][] pairs, int node1, int node2) {
        Map<Integer, List<Integer>> parentMap = buildParentMap(pairs);
        Set<Integer> ancestors1 = getAncestors(parentMap, node1);
        Set<Integer> ancestors2 = getAncestors(parentMap, node2);

        ancestors1.retainAll(ancestors2);
        return !ancestors1.isEmpty();
    }

    /*
     * PART 3: Find the earliest known ancestor (furthest distance up the graph).
     * Strategy: BFS using a Queue. The last node popped is the earliest ancestor.
     */
    public static int findEarliestAncestor(int[][] pairs, int startNode) {
        Map<Integer, List<Integer>> parentMap = buildParentMap(pairs);
        if (!parentMap.containsKey(startNode) || parentMap.get(startNode).isEmpty()) {
            return -1;
        }

        Queue<Integer> queue = new LinkedList<>();
        queue.add(startNode);
        int earliest = startNode;

        while (!queue.isEmpty()) {
            earliest = queue.poll();
            List<Integer> parents = parentMap.getOrDefault(earliest, new ArrayList<>());
            queue.addAll(parents);
        }
        return earliest;
    }

    // --- Helpers used by Part 2 and Part 3 ---
    private static Map<Integer, List<Integer>> buildParentMap(int[][] pairs) {
        Map<Integer, List<Integer>> map = new HashMap<>();
        for (int[] pair : pairs) {
            map.putIfAbsent(pair[1], new ArrayList<>());
            map.get(pair[1]).add(pair[0]);
        }
        return map;
    }

    private static Set<Integer> getAncestors(Map<Integer, List<Integer>> map, int node) {
        Set<Integer> ancestors = new HashSet<>();
        List<Integer> parents = map.getOrDefault(node, new ArrayList<>());
        for (int p : parents) {
            ancestors.add(p);
            ancestors.addAll(getAncestors(map, p));
        }
        return ancestors;
    }
}`,
        fullCode: `package com.interview.karat;

import java.util.*;

public class ParentChildSequence {

    /*
     * PART 1: Find individuals with exactly zero parents and exactly one parent.
     * Time: O(N) where N is number of pairs. Space: O(N)
     */
    public static void findZeroAndOneParents(int[][] pairs) {
        Map<Integer, Integer> inDegree = new HashMap<>();

        for (int[] pair : pairs) {
            inDegree.putIfAbsent(pair[0], 0);
            inDegree.put(pair[1], inDegree.getOrDefault(pair[1], 0) + 1);
        }

        List<Integer> zeroParents = new ArrayList<>();
        List<Integer> oneParent = new ArrayList<>();

        for (Map.Entry<Integer, Integer> entry : inDegree.entrySet()) {
            if (entry.getValue() == 0) zeroParents.add(entry.getKey());
            if (entry.getValue() == 1) oneParent.add(entry.getKey());
        }

        System.out.println("Zero Parents: " + zeroParents);
        System.out.println("One Parent: " + oneParent);
    }

    /*
     * PART 2: Do two individuals share a common ancestor?
     * Reuses buildParentMap() and getAncestors() helpers.
     * Time: O(V + E) for traversal. Space: O(V)
     */
    public static boolean hasCommonAncestor(int[][] pairs, int node1, int node2) {
        Map<Integer, List<Integer>> parentMap = buildParentMap(pairs);
        Set<Integer> ancestors1 = getAncestors(parentMap, node1);
        Set<Integer> ancestors2 = getAncestors(parentMap, node2);

        ancestors1.retainAll(ancestors2);
        return !ancestors1.isEmpty();
    }

    /*
     * PART 3: Find the earliest known ancestor (furthest distance up the graph).
     * Strategy: BFS using a Queue. The last node popped is the earliest ancestor.
     */
    public static int findEarliestAncestor(int[][] pairs, int startNode) {
        Map<Integer, List<Integer>> parentMap = buildParentMap(pairs);
        if (!parentMap.containsKey(startNode) || parentMap.get(startNode).isEmpty()) {
            return -1;
        }

        Queue<Integer> queue = new LinkedList<>();
        queue.add(startNode);
        int earliest = startNode;

        while (!queue.isEmpty()) {
            earliest = queue.poll();
            List<Integer> parents = parentMap.getOrDefault(earliest, new ArrayList<>());
            queue.addAll(parents);
        }
        return earliest;
    }

    // --- Helpers used by Part 2 and Part 3 ---
    private static Map<Integer, List<Integer>> buildParentMap(int[][] pairs) {
        Map<Integer, List<Integer>> map = new HashMap<>();
        for (int[] pair : pairs) {
            map.putIfAbsent(pair[1], new ArrayList<>());
            map.get(pair[1]).add(pair[0]);
        }
        return map;
    }

    private static Set<Integer> getAncestors(Map<Integer, List<Integer>> map, int node) {
        Set<Integer> ancestors = new HashSet<>();
        List<Integer> parents = map.getOrDefault(node, new ArrayList<>());
        for (int p : parents) {
            ancestors.add(p);
            ancestors.addAll(getAncestors(map, p));
        }
        return ancestors;
    }
}`,
        parts: [
            {
                subtitle: "Part 1: 0 or 1 Parents",
                analogy: "Finding people who are roots of the family tree (0 parents) or only have a single known parent.",
                trick: "Calculate In-Degree (number of incoming edges). Create a Map of `Node -> Count`. If count is 0 or 1, add to respective lists.",
                time: "O(E)", space: "O(V)",
                code: `Map<Integer, Integer> inDegree = new HashMap<>();
for (int[] relation : relations) {
    inDegree.putIfAbsent(relation[0], 0); // Parent might have 0
    inDegree.put(relation[1], inDegree.getOrDefault(relation[1], 0) + 1);
}

List<Integer> zeroParents = new ArrayList<>();
List<Integer> oneParent = new ArrayList<>();

for (Map.Entry<Integer, Integer> entry : inDegree.entrySet()) {
    if (entry.getValue() == 0) zeroParents.add(entry.getKey());
    if (entry.getValue() == 1) oneParent.add(entry.getKey());
}`
            },
            {
                subtitle: "Part 2: Common Ancestor",
                analogy: "Do two people share a great-grandparent? Trace both family lines all the way up and see if they intersect.",
                trick: "Build Adjacency List going UP (Child -> List of Parents). Write a recursive helper to get a `Set` of ALL ancestors. Intersect the two sets.",
                time: "O(V + E)", space: "O(V)",
                code: `Map<Integer, List<Integer>> parentMap = new HashMap<>();
// populate parentMap: child -> list of parents

public boolean hasCommonAncestor(int node1, int node2) {
    Set<Integer> ancestors1 = new HashSet<>();
    getAncestors(node1, parentMap, ancestors1);
    
    Set<Integer> ancestors2 = new HashSet<>();
    getAncestors(node2, parentMap, ancestors2);
    
    ancestors1.retainAll(ancestors2); // Intersection
    return !ancestors1.isEmpty();
}

private void getAncestors(int node, Map<Integer, List<Integer>> map, Set<Integer> set) {
    for (int parent : map.getOrDefault(node, new ArrayList<>())) {
        if (set.add(parent)) {
            getAncestors(parent, map, set);
        }
    }
}`
            },
            {
                subtitle: "Part 3: Earliest Ancestor",
                analogy: "Finding the oldest known ancestor in the family tree. Just keep going up until you can't.",
                trick: "Use BFS queue! Start at the node, add its parents to queue, pop, add their parents. The very LAST node popped from the queue is the earliest ancestor.",
                time: "O(V + E)", space: "O(V)",
                code: `Queue<Integer> queue = new LinkedList<>();
queue.add(startNode);
int earliest = startNode;

while (!queue.isEmpty()) {
    earliest = queue.poll();
    List<Integer> parents = parentMap.getOrDefault(earliest, new ArrayList<>());
    for (int p : parents) {
        queue.add(p);
    }
}
// Note: If startNode has no parents, we return startNode or -1 depending on requirements
return earliest == startNode ? -1 : earliest;`
            }
        ]
    },
    {
        id: "student-course",
        title: "StudentCoursesSequence",
        category: "Graph Theory",
        fullCode: `package com.interview.karat;

import java.util.*;

public class StudentCoursesSequence {

    /*
     * PART 1: Given [Student, Course] pairs, find the shared courses
     * between every possible pair of students.
     * Time: O(S^2 * C) where S is unique students and C is max courses.
     */
    public static Map<String, List<String>> findSharedCourses(String[][] pairs) {
        Map<String, Set<String>> studentCourses = new HashMap<>();
        for (String[] pair : pairs) {
            studentCourses.putIfAbsent(pair[0], new HashSet<>());
            studentCourses.get(pair[0]).add(pair[1]);
        }

        List<String> students = new ArrayList<>(studentCourses.keySet());
        Map<String, List<String>> shared = new HashMap<>();

        for (int i = 0; i < students.size(); i++) {
            for (int j = i + 1; j < students.size(); j++) {
                String s1 = students.get(i);
                String s2 = students.get(j);

                Set<String> intersection = new HashSet<>(studentCourses.get(s1));
                intersection.retainAll(studentCourses.get(s2));

                shared.put(s1 + "," + s2, new ArrayList<>(intersection));
            }
        }
        return shared;
    }

    /*
     * PART 2: Given a list of [Prerequisite, Course] pairs forming a single
     * continuous track, find the exact middle course.
     * Strategy: Build an adjacency list and in-degree map to find the start.
     * Time: O(N) where N is number of pairs. Space: O(N)
     */
    public static String findMiddleCourse(String[][] prereqs) {
        Map<String, String> graph = new HashMap<>();
        Map<String, Integer> inDegree = new HashMap<>();

        for (String[] p : prereqs) {
            String pre = p[0];
            String course = p[1];
            graph.put(pre, course);
            inDegree.putIfAbsent(pre, 0);
            inDegree.put(course, inDegree.getOrDefault(course, 0) + 1);
        }

        // Find the start (in-degree of 0)
        String start = "";
        for (String node : inDegree.keySet()) {
            if (inDegree.get(node) == 0) start = node;
        }

        // Traverse the path to find the total length and the sequence
        List<String> path = new ArrayList<>();
        String current = start;
        while (current != null) {
            path.add(current);
            current = graph.get(current);
        }

        // Return the middle element (integer division handles odd/even appropriately)
        return path.get((path.size() - 1) / 2);
    }

    /*
     * PART 3: Determine if a student can graduate. The prerequisite pairs now
     * contain multiple tracks and potential infinite loops (cycles).
     * Strategy: Cycle detection using DFS and recursion stack (colors).
     * Time: O(V + E), Space: O(V)
     */
    public static boolean canGraduate(String[][] prereqs) {
        Map<String, List<String>> graph = new HashMap<>();
        for (String[] p : prereqs) {
            graph.putIfAbsent(p[0], new ArrayList<>());
            graph.get(p[0]).add(p[1]);
        }

        // 0 = unvisited, 1 = visiting (in current path), 2 = fully visited
        Map<String, Integer> state = new HashMap<>();
        for (String node : graph.keySet()) state.put(node, 0);

        for (String node : graph.keySet()) {
            if (state.get(node) == 0) {
                if (hasCycle(graph, node, state)) return false; // Found a loop, cannot graduate
            }
        }
        return true;
    }

    private static boolean hasCycle(Map<String, List<String>> graph, String node, Map<String, Integer> state) {
        state.put(node, 1);

        for (String neighbor : graph.getOrDefault(node, new ArrayList<>())) {
            if (state.getOrDefault(neighbor, 0) == 1) return true;
            if (state.getOrDefault(neighbor, 0) == 0 && hasCycle(graph, neighbor, state)) return true;
        }

        state.put(node, 2);
        return false;
    }
}`,
        fullCode: `package com.interview.karat;

import java.util.*;

public class StudentCoursesSequence {

    /*
     * PART 1: Given [Student, Course] pairs, find the shared courses
     * between every possible pair of students.
     * Time: O(S^2 * C) where S is unique students and C is max courses.
     */
    public static Map<String, List<String>> findSharedCourses(String[][] pairs) {
        Map<String, Set<String>> studentCourses = new HashMap<>();
        for (String[] pair : pairs) {
            studentCourses.putIfAbsent(pair[0], new HashSet<>());
            studentCourses.get(pair[0]).add(pair[1]);
        }

        List<String> students = new ArrayList<>(studentCourses.keySet());
        Map<String, List<String>> shared = new HashMap<>();

        for (int i = 0; i < students.size(); i++) {
            for (int j = i + 1; j < students.size(); j++) {
                String s1 = students.get(i);
                String s2 = students.get(j);

                Set<String> intersection = new HashSet<>(studentCourses.get(s1));
                intersection.retainAll(studentCourses.get(s2));

                shared.put(s1 + "," + s2, new ArrayList<>(intersection));
            }
        }
        return shared;
    }

    /*
     * PART 2: Given a list of [Prerequisite, Course] pairs forming a single
     * continuous track, find the exact middle course.
     * Strategy: Build an adjacency list and in-degree map to find the start.
     * Time: O(N) where N is number of pairs. Space: O(N)
     */
    public static String findMiddleCourse(String[][] prereqs) {
        Map<String, String> graph = new HashMap<>();
        Map<String, Integer> inDegree = new HashMap<>();

        for (String[] p : prereqs) {
            String pre = p[0];
            String course = p[1];
            graph.put(pre, course);
            inDegree.putIfAbsent(pre, 0);
            inDegree.put(course, inDegree.getOrDefault(course, 0) + 1);
        }

        // Find the start (in-degree of 0)
        String start = "";
        for (String node : inDegree.keySet()) {
            if (inDegree.get(node) == 0) start = node;
        }

        // Traverse the path to find the total length and the sequence
        List<String> path = new ArrayList<>();
        String current = start;
        while (current != null) {
            path.add(current);
            current = graph.get(current);
        }

        // Return the middle element (integer division handles odd/even appropriately)
        return path.get((path.size() - 1) / 2);
    }

    /*
     * PART 3: Determine if a student can graduate. The prerequisite pairs now
     * contain multiple tracks and potential infinite loops (cycles).
     * Strategy: Cycle detection using DFS and recursion stack (colors).
     * Time: O(V + E), Space: O(V)
     */
    public static boolean canGraduate(String[][] prereqs) {
        Map<String, List<String>> graph = new HashMap<>();
        for (String[] p : prereqs) {
            graph.putIfAbsent(p[0], new ArrayList<>());
            graph.get(p[0]).add(p[1]);
        }

        // 0 = unvisited, 1 = visiting (in current path), 2 = fully visited
        Map<String, Integer> state = new HashMap<>();
        for (String node : graph.keySet()) state.put(node, 0);

        for (String node : graph.keySet()) {
            if (state.get(node) == 0) {
                if (hasCycle(graph, node, state)) return false; // Found a loop, cannot graduate
            }
        }
        return true;
    }

    private static boolean hasCycle(Map<String, List<String>> graph, String node, Map<String, Integer> state) {
        state.put(node, 1);

        for (String neighbor : graph.getOrDefault(node, new ArrayList<>())) {
            if (state.getOrDefault(neighbor, 0) == 1) return true;
            if (state.getOrDefault(neighbor, 0) == 0 && hasCycle(graph, neighbor, state)) return true;
        }

        state.put(node, 2);
        return false;
    }
}`,
        parts: [
            {
                subtitle: "Part 1: Shared Courses",
                analogy: "Finding out which classes you have in common with every other student.",
                trick: "Map Student -> Set of Courses. Use a double for-loop `(i=0 to n, j=i+1 to n)` to compare every pair using `Set.retainAll()`.",
                time: "O(S^2 * C)", space: "O(S * C)",
                code: `Map<String, Set<String>> studentToCourses = new HashMap<>();
// ... populate map ...

Map<String, Set<String>> shared = new HashMap<>();
List<String> students = new ArrayList<>(studentToCourses.keySet());

for (int i = 0; i < students.size(); i++) {
    for (int j = i + 1; j < students.size(); j++) {
        String s1 = students.get(i);
        String s2 = students.get(j);
        
        Set<String> intersection = new HashSet<>(studentToCourses.get(s1));
        intersection.retainAll(studentToCourses.get(s2)); // Keep only shared
        
        shared.put(s1 + "," + s2, intersection);
    }
}`
            },
            {
                subtitle: "Part 2: Middle Course",
                analogy: "Given a single straight track of prerequisites, find the class right in the middle.",
                trick: "Find the start node (In-Degree = 0). Traverse the `pre -> course` map until null, storing path in a List. Return `list.get(length/2)`.",
                time: "O(N)", space: "O(N)",
                code: `Map<String, String> graph = new HashMap<>();
Set<String> allCourses = new HashSet<>();
// populate graph (pre -> next) and allCourses

String start = null;
for (String course : allCourses) {
    if (!graph.containsValue(course)) {
        start = course; // Found the start!
        break;
    }
}

List<String> path = new ArrayList<>();
while (start != null) {
    path.add(start);
    start = graph.get(start);
}
return path.get((path.size() - 1) / 2);`
            },
            {
                subtitle: "Part 3: Cycle Detection",
                analogy: "Checking if a degree plan has an impossible loop (Course A requires B, and B requires A).",
                trick: "DFS Cycle Detection using 3 colors (states): 0=Unvisited, 1=Visiting (in current path stack), 2=Safe. If you visit a neighbor with state 1, it's a cycle!",
                time: "O(V + E)", space: "O(V)",
                code: `Map<String, Integer> state = new HashMap<>(); // 0: unvisited, 1: visiting, 2: safe
// initialize state to 0 for all nodes

public boolean hasCycle(String node, Map<String, List<String>> graph, Map<String, Integer> state) {
    if (state.get(node) == 1) return true; // Found a cycle!
    if (state.get(node) == 2) return false; // Already verified safe
    
    state.put(node, 1); // Mark as visiting
    for (String neighbor : graph.getOrDefault(node, new ArrayList<>())) {
        if (hasCycle(neighbor, graph, state)) {
            return true;
        }
    }
    state.put(node, 2); // Mark as safe
    return false;
}`
            }
        ]
    },
    {
        id: "toll-system",
        title: "TollSystemSequence",
        category: "Logs & States",
        fullCode: `package com.interview.karat;

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

        System.out.println("\\n--- PART 2: Extreme Speeders (>= 130 km/h in any single segment) ---");
        Set<String> extremeSpeeders = catchExtremeSpeeders(logs);
        System.out.println("Extreme Speeders: " + extremeSpeeders);
        // Expected: [ABC111] (DEF222 was only going ~124 km/h, so they escape this rule)

        System.out.println("\\n--- PART 3: All Speeders (Includes >= 120 km/h in two segments) ---");
        Set<String> allSpeeders = catchAllSpeeders(logs);
        System.out.println("All Speeders: " + allSpeeders);
        // Expected: [ABC111, DEF222] (DEF222 gets caught here for two 124 km/h segments)

        System.out.println("\\n--- PART 4: Count Journeys -including entry and exit ---");
        Map<String, Integer> strictJourneys = getStrictCompletedJourneys(logs);
        for (Map.Entry<String, Integer> entry : journeys.entrySet()) {
            System.out.println("Plate " + entry.getKey() + " made " + entry.getValue() + " journey(s).");
        }
    }
}`,
        fullCode: `package com.interview.karat;

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

        System.out.println("\\n--- PART 2: Extreme Speeders (>= 130 km/h in any single segment) ---");
        Set<String> extremeSpeeders = catchExtremeSpeeders(logs);
        System.out.println("Extreme Speeders: " + extremeSpeeders);
        // Expected: [ABC111] (DEF222 was only going ~124 km/h, so they escape this rule)

        System.out.println("\\n--- PART 3: All Speeders (Includes >= 120 km/h in two segments) ---");
        Set<String> allSpeeders = catchAllSpeeders(logs);
        System.out.println("All Speeders: " + allSpeeders);
        // Expected: [ABC111, DEF222] (DEF222 gets caught here for two 124 km/h segments)

        System.out.println("\\n--- PART 4: Count Journeys -including entry and exit ---");
        Map<String, Integer> strictJourneys = getStrictCompletedJourneys(logs);
        for (Map.Entry<String, Integer> entry : journeys.entrySet()) {
            System.out.println("Plate " + entry.getKey() + " made " + entry.getValue() + " journey(s).");
        }
    }
}`,
        parts: [
            {
                subtitle: "Part 1: Count Journeys",
                analogy: "Counting how many times each car got onto the highway.",
                trick: "Parse the log strings. Ignore everything except action='ENTRY'. Add to a HashMap counter.",
                time: "O(N)", space: "O(U)",
                code: `Map<String, Integer> counts = new HashMap<>();
for (String log : logs) {
    String[] parts = log.split(",");
    String plate = parts[0];
    String action = parts[2];
    
    if (action.equals("ENTRY")) {
        counts.put(plate, counts.getOrDefault(plate, 0) + 1);
    }
}
return counts;`
            },
            {
                subtitle: "Part 2: Extreme Speeders",
                analogy: "Catching anyone driving >130km/h between two toll cameras spaced 10km apart.",
                trick: "Store `lastSeenTime` per plate. On MAINROAD/EXIT, `timeDiff = curr - lastSeen`. Speed is `10.0 / timeDiff * 3600`. If > 130, flag them.",
                time: "O(N)", space: "O(U)",
                code: `Map<String, Integer> lastSeen = new HashMap<>();
Set<String> speeders = new HashSet<>();

for (String log : logs) {
    String[] parts = log.split(",");
    String plate = parts[0];
    int time = Integer.parseInt(parts[1]);
    String action = parts[2];
    
    if (action.equals("ENTRY")) {
        lastSeen.put(plate, time);
    } else if (lastSeen.containsKey(plate)) {
        int timeDiff = time - lastSeen.get(plate);
        double speed = (10.0 / timeDiff) * 3600.0;
        
        if (speed >= 130.0) {
            speeders.add(plate);
        }
        lastSeen.put(plate, time); // update for next segment
    }
}`
            },
            {
                subtitle: "Part 3: All Speeders",
                analogy: "Logs are jumbled! Also catch people driving >120km/h twice in the SAME journey.",
                trick: "Group logs by plate. Sort chronologically! Reset violation count on 'ENTRY'. Increment on >120. If count == 2 or speed > 130, flag.",
                time: "O(N log N)", space: "O(N)",
                code: `// First, group by plate and sort logs by time
for (Map.Entry<String, List<Log>> entry : plateLogs.entrySet()) {
    List<Log> history = entry.getValue();
    Collections.sort(history, (a, b) -> Integer.compare(a.time, b.time));
    
    int over120Count = 0;
    int lastTime = -1;
    
    for (Log log : history) {
        if (log.action.equals("ENTRY")) {
            over120Count = 0; // Reset for new journey
            lastTime = log.time;
        } else if (lastTime != -1) {
            double speed = (10.0 / (log.time - lastTime)) * 3600;
            if (speed >= 130.0) {
                speeders.add(entry.getKey());
            } else if (speed >= 120.0) {
                over120Count++;
                if (over120Count >= 2) speeders.add(entry.getKey());
            }
            lastTime = log.time;
        }
    }
}`
            }
        ]
    },
    {
        id: "continuous-history",
        title: "ContinuousHistorySequence",
        category: "Dynamic Programming",
        fullCode: `package com.interview.karat;

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
}`,
        fullCode: `package com.interview.karat;

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
}`,
        parts: [
            {
                subtitle: "Part 1: Build Histories",
                analogy: "Just creating a list of websites visited for each user.",
                trick: "HashMap where Key is User, Value is an ArrayList of domains.",
                time: "O(N)", space: "O(N)",
                code: `Map<String, List<String>> userHistories = new HashMap<>();
for (String[] log : logs) {
    String user = log[0];
    String domain = log[1];
    
    userHistories.putIfAbsent(user, new ArrayList<>());
    userHistories.get(user).add(domain);
}`
            },
            {
                subtitle: "Part 2: Longest Shared Sequence",
                analogy: "Finding the exact longest contiguous overlap of browsing history between two people.",
                trick: "DP Longest Common Substring algorithm. `dp[i][j]` tracks length of matching suffix. If `arr1[i] == arr2[j]`, then `dp[i][j] = dp[i-1][j-1] + 1`.",
                time: "O(M * N)", space: "O(M * N)",
                code: `int maxLen = 0;
int endIdx = 0;
int[][] dp = new int[h1.size() + 1][h2.size() + 1];

for (int i = 1; i <= h1.size(); i++) {
    for (int j = 1; j <= h2.size(); j++) {
        if (h1.get(i - 1).equals(h2.get(j - 1))) {
            dp[i][j] = dp[i - 1][j - 1] + 1;
            
            if (dp[i][j] > maxLen) {
                maxLen = dp[i][j];
                endIdx = i; // Tracking end index to reconstruct later
            }
        }
    }
}
return h1.subList(endIdx - maxLen, endIdx);`
            },
            {
                subtitle: "Part 3: One-Step Checkout",
                analogy: "Did they go from 'Home' to 'Checkout' with exactly one page in between?",
                trick: "Simple sliding window of size 3 on the list. `list.get(i) == start` AND `list.get(i+2) == end`.",
                time: "O(N)", space: "O(1)",
                code: `List<String> hist = userHistories.get(user);
if (hist == null || hist.size() < 3) return false;

for (int i = 0; i <= hist.size() - 3; i++) {
    if (hist.get(i).equals(startDomain) && hist.get(i + 2).equals(endDomain)) {
        return true;
    }
}
return false;`
            }
        ]
    },
    {
        id: "voting-sys",
        title: "VotingSystemSequence",
        category: "Counting",
        fullCode: `package com.interview.karat;

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
}`,
        fullCode: `package com.interview.karat;

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
}`,
        parts: [
            {
                subtitle: "Part 1: Simple Majority",
                analogy: "Who got the most votes overall?",
                trick: "HashMap frequency counting. Track max votes as you loop so you don't need a second pass.",
                time: "O(N)", space: "O(U)",
                code: `Map<String, Integer> counts = new HashMap<>();
int maxVotes = 0;
String winner = "";

for (String vote : votes) {
    int v = counts.getOrDefault(vote, 0) + 1;
    counts.put(vote, v);
    
    if (v > maxVotes) {
        maxVotes = v;
        winner = vote;
    }
}
return winner;`
            },
            {
                subtitle: "Part 2: Ranked Choice",
                analogy: "1st place gets 3 pts, 2nd gets 2, 3rd gets 1.",
                trick: "Same map approach. Read ballot index 0, 1, 2 and add 3, 2, 1 points to their respective map values.",
                time: "O(N)", space: "O(U)",
                code: `Map<String, Integer> scores = new HashMap<>();

for (String[] ballot : ballots) {
    scores.put(ballot[0], scores.getOrDefault(ballot[0], 0) + 3); // 1st
    scores.put(ballot[1], scores.getOrDefault(ballot[1], 0) + 2); // 2nd
    scores.put(ballot[2], scores.getOrDefault(ballot[2], 0) + 1); // 3rd
}

// Then find the max score similar to Part 1
String winner = "";
int maxScore = 0;
// loop map...`
            },
            {
                subtitle: "Part 3: Tie Breakers",
                analogy: "Tie breaker falls to who has the most 1st place votes, then 2nd place votes.",
                trick: "Map Candidate -> `int[4] {Total, 1stPlace, 2ndPlace, 3rdPlace}`. Extract entries to a list, write a custom Comparator checking array indices.",
                time: "O(N + U log U)", space: "O(U)",
                code: `// Populate map with int[]{TotalScore, FirstPlaceCount, SecondPlaceCount, ThirdPlaceCount}
List<Map.Entry<String, int[]>> results = new ArrayList<>(scores.entrySet());

results.sort((a, b) -> {
    int[] scoreA = a.getValue();
    int[] scoreB = b.getValue();
    
    if (scoreA[0] != scoreB[0]) return Integer.compare(scoreB[0], scoreA[0]); // Total Score
    if (scoreA[1] != scoreB[1]) return Integer.compare(scoreB[1], scoreA[1]); // 1st Place
    if (scoreA[2] != scoreB[2]) return Integer.compare(scoreB[2], scoreA[2]); // 2nd Place
    return Integer.compare(scoreB[3], scoreA[3]);                             // 3rd Place
});

return results.get(0).getKey();`
            }
        ]
    },
    {
        id: "word-game",
        title: "WordGameSequence",
        category: "Counting",
        fullCode: `package com.interview.karat;

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
}`,
        fullCode: `package com.interview.karat;

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
}`,
        parts: [
            {
                subtitle: "Part 1: Can Build Word",
                analogy: "Checking if you have the right Scrabble letters to spell a word.",
                trick: "Create `int[26]` frequency array. Add counts for available letters. Loop target word, decrement counts. If `< 0`, return false.",
                time: "O(L + W)", space: "O(1)",
                code: `public boolean canBuild(String available, String target) {
    int[] counts = new int[26];
    for (char c : available.toCharArray()) {
        counts[c - 'a']++;
    }
    
    for (char c : target.toCharArray()) {
        if (--counts[c - 'a'] < 0) {
            return false;
        }
    }
    return true;
}`
            },
            {
                subtitle: "Part 2: Longest Word",
                analogy: "Given a dictionary, find the longest word you can spell.",
                trick: "Loop dictionary, check `if (word.length() > longest.length())`. Use Part 1 helper function to check if buildable.",
                time: "O(N * W)", space: "O(1)",
                code: `String longest = "";
for (String word : dictionary) {
    // Optimization: only check if it's strictly longer than our current best
    if (word.length() > longest.length()) {
        if (canBuild(availableLetters, word)) {
            longest = word;
        }
    }
}
return longest;`
            },
            {
                subtitle: "Part 3: Wildcards",
                analogy: "You have blank Scrabble tiles '-' that can act as any letter.",
                trick: "Keep a separate `int wildcards` counter. If a target letter count is <= 0, decrement wildcards instead. If wildcards < 0, fail.",
                time: "O(L + W)", space: "O(1)",
                code: `public boolean canBuildWithWildcards(String available, String target) {
    int[] counts = new int[26];
    int wildcards = 0;
    
    for (char c : available.toCharArray()) {
        if (c == '-') wildcards++;
        else counts[c - 'a']++;
    }
    
    for (char c : target.toCharArray()) {
        if (counts[c - 'a'] > 0) {
            counts[c - 'a']--;
        } else if (wildcards > 0) {
            wildcards--; // Use a wildcard!
        } else {
            return false;
        }
    }
    return true;
}`
            }
        ]
    },
    {
        id: "domain-clicks",
        title: "DomainClickContinousHistory",
        category: "Dynamic Programming",
        fullCode: `package com.interview.karat;

import java.util.*;

public class DomainClickContinousHistory {
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

    public static void main(String[] args) {
        // ---------------------------------------------------------
        // PART 1 & 2: Raw Click Logs
        // ---------------------------------------------------------
        String[][] logs = {
                {"user1", "google.com"},
                {"user1", "yahoo.com"},
                {"user1", "amazon.com"},
                {"user1", "ebay.com"},
                {"user2", "bing.com"},
                {"user2", "yahoo.com"},
                {"user2", "amazon.com"},
                {"user2", "ebay.com"},
                {"user2", "netflix.com"},
                {"user3", "google.com"},
                {"user3", "yahoo.com"}
        };

        System.out.println("--- PART 1: Build User Histories ---");
        Map<String, List<String>> histories = buildUserHistories(logs);

        for (Map.Entry<String, List<String>> entry : histories.entrySet()) {
            System.out.println(entry.getKey() + ": " + entry.getValue());
        }
        // Expected Output:
        // user1: [google.com, yahoo.com, amazon.com, ebay.com]
        // user2: [bing.com, yahoo.com, amazon.com, ebay.com, netflix.com]
        // user3: [google.com, yahoo.com]


        System.out.println("\\n--- PART 2: Longest Common Continuous History ---");
        List<String> u1 = histories.get("user1");
        List<String> u2 = histories.get("user2");

        List<String> common = findLongestCommon(u1, u2);
        System.out.println("Longest shared between user1 & user2: " + common);
        // Expected Output:
        // Longest shared between user1 & user2: [yahoo.com, amazon.com, ebay.com]


        // ---------------------------------------------------------
        // PART 3: One-Step Checkout paths
        // ---------------------------------------------------------
        System.out.println("\\n--- PART 3: One-Step Checkout ---");

        // Valid: Exactly one step ("catalog") between "home" and "checkout"
        List<String> path1 = Arrays.asList("home", "catalog", "checkout", "logout");

        // Invalid: Zero steps between them
        List<String> path2 = Arrays.asList("home", "checkout");

        // Invalid: Two steps between them ("catalog" and "cart")
        List<String> path3 = Arrays.asList("home", "catalog", "cart", "checkout");

        System.out.println("Path 1 (1 step)  : " + hasOneStepCheckout(path1, "home", "checkout"));
        System.out.println("Path 2 (0 steps) : " + hasOneStepCheckout(path2, "home", "checkout"));
        System.out.println("Path 3 (2 steps) : " + hasOneStepCheckout(path3, "home", "checkout"));
        // Expected Output:
        // Path 1 (1 step)  : true
        // Path 2 (0 steps) : false
        // Path 3 (2 steps) : false
    }
}
`,
        fullCode: `package com.interview.karat;

import java.util.*;

public class DomainClickContinousHistory {
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

    public static void main(String[] args) {
        // ---------------------------------------------------------
        // PART 1 & 2: Raw Click Logs
        // ---------------------------------------------------------
        String[][] logs = {
                {"user1", "google.com"},
                {"user1", "yahoo.com"},
                {"user1", "amazon.com"},
                {"user1", "ebay.com"},
                {"user2", "bing.com"},
                {"user2", "yahoo.com"},
                {"user2", "amazon.com"},
                {"user2", "ebay.com"},
                {"user2", "netflix.com"},
                {"user3", "google.com"},
                {"user3", "yahoo.com"}
        };

        System.out.println("--- PART 1: Build User Histories ---");
        Map<String, List<String>> histories = buildUserHistories(logs);

        for (Map.Entry<String, List<String>> entry : histories.entrySet()) {
            System.out.println(entry.getKey() + ": " + entry.getValue());
        }
        // Expected Output:
        // user1: [google.com, yahoo.com, amazon.com, ebay.com]
        // user2: [bing.com, yahoo.com, amazon.com, ebay.com, netflix.com]
        // user3: [google.com, yahoo.com]


        System.out.println("\\n--- PART 2: Longest Common Continuous History ---");
        List<String> u1 = histories.get("user1");
        List<String> u2 = histories.get("user2");

        List<String> common = findLongestCommon(u1, u2);
        System.out.println("Longest shared between user1 & user2: " + common);
        // Expected Output:
        // Longest shared between user1 & user2: [yahoo.com, amazon.com, ebay.com]


        // ---------------------------------------------------------
        // PART 3: One-Step Checkout paths
        // ---------------------------------------------------------
        System.out.println("\\n--- PART 3: One-Step Checkout ---");

        // Valid: Exactly one step ("catalog") between "home" and "checkout"
        List<String> path1 = Arrays.asList("home", "catalog", "checkout", "logout");

        // Invalid: Zero steps between them
        List<String> path2 = Arrays.asList("home", "checkout");

        // Invalid: Two steps between them ("catalog" and "cart")
        List<String> path3 = Arrays.asList("home", "catalog", "cart", "checkout");

        System.out.println("Path 1 (1 step)  : " + hasOneStepCheckout(path1, "home", "checkout"));
        System.out.println("Path 2 (0 steps) : " + hasOneStepCheckout(path2, "home", "checkout"));
        System.out.println("Path 3 (2 steps) : " + hasOneStepCheckout(path3, "home", "checkout"));
        // Expected Output:
        // Path 1 (1 step)  : true
        // Path 2 (0 steps) : false
        // Path 3 (2 steps) : false
    }
}
`,
        parts: [
            {
                subtitle: "Part 1: Build User Histories",
                analogy: "Creating a personalized browsing timeline for each user.",
                trick: "Iterate through the logs, safely adding domains to a `HashMap<String, List<String>>` keyed by User ID.",
                time: "O(N)", space: "O(N)",
                code: `public static Map<String, List<String>> buildUserHistories(String[][] logs) {
    Map<String, List<String>> userHistories = new HashMap<>();
    if (logs == null || logs.length == 0) return userHistories;

    for (String[] log : logs) {
        String userId = log[0];
        String domain = log[1];

        userHistories.putIfAbsent(userId, new ArrayList<>());
        userHistories.get(userId).add(domain);
    }
    return userHistories;
}`
            },
            {
                subtitle: "Part 2: Longest Common Clicks",
                analogy: "Finding the longest identical chain of clicks between two users' browsing sessions.",
                trick: "Classic DP table for Longest Common Substring. Track max length and the `endIndex` so you can return `history1.subList(endIndex - maxLen, endIndex)`.",
                time: "O(M * N)", space: "O(M * N)",
                code: `public static List<String> findLongestCommon(List<String> history1, List<String> history2) {
    if (history1 == null || history2 == null) return new ArrayList<>();

    int maxLen = 0;
    int endIndex = -1;
    int len1 = history1.size(), len2 = history2.size();
    int[][] dp = new int[len1 + 1][len2 + 1];

    for (int i = 1; i <= len1; i++) {
        for (int j = 1; j <= len2; j++) {
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
}`
            },
            {
                subtitle: "Part 3: One-Step Checkout Paths",
                analogy: "Did the user go from Home to Checkout with exactly ONE intermediate page view?",
                trick: "Use a sliding window of size 3 across the history list. Check `history.get(i)` against start, and `history.get(i+2)` against end.",
                time: "O(N)", space: "O(1)",
                code: `public static boolean hasOneStepCheckout(List<String> userHistory, String startPage, String endPage) {
    if (userHistory == null || userHistory.size() < 3) return false;

    // Slide a window of size 3 across the history
    for (int i = 0; i <= userHistory.size() - 3; i++) {
        // Check if index matches startPage AND index+2 matches endPage
        if (userHistory.get(i).equals(startPage) && userHistory.get(i + 2).equals(endPage)) {
            return true;
        }
    }
    return false;
}`
            }
        ]
    }
];

// App State
let activeFilter = 'All';
let currentClassId = null;
let currentPartIndex = 0;
let masteredClasses = JSON.parse(localStorage.getItem('masteredClasses') || '[]');

// DOM Elements
const searchInput = document.getElementById('searchInput');
const categoryFilters = document.getElementById('categoryFilters');
const classList = document.getElementById('classList');
const welcomeState = document.getElementById('welcomeState');
const detailState = document.getElementById('detailState');
const tabBtns = document.querySelectorAll('.tab-btn');
const masteredCheckbox = document.getElementById('masteredCheckbox');
const copyBtn = document.getElementById('copyBtn');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const viewFullCodeBtn = document.getElementById('viewFullCodeBtn');
const fullCodeModal = document.getElementById('fullCodeModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const fullCodeBlock = document.getElementById('fullCodeBlock');

// Extract unique categories
const categories = ['All', ...new Set(javaClasses.map(c => c.category))];

function init() {
    renderFilters();
    renderClassList();
    setupEventListeners();
    updateProgress();
}

function renderFilters() {
    categoryFilters.innerHTML = categories.map(cat => 
        `<button class="filter-btn ${cat === activeFilter ? 'active' : ''}" data-cat="${cat}">${cat}</button>`
    ).join('');
}

function renderClassList() {
    const searchTerm = searchInput.value.toLowerCase();
    
    const filtered = javaClasses.filter(c => {
        const matchesSearch = c.title.toLowerCase().includes(searchTerm) || 
                              c.category.toLowerCase().includes(searchTerm);
        const matchesCategory = activeFilter === 'All' || c.category === activeFilter;
        return matchesSearch && matchesCategory;
    });

    classList.innerHTML = filtered.map(c => {
        const isMastered = masteredClasses.includes(c.id) ? 'mastered' : '';
        const isActive = c.id === currentClassId ? 'active' : '';
        return `
        <div class="class-card ${isMastered} ${isActive}" data-id="${c.id}">
            <div style="font-family:'Caveat'; font-size:1.6rem; font-weight:bold;">${c.title}</div>
            <div style="font-size:1rem; opacity:0.8;">${c.category}</div>
        </div>
        `;
    }).join('');
}

function showDetail(id) {
    currentClassId = id;
    const data = javaClasses.find(c => c.id === id);
    if (!data) return;

    // Update active states
    document.querySelectorAll('.class-card').forEach(card => card.classList.remove('active'));
    const selectedCard = document.querySelector(`.class-card[data-id="${id}"]`);
    if(selectedCard) selectedCard.classList.add('active');

    welcomeState.classList.remove('active');
    detailState.classList.add('active');

    document.getElementById('detailCategory').innerText = data.category;
    document.getElementById('detailTitle').innerText = data.title;
    
    // Update mastered toggle
    const isMastered = masteredClasses.includes(id);
    masteredCheckbox.checked = isMastered;
    updateMasteredUI(isMastered);

    // Always default to Part 1 when opening a new class
    showPart(0);
}

function showPart(index) {
    currentPartIndex = index;
    const data = javaClasses.find(c => c.id === currentClassId);
    const part = data.parts[index];

    // Update tabs
    tabBtns.forEach((btn, i) => {
        if(i === index) btn.classList.add('active');
        else btn.classList.remove('active');
    });

    // Populate data
    document.getElementById('partSubtitle').innerText = part.subtitle;
    document.getElementById('partAnalogy').innerText = part.analogy;
    document.getElementById('partTrick').innerText = part.trick;
    document.getElementById('partTime').innerText = part.time;
    document.getElementById('partSpace').innerText = part.space;
    const codeEl = document.getElementById('partCode');
    codeEl.textContent = part.code;
    
    // Syntax highlighting
    if (window.hljs) {
        codeEl.removeAttribute('data-highlighted');
        hljs.highlightElement(codeEl);
    }
}

function setupEventListeners() {
    searchInput.addEventListener('input', renderClassList);
    
    categoryFilters.addEventListener('click', (e) => {
        if (e.target.classList.contains('filter-btn')) {
            activeFilter = e.target.dataset.cat;
            renderFilters();
            renderClassList();
        }
    });

    classList.addEventListener('click', (e) => {
        const card = e.target.closest('.class-card');
        if (card) showDetail(card.dataset.id);
    });

    tabBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.target.dataset.part);
            showPart(index);
        });
    });

    masteredCheckbox.addEventListener('change', (e) => {
        if(!currentClassId) return;
        const isChecked = e.target.checked;
        
        if(isChecked && !masteredClasses.includes(currentClassId)) {
            masteredClasses.push(currentClassId);
        } else if (!isChecked) {
            masteredClasses = masteredClasses.filter(id => id !== currentClassId);
        }
        
        localStorage.setItem('masteredClasses', JSON.stringify(masteredClasses));
        updateMasteredUI(isChecked);
        renderClassList();
        const selectedCard = document.querySelector(`.class-card[data-id="${currentClassId}"]`);
        if(selectedCard) selectedCard.classList.add('active');
        updateProgress();
    });

    copyBtn.addEventListener('click', () => {
        const code = document.getElementById('partCode').textContent;
        navigator.clipboard.writeText(code).then(() => {
            copyBtn.innerText = '✅ Copied!';
            setTimeout(() => copyBtn.innerText = '📋 Copy', 2000);
        });
    });

    viewFullCodeBtn.addEventListener('click', () => {
        if(!currentClassId) return;
        const data = javaClasses.find(c => c.id === currentClassId);
        document.getElementById('modalTitle').innerText = data.title + ".java";
        fullCodeBlock.textContent = data.fullCode;
        
        if (window.hljs) {
            fullCodeBlock.removeAttribute('data-highlighted');
            hljs.highlightElement(fullCodeBlock);
        }
        
        fullCodeModal.style.display = 'flex';
    });

    closeModalBtn.addEventListener('click', () => {
        fullCodeModal.style.display = 'none';
    });

    fullCodeModal.addEventListener('click', (e) => {
        if(e.target === fullCodeModal) {
            fullCodeModal.style.display = 'none';
        }
    });
}

function updateMasteredUI(isMastered) {
    const toggle = masteredCheckbox.parentElement;
    const text = document.getElementById('masteredText');
    if(isMastered) {
        toggle.classList.add('is-mastered');
        text.innerText = '✅ Mastered!';
    } else {
        toggle.classList.remove('is-mastered');
        text.innerText = 'Mark as Mastered';
    }
}

function updateProgress() {
    const total = javaClasses.length;
    const mastered = masteredClasses.length;
    const percent = Math.round((mastered / total) * 100);
    
    progressFill.style.width = `${percent}%`;
    progressText.innerText = `${mastered}/${total} Mastered (${percent}%)`;
}

init();
