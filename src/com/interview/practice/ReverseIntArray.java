package com.interview.practice;

public class ReverseIntArray {
    public static void main (String[] args){

        int [] arrayInt = {1,2,3,4,5,6};
        System.out.println(java.util.Arrays.toString(arrayInt));
        int l=0; int r=arrayInt.length-1;
        while(l<r){
            int t= arrayInt[l];
            arrayInt[l]=arrayInt[r];
            arrayInt[r] = t;
            l++;r--;
        }
        System.out.println(java.util.Arrays.toString(arrayInt));
    }
}
