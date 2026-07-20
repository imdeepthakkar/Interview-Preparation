package com.interview.karat;

import java.util.*;

// @Title MatrixShapesSequence
// @Category 2D Grids

public class MatrixShapesSequence {

    // @Part 1
    // @Subtitle Single Rectangle
    // @Analogy Finding a perfectly rectangular lake in a forest. Once you find the top-left, just walk right and down to find the bounds.
    // @Trick Scan grid. First 0 is top-left. Use a `while` loop going Right until you hit a 1, then a `while` loop going Down until you hit a 1.
    // @Time O(R * C)
    // @Space O(1)
    /*
     * PART 1: Find the top-left and bottom-right coordinates of a SINGLE
     * rectangular shape of 0s in a grid of 1s.
     * Output: [rowStart, colStart, rowEnd, colEnd]
     * Time: O(R * C), Space: O(1)
     */

    /*
    int[][] grid1 = {
                {1, 1, 1, 1, 1, 1},
                {1, 0, 0, 0, 1, 1},
                {1, 0, 0, 0, 1, 1},
                {1, 1, 1, 1, 1, 1}
        };
    *?
     */
    public static int[] findSingleBoundingBox(int[][] grid) {

        // STEP 1: Set up tracker variables.
        // We use -1 to mean "we haven't found the start yet."
        int top = -1, left = -1;

        // STEP 2: Scan the grid row by row, top to bottom.
        // The "&& top == -1" is a clever trick: it forces the loop to stop
        // immediately as soon as we find our first '0'.
        for (int r = 0; r < grid.length && top == -1; r++) {

            // Scan each column in the current row, left to right.
            for (int c = 0; c < grid[0].length; c++) {

                // If we find a 0, we have mathematically found the absolute top-left corner.
                if (grid[r][c] == 0) {
                    top = r;
                    left = c;
                    break; // Break out of the inner loop (columns)
                }
            }
        }

        // STEP 3: Safety check.
        // If we scanned the whole forest and never found a '0', top is still -1.
        // We return a dummy array to avoid crashing.
        if (top == -1) {
            return new int[]{-1, -1, -1, -1};
        }

        // STEP 4: Find the right edge.
        // Start at the left corner we just found.
        int right = left;

        // Walk straight to the right (increasing the column index)
        // AS LONG AS we are still inside the grid AND we are still standing on a 0.
        while (right < grid[0].length && grid[top][right] == 0) {
            right++;
        }
        // The while loop stops *after* it steps onto a '1' (land).
        // So, we have to take one step back to get the actual edge of the '0's.
        right--;

        // STEP 5: Find the bottom edge.
        // Start at the top corner we just found.
        int bottom = top;

        // Walk straight down (increasing the row index)
        // AS LONG AS we are still inside the grid AND we are still standing on a 0.
        while (bottom < grid.length && grid[bottom][left] == 0) {
            bottom++;
        }
        // Just like before, take one step back off the land and back into the water.
        bottom--;

        // STEP 6: Package the four corners into an array and return it.
        return new int[]{top, left, bottom, right};
    }

    // @Part 2
    // @Subtitle Multiple Rectangles
    // @Analogy Multiple lakes. When you find one, map it, then 'dry it up' (fill with 1s) so you don't discover it again.
    // @Trick Same as Part 1, but inside the double for-loop. After finding `[top, left, bottom, right]`, loop through those bounds and set `grid[i][j] = 1`.
    // @Time O(R * C)
    // @Space O(1)
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

    // @Part 3
    // @Subtitle Irregular Shapes
    // @Analogy The lakes aren't perfect rectangles anymore. You have to walk the entire shoreline to find the extreme North/South/East/West bounds.
    // @Trick DFS to explore all connected 0s. Pass a `bounds` array reference. Constantly update `Math.min` and `Math.max` for Rows and Cols during DFS.
    // @Time O(R * C)
    // @Space O(R * C)
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

    public static void main(String[] args) {

        // ---------------------------------------------------------
        // PART 1: Single Rectangle
        // ---------------------------------------------------------
        System.out.println("--- PART 1: Single Rectangle ---");
        int[][] grid1 = {
                {1, 1, 1, 1, 1, 1},
                {1, 0, 0, 0, 1, 1},
                {1, 0, 0, 0, 1, 1},
                {1, 1, 1, 1, 1, 1}
        };

        int[] singleBox = findSingleBoundingBox(grid1);
        System.out.println("Single Box Bounds: " + Arrays.toString(singleBox));
        // Expected Output: [1, 1, 2, 3]


        // ---------------------------------------------------------
        // PART 2: Multiple Rectangles
        // ---------------------------------------------------------
        System.out.println("\n--- PART 2: Multiple Rectangles ---");
        int[][] grid2 = {
                {1, 1, 1, 1, 1, 1, 1},
                {1, 0, 0, 1, 1, 0, 1}, // Rectangle 1 (left) and Rectangle 2 (right)
                {1, 0, 0, 1, 1, 1, 1},
                {1, 1, 1, 1, 1, 1, 1},
                {1, 1, 1, 0, 0, 0, 1}  // Rectangle 3 (bottom)
        };

        List<int[]> multiBoxes = findMultipleBoundingBoxes(grid2);
        for (int i = 0; i < multiBoxes.size(); i++) {
            System.out.println("Box " + (i + 1) + ": " + Arrays.toString(multiBoxes.get(i)));
        }
        // Expected Output:
        // Box 1: [1, 1, 2, 2]
        // Box 2: [1, 5, 1, 5]
        // Box 3: [4, 3, 4, 5]


        // ---------------------------------------------------------
        // PART 3: Irregular Shapes (DFS)
        // ---------------------------------------------------------
        System.out.println("\n--- PART 3: Irregular Shapes ---");
        int[][] grid3 = {
                {1, 1, 1, 1, 1, 1},
                {1, 0, 1, 1, 1, 1}, // Start of irregular shape
                {1, 0, 0, 0, 1, 1}, // Shape bends right
                {1, 1, 1, 0, 1, 1}, // Shape drops down
                {1, 1, 1, 1, 1, 0}  // Isolated single-cell shape
        };

        List<int[]> irregularBoxes = findIrregularBoundingBoxes(grid3);
        for (int i = 0; i < irregularBoxes.size(); i++) {
            System.out.println("Irregular Box " + (i + 1) + ": " + Arrays.toString(irregularBoxes.get(i)));
        }
        // Expected Output:
        // Irregular Box 1: [1, 1, 3, 3] (The bounds of the snake-like shape)
        // Irregular Box 2: [4, 5, 4, 5] (The isolated zero at the bottom right)
    }
}