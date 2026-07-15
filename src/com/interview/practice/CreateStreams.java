package com.interview.practice;

import java.util.Arrays;
import java.util.List;

import java.util.stream.Stream;

import static java.lang.Math.random;

public class CreateStreams {
    public static void main(String[] args) {
        //List to Stream
        List <String> names = Arrays.asList("alice","bob");
        Stream<String> stream1 = names.stream();
        //Arrays to Stream
        String[] arr = {"Java", "Python", "C++"};
        Stream<String> stream2 = Arrays.stream(arr);
        //Stream of
        Stream <Integer> stream3 = Stream.of(1,3,4,6,7,2);
        //Stream .generate()
        Stream<Double> stream4  = Stream.generate(Math:: random).limit(5);

    }
}
