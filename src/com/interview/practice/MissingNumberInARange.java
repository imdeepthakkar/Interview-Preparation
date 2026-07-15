package com.interview.practice;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

public class MissingNumberInARange {
    public static void main (String[] args){

        int[] arr = {11,12,13,14,16};
        int start = 11;
        int end = 17;
        System.out.println(java.util.Arrays.toString(arr));

        Set<Integer> set  = Arrays.stream(arr).
                boxed().
                collect(Collectors.toSet());

        List<Integer> res = new ArrayList();

        for(int i=start; i<=end; i++){
            if(!set.contains(i)){
                res.add(i);
            }
        }



        System.out.println("Mising Numbers: "+res);

    }
}
