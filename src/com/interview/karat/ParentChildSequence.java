package com.interview.karat;

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
}