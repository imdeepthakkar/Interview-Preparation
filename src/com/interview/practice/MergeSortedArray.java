package com.interview.practice;

import java.util.Arrays;

public class MergeSortedArray {

    public static void main(String[] args) {

        //int arr1[] = {1, 2, 3, 0, 0, 0};
        //int arr2[] = {2,5,6};
        int[] arr1 = {1, 3, 5, 7, 0, 0, 0, 0, 0};
        int[] arr2 = {2, 4, 6, 8, 10};
        int n = 4;
        int m = 5;
        merge(arr1, n, arr2, m);
        System.out.println("Merged Array: " + Arrays.toString(arr1));
    }

    static void merge(int arr1[], int n, int arr2[], int m) {

        int i = n - 1;
        int j = m - 1;
        int k = n + m - 1;

        while (j >= 0) {

            if (i >= 0 && arr1[i] > arr2[j]) {
                arr1[k] = arr1[i];
                i--;
            } else {
                arr1[k] = arr2[j];
                j--;
            }
            k--;
        }
    }
}
