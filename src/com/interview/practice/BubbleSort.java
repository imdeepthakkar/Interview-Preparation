package com.interview.practice;

public class BubbleSort {
    public static void main (String[] args){

        int[] arr = {5, 2, 9, 1, 5, 6};
        System.out.println(java.util.Arrays.toString(arr));
        boolean swapped = false;
        for(int i=0; i<arr.length; i++){

            for(int j=0; j <arr.length-1; j++){
                if(arr[j] > arr[j+1]){
                    int temp = arr[j];
                    arr[j]=arr[j+1];
                    arr[j+1]=temp;
                }
                swapped=true;
            }
            if(!swapped){
                break;
            }
        }

        System.out.println(java.util.Arrays.toString(arr));

    }
}
