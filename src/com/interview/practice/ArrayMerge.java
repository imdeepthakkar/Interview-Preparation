package com.interview.practice;

public class ArrayMerge {
    public static void main (String[] args){

        int[] arr1 = {1, 2, 3, 4, 5, 6};
        int[] arr2 = {5, 2, 9, 1, 5, 6};
        int[] arr3 = new int[arr1.length+arr2.length];


        System.out.println("Array 1: "+java.util.Arrays.toString(arr1));
        System.out.println("Array 2: "+java.util.Arrays.toString(arr2));
        System.arraycopy(arr1,0, arr3, 0, arr1.length);
        System.out.println("Array after 1st merge: "+java.util.Arrays.toString(arr3));
        System.arraycopy(arr2,0, arr3, arr1.length,arr2.length);
        System.out.println("Array after 2nd merge: "+java.util.Arrays.toString(arr3));


    }
}
