package com.interview.practice;

import java.util.LinkedHashMap;
import java.util.Map;

public class FirstNonRepeatedNumber {
    public static void main (String[] args){

        int[] arr = {5, 3, 4, 3, 5, 6};
        System.out.println(java.util.Arrays.toString(arr));
        int firstNonRepeat = Integer.MIN_VALUE;
        Map<Integer, Integer> map = new LinkedHashMap<>();
        for(int num:arr){
            map.put(num, map.getOrDefault(num, 0)+1);

        }


        for(Map.Entry<Integer, Integer> e: map.entrySet()){
            if(e.getValue()==1){
                firstNonRepeat = e.getKey();
                break;
            }
        }



        System.out.println("First No Repeated Num: "+firstNonRepeat);

    }
}
