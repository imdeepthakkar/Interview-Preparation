package com.interview.practice;

public class FindMaxIntArr {
    public static void main (String[] args){

        int [] arrayInt = {1,2,3,94,5,6};
        System.out.println(java.util.Arrays.toString(arrayInt));
        int max = arrayInt[0];
        for (int maxNum : arrayInt){

            if(maxNum> max){
                max=maxNum;
            }

        }
        System.out.println("Max maxNum: "+max);
    }
}
