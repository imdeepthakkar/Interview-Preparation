<style>
body { 
    font-family: 'Segoe UI', 'Helvetica Neue', Helvetica, Arial, sans-serif; 
    font-size: 20px; 
    line-height: 1.6; 
    color: #333; 
    padding: 20px;
}
h1 { color: #1a365d; text-align: center; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; font-size: 32px; }
h2 { color: #2b6cb0; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px; margin-top: 30px; font-size: 26px; }
p, li { margin-bottom: 12px; }
strong { color: #c53030; }
</style>

# Karat Interview Preparation - Study Priority Guide

Here is the recommended prioritization of the 12 interview questions, ranked from **Hardest to Easiest**, along with the core reasoning for their difficulty. Focus heavily on the "Hard" tier when cramming.

## 🔥 Tier 1: The Hardest (Do these first!)
These require complex data structures, strict algorithmic paradigms (like DP or DFS), or heavy edge-case handling.

1. **`TollSystemSequence`**
   * **Why it's #1:** It's an absolute beast of a problem. You have to parse strings, calculate speeds using math, manage objects, and traverse graphs/routes. It tests multiple fundamental skills all at once.
2. **`DomainClickContinousHistory`**
   * **Why it's #2:** Part 2 requires a **2D Dynamic Programming** table (Longest Common Substring). DP is notoriously difficult to code from scratch under pressure without messing up the matrix indices.
3. **`ContinuousHistorySequence`**
   * **Why it's #3:** Identical DP logic as Domain Clicks, requiring the same rigorous Longest Common Substring table setup to find overlapping paths.
4. **`BasicCalculatorSequence`**
   * **Why it's #4:** Writing a calculator requires rigorous use of a `Stack`. Keeping track of nested parentheses, negative signs, and variable lookups is a massive headache of edge cases.
5. **`MatrixShapesSequence`**
   * **Why it's #5:** Requires 2D matrix traversal using DFS or BFS. While standard, it's very easy to hit `IndexOutOfBounds` exceptions or get caught in an infinite loop if you forget to mark cells as visited.

## 🟡 Tier 2: The Mediums (Core Fundamentals)
These are standard algorithm questions. Once you know the "trick" (like sorting intervals or using a Set), the code flows naturally.

6. **`GridSequence`**
   * **Why:** Similar to Matrix Shapes, but usually slightly more straightforward pathfinding. Still requires solid DFS/BFS skills.
7. **`CalendarSequence`**
   * **Why:** The classic "Merge Intervals" problem. You must remember to sort the array by start times first, which is easy to forget in an interview.
8. **`ParentChildSequence`**
   * **Why:** Graph traversal (finding common ancestors). You need to build an adjacency list and use BFS/DFS, but the graph is usually simple (no cycles).
9. **`BadgeSecuritySequence`**
   * **Why:** The logic is straightforward (sliding window), but parsing custom time formats (HHMM) into minutes and sorting arrays inside HashMaps takes a lot of lines of code.
10. **`WordGameSequence`**
   * **Why:** It's mostly about counting characters using a `HashMap` or `int[26]` array. Handling the wildcard `-` character adds a fun but manageable twist.

## 🟢 Tier 3: The Easiest (Warm-ups)
These strictly test your ability to use basic Java Collections (`HashMap`, `HashSet`, `ArrayList`).

11. **`StudentCoursesSequence`**
    * **Why:** It's purely about finding the intersection between sets. If you know how to use `HashSet.retainAll()`, you can solve this in a few lines of code.
12. **`VotingSystemSequence`**
    * **Why:** Classic "find the max" problem. Just iterating through a list, keeping a tally in a `HashMap`, and keeping track of the highest score.

---
**Study Strategy:** Memorize the **DP matrix setup** for the History sequences, the **Stack rules** for the Calculator, and the **DFS recursive helper** for the Matrix/Grid sequences. If you nail those three, the rest will feel like a breeze!
