package com.interview.practice;

import java.util.Arrays;

public class ArraysMatching {
    public static void main (String[] args){

        int[] arr1 = {5, 2, 9, 1, 5, 6};
        int[] arr2 = {5, 2, 9, 1, 5, 6};
        int[] arr3 = {5, 2, 9, 1, 5, 6,7};


        System.out.println("Array 1: "+java.util.Arrays.toString(arr1));
        System.out.println("Array 2: "+java.util.Arrays.toString(arr2));
        System.out.println("Array 3: "+java.util.Arrays.toString(arr3));

        System.out.println("Array1 matches Array2 : "+ Arrays.equals(arr1,arr2));
        System.out.println("Array1 matches Array3 : "+Arrays.equals(arr1,arr3));

    }
}
