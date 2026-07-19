package com.interview.karat;

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
}