package com.interview.practice;

import java.util.LinkedHashMap;
import java.util.Map;

public class NumCount {
    public static void main (String[] args){

        int[] arr = {10, 45, 2, 77, 34,77,34};
        System.out.println(java.util.Arrays.toString(arr));

        Map<Integer, Integer> map = new LinkedHashMap();

        for (int num : arr){
            map.put(num, map.getOrDefault(num,0)+1);
        }

        System.out.println(map);

    }
}
