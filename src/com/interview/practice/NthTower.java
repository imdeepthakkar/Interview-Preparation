package com.interview.practice;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class NthTower {
    public static void main(String[] args) {
            int nFloors = 9;
            String[] tower = new String[nFloors];
            for(int i = 0; i < nFloors ; i++) {
                int numStar = 2 * i + 1;
                int numSpaces = nFloors - i - 1;

                String spaces = " ".repeat(numSpaces);
                String stars = "*".repeat(numStar);

                tower[i] = spaces + stars + spaces;
                System.out.println(tower[i]);
            }
        }
    }
