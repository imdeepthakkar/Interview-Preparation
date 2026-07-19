<style>
body { 
    font-family: 'Segoe UI', 'Helvetica Neue', Helvetica, Arial, sans-serif; 
    font-size: 15px; 
    line-height: 1.6; 
    color: #333; 
}
h1 { color: #1a365d; text-align: center; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; font-size: 28px; }
h2 { color: #2b6cb0; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px; margin-top: 30px; font-size: 22px; }
p { margin-bottom: 15px; }
strong { color: #c53030; }
li { margin-bottom: 8px; }
</style>

# Top 50 Rapid-Fire Java Interview Questions

## Core Concepts & OOP

**Q1: What is the difference between JDK, JRE, and JVM?**
* **JVM (Java Virtual Machine):** Executes compiled Java bytecode.
* **JRE (Java Runtime Environment):** JVM + core libraries needed to run apps.
* **JDK (Java Development Kit):** JRE + development tools (compiler, debugger).

**Q2: Difference between Overloading and Overriding?**
* **Overloading:** Same method name, different parameters (Compile-time polymorphism).
* **Overriding:** Same method name and parameters in a child class (Runtime polymorphism).

**Q3: Abstract Class vs Interface (Java 8+)?**
* **Abstract Class:** Can have constructors, instance variables. Class can only extend ONE.
* **Interface:** No constructors/instance variables. Supports `default` methods. Class can implement MULTIPLE.

**Q4: String vs StringBuilder vs StringBuffer?**
* **String:** Immutable (cannot be changed).
* **StringBuilder:** Mutable and not thread-safe (fast).
* **StringBuffer:** Mutable and thread-safe (slow due to synchronization).

**Q5: What is Polymorphism?**
* The ability of an object to take on many forms. E.g., a parent reference variable can point to a child object.

**Q6: What is Encapsulation?**
* Hiding the internal state of an object and requiring all interaction to be performed through an object's methods (getters/setters).

**Q7: Does Java support multiple inheritance?**
* Not through classes (to prevent the Diamond Problem). But it is supported through interfaces.

**Q8: Can we override a static method?**
* **No.** Static methods belong to the class, not the instance. If you declare a matching static method in a child class, it *hides* the parent's method, but doesn't override it.

**Q9: What is a constructor? Can it be final?**
* A special method used to initialize objects. It **cannot** be final, abstract, or static.

**Q10: `==` vs `equals()`?**
* `==` checks for reference equality (do they point to the exact same object in memory?).
* `equals()` checks for value equality (do they contain the same data logically?).

## Memory, JVM, & Execution

**Q11: Does Java pass by value or pass by reference?**
* **Pass by value strictly.** For objects, it passes the *value of the reference* (the memory address). 

**Q12: Stack vs Heap memory?**
* **Stack:** Stores local variables and method calls. Fast, small, automatically deallocated.
* **Heap:** Stores Objects and JRE classes. Garbage Collected, larger, slower.

**Q13: What is Garbage Collection? Can you force it?**
* Automatic memory management that destroys unreachable objects. You cannot force it, only suggest it with `System.gc()`.

**Q14: What is a ClassLoader?**
* A subsystem of the JVM used to load class files into RAM dynamically at runtime.

**Q15: Difference between `this` and `super`?**
* `this`: Refers to the current class instance.
* `super`: Refers to the immediate parent class instance.

**Q16: What is a memory leak in Java?**
* When objects are no longer needed but are still referenced by the application, preventing the Garbage Collector from clearing them.

**Q17: What does the `final` keyword do?**
* Variable: Cannot be reassigned.
* Method: Cannot be overridden.
* Class: Cannot be inherited (extended).

**Q18: OutOfMemoryError vs StackOverflowError?**
* **OutOfMemoryError:** Heap is full (too many objects).
* **StackOverflowError:** Stack is full (usually infinite recursion).

## Collections Framework

**Q19: HashMap vs HashTable?**
* **HashMap:** Not thread-safe, allows 1 null key. Fast.
* **HashTable:** Thread-safe, no null keys allowed. Slow.

**Q20: ArrayList vs LinkedList?**
* **ArrayList:** Dynamic array. Fast random access `get()`, slow middle insertions.
* **LinkedList:** Doubly linked list. Fast insertions/deletions, slow random access.

**Q21: Set vs List?**
* **Set:** Cannot contain duplicates. No guaranteed order (usually).
* **List:** Can contain duplicates. Maintains insertion order.

**Q22: HashMap vs ConcurrentHashMap?**
* **ConcurrentHashMap** is thread-safe but much faster than HashTable because it only locks a specific bucket/segment during updates, not the whole map.

**Q23: How does a HashMap work internally?**
* Uses an array of LinkedLists (or Trees in Java 8+). It hashes the key to find the array index (bucket). If multiple keys hash to the same bucket, they are chained.

**Q24: Fail-fast vs Fail-safe iterators?**
* **Fail-fast:** Throws `ConcurrentModificationException` if a collection is modified while iterating (e.g., `ArrayList`).
* **Fail-safe:** Clones the collection, so modifications don't crash the iterator (e.g., `ConcurrentHashMap`).

**Q25: Comparable vs Comparator?**
* **Comparable:** Defines default sorting (`compareTo`). Only 1 sequence possible.
* **Comparator:** Defines custom sorting (`compare`). Can create multiple sorting sequences.

**Q26: HashSet vs TreeSet?**
* **HashSet:** Backed by HashMap. Unordered. O(1) time.
* **TreeSet:** Backed by TreeMap. Sorted in ascending order. O(log N) time.

**Q27: Iterator vs ListIterator?**
* `Iterator` goes in one direction. `ListIterator` can go forward and backward and can be used to add/modify elements during traversal.

**Q28: Array vs ArrayList?**
* Array is fixed-size and can hold primitives. ArrayList is dynamically sized and can only hold Objects (wrapper classes).

## Multithreading & Concurrency

**Q29: Runnable vs Thread?**
* **Runnable:** Better. Allows class to extend another class and separates task from execution.
* **Thread:** Class cannot extend anything else.

**Q30: `wait()` vs `sleep()`?**
* **wait():** Called on Object. Releases the lock. Woken by `notify()`.
* **sleep():** Called on Thread. Pauses but *keeps* the lock.

**Q31: What is the `volatile` keyword?**
* Ensures a variable is read from main memory, not from CPU cache, giving all threads the most up-to-date value.

**Q32: What is synchronization?**
* Ensuring that only one thread can execute a critical block of code or access a shared resource at a time.

**Q33: Callable vs Runnable?**
* `Runnable`'s `run()` method returns void and cannot throw checked exceptions.
* `Callable`'s `call()` method returns a result and can throw checked exceptions.

**Q34: Thread pool vs manual threads?**
* Thread pools reuse existing threads, reducing the overhead of creating and destroying threads constantly.

**Q35: What is a daemon thread?**
* A low-priority background thread (like Garbage Collector). The JVM exits when only daemon threads remain.

**Q36: Deadlock and how to prevent it?**
* Two threads block each other permanently waiting for locks. Prevent by always acquiring multiple locks in the exact same order across all threads.

## Exceptions & Miscellaneous

**Q37: Checked vs Unchecked Exceptions?**
* **Checked:** Checked at compile-time (e.g., `IOException`). Must be caught or thrown.
* **Unchecked:** Runtime errors (e.g., `NullPointerException`). Extend `RuntimeException`.

**Q38: `throw` vs `throws`?**
* `throw`: Used to actually trigger an exception inside a method.
* `throws`: Used in the method signature to declare that the method *might* throw an exception.

**Q39: Can we have `try` without `catch`?**
* Yes, but only if it is followed by a `finally` block or is a "try-with-resources" block.

**Q40: What happens if an exception is thrown in a `finally` block?**
* The original exception might be swallowed/lost if the `finally` block exception isn't caught.

**Q41: `finally` vs `finalize()`?**
* **finally:** Block of code that executes after try/catch regardless of outcome.
* **finalize():** Deprecated method called before Garbage Collection.

## Java 8+ Features & Modern Java

**Q42: What are Lambda Expressions?**
* Short blocks of code that take parameters and return a value, providing a clear way to represent a functional interface.

**Q43: What is the Stream API?**
* Used to process collections of objects in a functional style (map, filter, reduce).

**Q44: Map vs flatMap in Streams?**
* `map`: Transforms each element into another object (1-to-1).
* `flatMap`: Transforms each element into a stream of objects and flattens them into a single stream (1-to-many).

**Q45: `Optional` class in Java 8?**
* A container object used to contain not-null objects, cleanly handling the `NullPointerException` problem.

**Q46: Default methods in interfaces?**
* Allow you to add new methods to interfaces with a default implementation without breaking classes that already implement the interface.

**Q47: What is Dependency Injection?**
* Passing dependencies (objects) into a class rather than the class instantiating them itself. Makes testing easier.

**Q48: What are Annotations?**
* Metadata added to Java code (e.g., `@Override`) that can be processed at compile-time or runtime.

**Q49: Transient vs Volatile variables?**
* `transient`: The variable will NOT be serialized.
* `volatile`: The variable is visible to all threads (bypasses CPU cache).

**Q50: What is serialization?**
* Converting the state of an object into a byte stream so it can be saved to a file or sent over a network.
