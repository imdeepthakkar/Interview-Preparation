package com.interview.practice;
import java.util.Objects;

public class FindThirdMax {
    public static void main (String[] args){

        int[] arr = {10, 45, 2, 77, 34,77};
        System.out.println(java.util.Arrays.toString(arr));
        Integer first = null;
        Integer second = null;
        Integer third = null;

        for (int num : arr){
            if(Objects.equals(first,num) || Objects.equals(second,num) || Objects.equals(third,num)){
                continue;
            }
            else if(first == null || num > first ){
                third =second;
                second = first;
                first = num;
            }
            else if(second == null || num > second){
                third = second;
                second = num;
            }
            else if(third == null ||num > third){
                third = num;
            }
        }
        if (third == null){
            System.out.println("Array doesn't have 3 distinct elements");
        }
        System.out.println("First Num: "+first);
        System.out.println("Second Num: "+second);
        System.out.println("Third Num: "+third);

    }
}
