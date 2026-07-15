package com.interview.practice;

import java.util.Arrays;

public class TwoSum {
    public static void main (String[] args){

        int[] arr = {2, 4, 6, 8, 10};
        int target=8;
        System.out.println("indexs are:" + Arrays.toString(twoSum(arr,target)));

    }
    static int[] twoSum(int arr[], int target){

        for(int i=0;i<=arr.length;i++){
            for(int j=i+1; j<=arr.length;j++){
                if(arr[i]+arr[j]==target){
                    return new int[]{i,j};
                }

            }
        }

        return null;
    }
}
