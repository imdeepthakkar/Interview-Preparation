package com.interview.practice;

import java.util.LinkedHashMap;
import java.util.Map;

public class FirstNonRepeatedCharacter {
    public static void main (String[] args){

        String originalString = "Software Engineer";
        System.out.println("originalString: "+originalString);
        Map<Character, Integer> map = new LinkedHashMap<>();

        for(char c: originalString.toCharArray()){
            map.put(c, map.getOrDefault(c,0)+1);
        }
        for(Map.Entry<Character, Integer> entry : map.entrySet()){
            if(entry.getValue()==1){
                System.out.println("First Non Repeating Character: "+entry.getKey());
                break;
            }

        }
    }
}
