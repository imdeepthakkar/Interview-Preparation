package com.interview.practice;

public class FindMinIntArr {
    public static void main (String[] args){

        int [] arrayInt = {1,2,3,94,5,6,0};
        System.out.println(java.util.Arrays.toString(arrayInt));
        int min = arrayInt[0];
        for (int minNum : arrayInt){

            if(minNum < min){
                min=minNum;
            }

        }
        System.out.println("Min minNum: "+min);
    }
}
