package com.interview.practice;

import java.util.HashSet;
import java.util.Set;

public class FirstRepeatedNum {
    public static void main (String[] args){

        int[] arr = {11,12,13,13,14,12,16};
        System.out.println(java.util.Arrays.toString(arr));
        int firstRepeat = Integer.MIN_VALUE;
        Set<Integer> set  = new HashSet<Integer>();

        for(int num:arr){
            if(!set.add(num)){
                firstRepeat = num;
                break;
            }
        }



        System.out.println("First Repeated Num: "+firstRepeat);

    }
}
