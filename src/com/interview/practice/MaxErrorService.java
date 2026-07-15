package com.interview.practice;

import java.util.Arrays;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

public class MaxErrorService {
    public static void main (String[] args){
        String[] logs = {
                "2023-10-01 10:00, ERROR, PaymentService",
                "2023-10-01 10:05, INFO, UserService",
                "2023-10-01 10:10, ERROR, PaymentService",
                "2023-10-01 10:15, ERROR, AuthModule",
                "2023-10-01 10:20, WARNING, PaymentService"
        };
        Arrays.stream(logs).
                filter(s -> s.contains("ERROR")).
                map(s -> s.split(", ")[2]).
                collect(Collectors.groupingBy(Function.identity(), Collectors.counting())).
                entrySet().stream().
                max(Map.Entry.comparingByValue()).
                ifPresent(entry -> System.out.println(entry.getKey()));
        ;
     }
}
