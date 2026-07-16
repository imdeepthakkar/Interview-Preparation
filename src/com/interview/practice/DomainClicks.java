package com.interview.practice;

import java.util.*;

public class DomainClicks {

    public static Map<String, Integer> calculateClicks(String[] counts) {
        Map<String, Integer> domainMap = new HashMap<>();

        for (String entry : counts) {
            // Split the input string by the single space
            String[] parts = entry.split(" ");
            int count = Integer.parseInt(parts[0]);
            String domain = parts[1];

            // 1. Add the full, original domain to the map first
            domainMap.put(domain, domainMap.getOrDefault(domain, 0) + count);

            // 2. Scan the string character by character
            for (int i = 0; i < domain.length(); i++) {
                // Every time we hit a period, everything after it is a parent domain
                if (domain.charAt(i) == '.') {
                    String subdomain = domain.substring(i + 1);
                    domainMap.put(subdomain, domainMap.getOrDefault(subdomain, 0) + count);
                }
            }
        }

        return domainMap;
    }

    public static void main(String[] args) {
        String[] testInput = {
                "900 google.mail.com",
                "50 yahoo.com",
                "1 mail.com"
        };

        Map<String, Integer> results = calculateClicks(testInput);

        // Print out the results line by line to match the expected format
        for (Map.Entry<String, Integer> entry : results.entrySet()) {
            System.out.println("\"" + entry.getKey() + "\": " + entry.getValue());
        }
    }
}