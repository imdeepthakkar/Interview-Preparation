package com.interview.karat;

import java.util.*;

// @Title StudentCoursesSequence
// @Category Graph Theory

public class StudentCoursesSequence {

    // @Part 1
    // @Subtitle Shared Courses
    // @Analogy Finding out which classes you have in common with every other student.
    // @Trick Map Student -> Set of Courses. Use a double for-loop `(i=0 to n, j=i+1 to n)` to compare every pair using `Set.retainAll()`.
    // @Time O(S^2 * C)
    // @Space O(S * C)
    /*
     * PART 1: Given [Student, Course] pairs, find the shared courses
     * between every possible pair of students.
     * Time: O(S^2 * C) where S is unique students and C is max courses.
     */
    public static Map<String, List<String>> findSharedCourses(String[][] pairs) {
        Map<String, Set<String>> studentCourses = new HashMap<>(); // Map of {Student : [course1, course2, course 3]}
        for (String[] pair : pairs) {
            studentCourses.putIfAbsent(pair[0], new HashSet<>());
            studentCourses.get(pair[0]).add(pair[1]);
        }

        List<String> students = new ArrayList<>(studentCourses.keySet()); // Get Unique Student names
        Map<String, List<String>> shared = new HashMap<>();

        for (int i = 0; i < students.size(); i++) {
            for (int j = i + 1; j < students.size(); j++) {
                String s1 = students.get(i);
                String s2 = students.get(j);

                Set<String> intersection = new HashSet<>(studentCourses.get(s1));
                intersection.retainAll(studentCourses.get(s2)); // common courses between s1 and s2

                shared.put(s1 + " and " + s2, new ArrayList<>(intersection));
            }
        }
        return shared;
    }

    // @Part 2
    // @Subtitle Middle Course
    // @Analogy Given a single straight track of prerequisites, find the class right in the middle.
    // @Trick Find the start node (In-Degree = 0). Traverse the `pre -> course` map until null, storing path in a List. Return `list.get(length/2)`.
    // @Time O(N)
    // @Space O(N)
    /*
     * PART 2: Given a list of [Prerequisite, Course] pairs forming a single
     * continuous track, find the exact middle course.
     * Strategy: Build an adjacency list and in-degree map to find the start.
     * Time: O(N) where N is number of pairs. Space: O(N)
     */
    public static String    findMiddleCourse(String[][] prereqs) {
        Map<String, String> graph = new HashMap<>();
        Set<String> destinations = new HashSet<>();

        // 1. Build the graph and track every class that has a prerequisite
        for (String[] p : prereqs) {
            graph.put(p[0], p[1]);
            destinations.add(p[1]);
        }

        // 2. Find the start (the only class NOT in the destinations set)
        String current = "";
        for (String course : graph.keySet()) {
            if (!destinations.contains(course)) {
                current = course;
                break;
            }
        }

        // 3. Walk the track from start to finish
        List<String> path = new ArrayList<>();
        while (current != null) {
            path.add(current);
            current = graph.get(current);
        }

        // 4. Return the exact middle
        return path.get((path.size() - 1) / 2);
    }

    // @Part 3
    // @Subtitle Cycle Detection
    // @Analogy Checking if a degree plan has an impossible loop (Course A requires B, and B requires A).
    // @Trick DFS Cycle Detection using 3 colors (states): 0=Unvisited, 1=Visiting (in current path stack), 2=Safe. If you visit a neighbor with state 1, it's a cycle!
    // @Time O(V + E)
    // @Space O(V)
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

    public static void main(String[] args) {

        // ---------------------------------------------------------
        // PART 1: Shared Courses
        // ---------------------------------------------------------
        System.out.println("--- PART 1: Shared Courses ---");
        String[][] studentCoursePairs = {
                {"Deep", "Linear Algebra"},
                {"Aarav", "Art History"},
                {"Aarav", "Operating Systems"},
                {"Deep", "Mechanics"},
                {"Deep", "Art History"},
                {"Virat", "Linear Algebra"},
                {"Virat", "Mechanics"}
        };

        Map<String, List<String>> shared = findSharedCourses(studentCoursePairs);
        for (Map.Entry<String, List<String>> entry : shared.entrySet()) {
            System.out.println("Students " + entry.getKey() + " share: " + entry.getValue());
        }
        // Expected Output (order of keys may vary due to HashMap):
        // Students 58,17 share: [Linear Algebra, Mechanics]
        // Students 17,94 share: []
        // Students 58,94 share: [Art History]


        // ---------------------------------------------------------
        // PART 2: Middle Course
        // ---------------------------------------------------------
        System.out.println("\n--- PART 2: Middle Course ---");
        String[][] singleTrackPrereqs = {
                {"Data Structures", "Algorithms"},
                {"Foundations", "Data Structures"},
                {"Algorithms", "Operating Systems"},
                {"Operating Systems", "Networks"}
        };

        // The track flows: Foundations -> Data Structures -> Algorithms -> Operating Systems -> Networks
        String middle = findMiddleCourse(singleTrackPrereqs);
        System.out.println("Middle Course: " + middle);
        // Expected Output: Algorithms


        // ---------------------------------------------------------
        // PART 3: Cycle Detection (Can Graduate?)
        // ---------------------------------------------------------
        System.out.println("\n--- PART 3: Cycle Detection ---");

        // Valid plan: Straight sequence, no loops.
        String[][] validPrereqs = {
                {"Intro to CS", "Data Structures"},
                {"Data Structures", "Algorithms"},
                {"Algorithms", "Operating Systems"}
        };

        // Invalid plan: Contains a loop. You can never take Data Structures because
        // it requires Operating Systems, which requires Algorithms, which requires Data Structures.
        String[][] invalidPrereqs = {
                {"Intro to CS", "Data Structures"},
                {"Data Structures", "Algorithms"},
                {"Algorithms", "Operating Systems"},
                {"Operating Systems", "Data Structures"}
        };

        System.out.println("Can graduate (Valid plan)? " + canGraduate(validPrereqs));
        // Expected Output: true

        System.out.println("Can graduate (Invalid plan)? " + canGraduate(invalidPrereqs));
        // Expected Output: false
    }
}