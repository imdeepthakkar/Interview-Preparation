package com.interview.practice;

public class MissingFromNNaturalNum {
    public static void main (String[] args){

        int[] arr = {1,2,3,4,6};
        int n = 6;
        System.out.println(java.util.Arrays.toString(arr));

        int actualSum = 0;
        int expectedSum = 0;
        for(int sum: arr){
            actualSum+=sum;
        }
        expectedSum = n * (n+1)/2;



        System.out.println("Mising Number: "+(expectedSum-actualSum));

    }
}
