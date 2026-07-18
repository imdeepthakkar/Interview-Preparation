package com.interview.practice;
import java.util.*;
import java.util.stream.Collectors;

public class CapitalizeFirstCharOfEachWord {

    public String toJadenCase(String phrase) {
        // TODO put your code below this comment
        StringBuilder sb = new StringBuilder ();
        String words[]= phrase.split(" ");
        List<String> word = Arrays.stream(words)
                .filter(n -> n!=null)
                .map(x -> Character.toUpperCase(x.charAt(0))+x.substring(1))
                .collect(Collectors.toList());

        word.forEach(sb :: append);

        return sb.toString();
    }

}
