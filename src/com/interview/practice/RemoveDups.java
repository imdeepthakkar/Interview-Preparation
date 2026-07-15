package com.interview.practice;

import java.util.Arrays;

public class RemoveDups {
    public static void main (String[] args){

        int[] arr = {10, 45, 2, 77, 34,77,34};
        System.out.println(java.util.Arrays.toString(arr));
        int [] unique = Arrays.stream(arr).
                distinct().toArray();
        System.out.println(java.util.Arrays.toString(unique));

    }
}
