package com.interview.practice;

public class FindSecondMax {
    public static void main (String[] args){

        int[] arr = {10, 45, 2, 77, 34,77};
        System.out.println(java.util.Arrays.toString(arr));
        int first = Integer.MIN_VALUE;
        int second = Integer.MIN_VALUE;
        for (int num : arr){
            if(num>first){
                second = first;
                first = num;
            }
            else if(num > second && num!=first){
                second = num;
            }

        }
        System.out.println("First Num: "+first);
        System.out.println("Second Num: "+second);

    }
}
