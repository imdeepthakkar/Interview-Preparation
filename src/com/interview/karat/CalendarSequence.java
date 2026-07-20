package com.interview.karat;

import java.util.*;

// @Title CalendarSequence
// @Category Intervals

public class CalendarSequence {

    public static void main(String[] args) {
        // --- PART 1: Can Schedule? ---
        System.out.println("--- PART 1: Can Schedule? ---");
        // Existing meetings represented as [start, end]
        int[][] existingMeetings = { {1300, 1500}, {930, 1200}, {830, 845} };

        int[] newMeeting1 = {845, 900}; // Fits perfectly in the gap
        int[] newMeeting2 = {1430, 1450}; // Overlaps with 1300-1500

        System.out.println("Can schedule [845, 900]? " + canSchedule(existingMeetings, newMeeting1));
        // Expected: true
        System.out.println("Can schedule [1430, 1450]? " + canSchedule(existingMeetings, newMeeting2));
        // Expected: false

        // --- PART 2: Merge Overlaps ---
        System.out.println("\n--- PART 2: Merge Overlaps ---");
        // A messy list of meetings out of order and overlapping
        int[][] rawMeetings = { {15, 18}, {1, 3}, {2, 6}, {8, 10}, {17, 20} };

        int[][] merged = mergeMeetings(rawMeetings);
        System.out.println("Merged Meetings: " + Arrays.deepToString(merged));
        // Expected: [[1, 6], [8, 10], [15, 20]]

        // --- PART 3: Find Free Time ---
        System.out.println("\n--- PART 3: Find Free Time ---");
        // We will use the merged output from Part 2 to find our gaps
        int dayStart = 0; // The start of the day (e.g., 0 hours)
        int dayEnd = 24;  // The end of the day (e.g., 24 hours)

        List<int[]> freeTime = findFreeTime(merged, dayStart, dayEnd);

        System.out.print("Free Time Blocks: ");
        for (int[] block : freeTime) {
            System.out.print(Arrays.toString(block) + " ");
        }
        System.out.println();
        // Expected: [0, 1] [6, 8] [10, 15] [20, 24]
    }

    // @Part 1
    // @Subtitle Can Schedule?
    // @Analogy Checking if a new meeting overlaps with any existing meetings.
    // @Trick Two intervals overlap if `newStart < meeting.end AND newEnd > meeting.start`.
    // @Time O(N)
    // @Space O(1)
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

        // @Part 2
    // @Subtitle Merge Overlaps
    // @Analogy Painting time slots. If two paint strokes touch or overlap, they become one big stroke.
    // @Trick Sort intervals by Start Time! Then, compare `nextStart <= currEnd`. If so, `currEnd = Math.max(currEnd, nextEnd)`. Else, add to list.
    // @Time O(N log N)
    // @Space O(N)
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

        // @Part 3
    // @Subtitle Find Free Time
    // @Analogy Walking from start of the day to the end. Any gap between your pointer and the start of the next meeting is free time.
    // @Trick Use merged meetings from Part 2. `pointer = dayStart`. If `pointer < meeting.start`, add `[pointer, meeting.start]` as free time. Move pointer to `Math.max(pointer, meeting.end)`.
    // @Time O(N)
    // @Space O(N)
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
