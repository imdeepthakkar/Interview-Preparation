package com.interview.karat;

import java.util.*;

// @Title ParentChildSequence
// @Category Graph Theory

public class ParentChildSequence {

        // @Part 1
    // @Subtitle 0 or 1 Parents
    // @Analogy Finding people who are roots of the family tree (0 parents) or only have a single known parent.
    // @Trick Calculate In-Degree (number of incoming edges). Create a Map of `Node -> Count`. If count is 0 or 1, add to respective lists.
    // @Time O(E)
    // @Space O(V)
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

        // @Part 2
    // @Subtitle Common Ancestor
    // @Analogy Do two people share a great-grandparent? Trace both family lines all the way up and see if they intersect.
    // @Trick Build Adjacency List going UP (Child -> List of Parents). Write a recursive helper to get a `Set` of ALL ancestors. Intersect the two sets.
    // @Time O(V + E)
    // @Space O(V)
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

        // @Part 3
    // @Subtitle Earliest Ancestor
    // @Analogy Finding the oldest known ancestor in the family tree. Just keep going up until you can't.
    // @Trick Use BFS queue! Start at the node, add its parents to queue, pop, add their parents. The very LAST node popped from the queue is the earliest ancestor.
    // @Time O(V + E)
    // @Space O(V)
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