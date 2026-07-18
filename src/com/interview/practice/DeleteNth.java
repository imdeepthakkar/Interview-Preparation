package com.interview.practice;

import java.util.*;
public class DeleteNth {

    public static int[] deleteNth(int[] elements, int maxOccurrences) {

        List <Integer> result = new ArrayList<>();
        Map<Integer, Integer> map = new HashMap();
        for(int i : elements){
            int currentCount = map.getOrDefault(i,0);
            if(currentCount < maxOccurrences){
                result.add(i);
                map.put(i, currentCount+1);
            }
        }
        int res[] = result.stream().mapToInt(Integer::intValue).peek(System.out::println).toArray();
        return res;

    }

}