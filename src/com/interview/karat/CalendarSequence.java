package com.interview.karat;

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
