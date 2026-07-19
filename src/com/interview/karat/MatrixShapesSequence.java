package com.interview.karat;

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
}