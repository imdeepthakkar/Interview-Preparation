package com.interview.karat;

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
}