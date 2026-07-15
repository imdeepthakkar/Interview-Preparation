package com.interview.practice;

import java.util.HashSet;
import java.util.Set;

public class FindDuplicateIntArr {
    public static void main (String[] args){

        int[] arr = {10, 45, 2, 77, 34,77,34};
        System.out.println(java.util.Arrays.toString(arr));
        Set<Integer> seen =  new HashSet<>();
        Set<Integer> dup =  new HashSet<>();

        for(int num : arr){

            if(!seen.add(num)){
                dup.add(num);
            }

        }

        System.out.println("Duplicate Num: "+dup);

    }
}
