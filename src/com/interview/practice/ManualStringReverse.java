package com.interview.practice;

public class ManualStringReverse {
    public static void main (String[] args){

        String originalString = "Software Engineer";
        char charArray[] = originalString.toCharArray();
        int l=0;
        int r = charArray.length-1;
        while(l<r){
            char temp=charArray[l];
            charArray[l]=charArray[r];
            charArray[r]=temp;

            l++;
            r--;
        }
        String strRev = new String(charArray);

        System.out.println("originalString: "+originalString);
        System.out.println("reversed string : "+strRev);

    }
}
