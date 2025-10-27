"use client";

import { useState, useRef, useEffect } from 'react';
import {
  Play, CheckCircle, ArrowLeft, Code2, Github, Globe, BookOpen, Search, Filter,
  BarChart3, BookOpen as Book, Trophy, Zap, Terminal, Layers, Menu, X, Monitor, ArrowRight
} from 'lucide-react';
import Confetti from 'react-confetti';
import { motion, AnimatePresence } from 'framer-motion';

// Import required shadcn UI components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

// Types
interface Problem {
  id: number;
  title: string;
  description: string;
  example: string;
  starterCode: string;
  expectedOutputs: string[];
}

interface Topic {
  id: number;
  title: string;
  description: string;
  videoUrl: string;
  language: string;
  difficulty: string;
  problems: Problem[];
}

// Languages and Skill Levels
const programmingLanguages = [
  { id: "javascript", name: "JavaScript", icon: <img src="https://skillicons.dev/icons?i=js" alt="JavaScript" className="w-8 h-8" /> },
  { id: "python", name: "Python", icon: <img src="https://skillicons.dev/icons?i=python" alt="Python" className="w-8 h-8" /> },
  { id: "java", name: "Java", icon: <img src="https://skillicons.dev/icons?i=java" alt="Java" className="w-8 h-8" /> },
  { id: "csharp", name: "C#", icon: <img src="https://skillicons.dev/icons?i=cs" alt="C#" className="w-8 h-8" /> },
  { id: "cpp", name: "C++", icon: <img src="https://skillicons.dev/icons?i=cpp" alt="C++" className="w-8 h-8" /> },
  { id: "rust", name: "Rust", icon: <img src="https://skillicons.dev/icons?i=rust" alt="Rust" className="w-8 h-8" /> },
  { id: "typescript", name: "TypeScript", icon: <img src="https://skillicons.dev/icons?i=ts" alt="TypeScript" className="w-8 h-8" /> },
  { id: "sql", name: "SQL", icon: <img src="https://skillicons.dev/icons?i=mysql" alt="SQL" className="w-8 h-8" /> },
  { id: "go", name: "Go", icon: <img src="https://skillicons.dev/icons?i=go" alt="Go" className="w-8 h-8" /> }
];

const skillLevels = [
  { id: "beginner", name: "Beginner", description: "New to programming or the language" },
  { id: "intermediate", name: "Intermediate", description: "Familiar with basic concepts" },
  { id: "advanced", name: "Advanced", description: "Experienced developer" }
];

// Topics Data
const topics: Topic[] = [
  {
    id: 1,
    title: "JavaScript Array Methods",
    description: "Learn and practice essential array manipulation techniques",
    videoUrl: "https://www.youtube.com/embed/rRgD1yVwIvE",
    language: "javascript",
    difficulty: "beginner",
    problems: [
      {
        id: 1,
        title: "Filter Even Numbers",
        description: "Create a function that takes an array of numbers and returns a new array containing only the even numbers.",
        example: `Input: [1, 2, 3, 4, 5, 6]
Output: [2, 4, 6]`,
        starterCode: `function filterEvenNumbers(numbers) {
  // Your code here
}

// Test cases
console.log(filterEvenNumbers([1, 2, 3, 4, 5, 6]));
console.log(filterEvenNumbers([1, 3, 5, 7, 9]));`,
        expectedOutputs: ["[2,4,6]", "[]"]
      },
      {
        id: 2,
        title: "Calculate Array Average",
        description: "Write a function that calculates the average of all numbers in an array.",
        example: `Input: [1, 2, 3, 4, 5]
Output: 3`,
        starterCode: `function calculateAverage(numbers) {
  // Your code here
}

// Test cases
console.log(calculateAverage([1, 2, 3, 4, 5]));
console.log(calculateAverage([10, 20, 30, 40, 50]));`,
        expectedOutputs: ["3", "30"]
      },
      {
        id: 3,
        title: "Find Duplicate Elements",
        description: "Create a function that finds all duplicate elements in an array.",
        example: `Input: [1, 2, 2, 3, 4, 4, 5]
Output: [2, 4]`,
        starterCode: `function findDuplicates(array) {
  // Your code here
}

// Test cases
console.log(findDuplicates([1, 2, 2, 3, 4, 4, 5]));
console.log(findDuplicates([1, 1, 1, 2, 2, 3]));`,
        expectedOutputs: ["[2,4]", "[1,2]"]
      },
    ]
  },
  {
    id: 2,
    title: "JavaScript Objects",
    description: "Master JavaScript object manipulation and methods",
    videoUrl: "https://www.youtube.com/embed/3PHXvlpOkf4",
    language: "javascript",
    difficulty: "intermediate",
    problems: [
      {
        id: 4,
        title: "Object Property Counter",
        description: "Write a function that counts the number of properties in an object.",
        example: `Input: { name: 'John', age: 30, city: 'New York' }
Output: 3`,
        starterCode: `function countProperties(obj) {
  // Your code here
}

// Test cases
console.log(countProperties({ name: 'John', age: 30, city: 'New York' }));
console.log(countProperties({}));`,
        expectedOutputs: ["3", "0"]
      },
      {
        id: 5,
        title: "Object Value Sum",
        description: "Create a function that sums all numeric values in an object.",
        example: `Input: { a: 1, b: 2, c: 3 }
Output: 6`,
        starterCode: `function sumObjectValues(obj) {
  // Your code here
}

// Test cases
console.log(sumObjectValues({ a: 1, b: 2, c: 3 }));
console.log(sumObjectValues({ x: 10, y: 20, z: 30 }));`,
        expectedOutputs: ["6", "60"]
      },
      {
        id: 6,
        title: "Object Key Filter",
        description: "Write a function that filters object keys based on a condition.",
        example: `Input: { name: 'John', age: 30, city: 'New York', country: 'USA' }
Output: { name: 'John', city: 'New York' }`,
        starterCode: `function filterObjectKeys(obj) {
  // Your code here
}

// Test cases
console.log(filterObjectKeys({ name: 'John', age: 30, city: 'New York', country: 'USA' }));
console.log(filterObjectKeys({ a: 1, b: 2, c: 3, d: 4 }));`,
        expectedOutputs: ['{"name":"John","city":"New York"}', '{"a":1,"c":3}']
      }
    ]
  },
  {
    id: 3,
    title: "Linked Lists",
    description: "Master linked list operations and implementations",
    videoUrl: "https://www.youtube.com/embed/R9PTBwOzceo",
    language: "javascript",
    difficulty: "advanced",
    problems: [
      {
        id: 7,
        title: "Reverse a Linked List",
        description: "Write a function that reverses a singly linked list.",
        example: `Input: 1 -> 2 -> 3 -> 4 -> 5
Output: 5 -> 4 -> 3 -> 2 -> 1`,
        starterCode: `class ListNode {
  constructor(val = 0, next = null) {
    this.val = val;
    this.next = next;
  }
}

function reverseList(head) {
  // Your code here
}

// Test cases
const list = new ListNode(1);
list.next = new ListNode(2);
list.next.next = new ListNode(3);
console.log(reverseList(list));`,
        expectedOutputs: ["ListNode { val: 3, next: ListNode { val: 2, next: ListNode { val: 1, next: null } } }"]
      },
      {
        id: 8,
        title: "Detect Cycle",
        description: "Detect if a linked list has a cycle in it.",
        example: `Input: 1 -> 2 -> 3 -> 4 -> 2 (points back to 2)
Output: true`,
        starterCode: `function hasCycle(head) {
  // Your code here
}

// Test cases
const list = new ListNode(1);
list.next = new ListNode(2);
list.next.next = list.next; // Creates cycle
console.log(hasCycle(list));`,
        expectedOutputs: ["true"]
      },
      {
        id: 9,
        title: "Middle Node",
        description: "Find the middle node of a linked list.",
        example: `Input: 1 -> 2 -> 3 -> 4 -> 5
Output: 3`,
        starterCode: `function findMiddle(head) {
  // Your code here
}

// Test cases
const list = new ListNode(1);
list.next = new ListNode(2);
list.next.next = new ListNode(3);
console.log(findMiddle(list));`,
        expectedOutputs: ["ListNode { val: 2, next: ListNode { val: 3, next: null } }"]
      }
    ]
  },
  {
    id: 4,
    title: "Binary Trees",
    description: "Learn tree traversal and manipulation techniques",
    videoUrl: "https://www.youtube.com/embed/fAAZixBzIAI",
    language: "javascript",
    difficulty: "beginner",
    problems: [
      {
        id: 10,
        title: "Tree Height",
        description: "Calculate the maximum height of a binary tree.",
        example: `Input:     1
           /  \\
          2    3
         / \\
        4   5
Output: 3`,
        starterCode: `class TreeNode {
  constructor(val = 0, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

function treeHeight(root) {
  // Your code here
}

// Test cases
const tree = new TreeNode(1);
tree.left = new TreeNode(2);
tree.right = new TreeNode(3);
console.log(treeHeight(tree));`,
        expectedOutputs: ["2"]
      },
      {
        id: 11,
        title: "Level Order Traversal",
        description: "Implement level-order traversal of a binary tree.",
        example: `Input:     1
           /  \\
          2    3
Output: [1, 2, 3]`,
        starterCode: `function levelOrder(root) {
  // Your code here
}

// Test cases
const tree = new TreeNode(1);
tree.left = new TreeNode(2);
tree.right = new TreeNode(3);
console.log(levelOrder(tree));`,
        expectedOutputs: ["[1,2,3]"]
      },
      {
        id: 12,
        title: "Is Balanced",
        description: "Check if a binary tree is height-balanced.",
        example: `Input:     1
           /  \\
          2    3
         / \\
        4   5
Output: true`,
        starterCode: `function isBalanced(root) {
  // Your code here
}

// Test cases
const tree = new TreeNode(1);
tree.left = new TreeNode(2);
tree.right = new TreeNode(3);
console.log(isBalanced(tree));`,
        expectedOutputs: ["true"]
      }
    ]
  },
  {
    id: 5,
    title: "Stack & Queue",
    description: "Master stack and queue data structures",
    videoUrl: "https://www.youtube.com/embed/wjI1WNcIntg",
    language: "javascript",
    difficulty: "intermediate",
    problems: [
      {
        id: 13,
        title: "Valid Parentheses",
        description: "Check if a string of parentheses is valid.",
        example: `Input: "({[]})"
Output: true`,
        starterCode: `function isValid(s) {
  // Your code here
}

// Test cases
console.log(isValid("({[]})"));
console.log(isValid("({[}])"));`,
        expectedOutputs: ["true", "false"]
      },
      {
        id: 14,
        title: "Queue using Stacks",
        description: "Implement a queue using only stacks.",
        example: `Operations: push(1), push(2), peek(), pop(), empty()
Output: 1, false`,
        starterCode: `class MyQueue {
  constructor() {
    // Initialize your data structure here
  }
  
  push(x) {
    // Your code here
  }
  
  pop() {
    // Your code here
  }
  
  peek() {
    // Your code here
  }
  
  empty() {
    // Your code here
  }
}`,
        expectedOutputs: ["1", "false"]
      },
      {
        id: 15,
        title: "Min Stack",
        description: "Design a stack that supports push, pop, top, and retrieving the minimum element.",
        example: `Operations: push(-2), push(0), push(-3), getMin(), pop(), top(), getMin()
Output: -3, 0, -2`,
        starterCode: `class MinStack {
  constructor() {
    // Initialize your data structure here
  }
  
  push(val) {
    // Your code here
  }
  
  pop() {
    // Your code here
  }
  
  top() {
    // Your code here
  }
  
  getMin() {
    // Your code here
  }
}`,
        expectedOutputs: ["-3", "0", "-2"]
      }
    ]
  },
  {
    id: 6,
    title: "Graph Algorithms",
    description: "Learn fundamental graph traversal and shortest path algorithms",
    videoUrl: "https://www.youtube.com/embed/tWVWeAqZ0WU",
    language: "javascript",
    difficulty: "advanced",
    problems: [
      {
        id: 16,
        title: "BFS Implementation",
        description: "Implement Breadth-First Search for a graph.",
        example: `Input: Graph with edges [[0,1], [0,2], [1,2], [2,3]]
Output: [0, 1, 2, 3]`,
        starterCode: `function bfs(graph, start) {
  // Your code here
}

// Test cases
const graph = [[1,2], [0,2], [0,1,3], [2]];
console.log(bfs(graph, 0));`,
        expectedOutputs: ["[0,1,2,3]"]
      },
      {
        id: 17,
        title: "DFS Implementation",
        description: "Implement Depth-First Search for a graph.",
        example: `Input: Graph with edges [[0,1], [0,2], [1,2], [2,3]]
Output: [0, 1, 2, 3]`,
        starterCode: `function dfs(graph, start) {
  // Your code here
}

// Test cases
const graph = [[1,2], [0,2], [0,1,3], [2]];
console.log(dfs(graph, 0));`,
        expectedOutputs: ["[0,1,2,3]", "[0,2,1,3]"]
      },
      {
        id: 18,
        title: "Number of Islands",
        description: "Count the number of islands in a 2D grid.",
        example: `Input: [
  ["1","1","0","0","0"],
  ["1","1","0","0","0"],
  ["0","0","1","0","0"],
  ["0","0","0","1","1"]
]
Output: 3`,
        starterCode: `function numIslands(grid) {
  // Your code here
}

// Test cases
const grid = [
  ["1","1","0","0","0"],
  ["1","1","0","0","0"],
  ["0","0","1","0","0"],
  ["0","0","0","1","1"]
];
console.log(numIslands(grid));`,
        expectedOutputs: ["3"]
      }
    ]
  },
  {
    id: 7,
    title: "Dynamic Programming",
    description: "Master dynamic programming techniques and patterns",
    videoUrl: "https://www.youtube.com/embed/oBt53YbR9Kk",
    language: "javascript",
    difficulty: "advanced",
    problems: [
      {
        id: 19,
        title: "Fibonacci Number",
        description: "Calculate the nth Fibonacci number using dynamic programming.",
        example: `Input: n = 5
Output: 5 (1,1,2,3,5)`,
        starterCode: `function fib(n) {
  // Your code here
}

// Test cases
console.log(fib(5));
console.log(fib(7));`,
        expectedOutputs: ["5", "13"]
      },
      {
        id: 20,
        title: "Climbing Stairs",
        description: "Count the number of ways to climb n stairs taking 1 or 2 steps at a time.",
        example: `Input: n = 3
Output: 3 (1+1+1, 1+2, 2+1)`,
        starterCode: `function climbStairs(n) {
  // Your code here
}

// Test cases
console.log(climbStairs(3));
console.log(climbStairs(4));`,
        expectedOutputs: ["3", "5"]
      },
      {
        id: 21,
        title: "Coin Change",
        description: "Find the minimum number of coins needed to make a given amount.",
        example: `Input: coins = [1,2,5], amount = 11
Output: 3 (5+5+1)`,
        starterCode: `function coinChange(coins, amount) {
  // Your code here
}

// Test cases
console.log(coinChange([1,2,5], 11));
console.log(coinChange([2,5,10], 27));`,
        expectedOutputs: ["3", "6"]
      }
    ]
  },
  {
    id: 8,
    title: "Binary Search",
    description: "Learn binary search and its variations",
    videoUrl: "https://www.youtube.com/embed/P3YID7liBug",
    language: "javascript",
    difficulty: "intermediate",
    problems: [
      {
        id: 22,
        title: "Basic Binary Search",
        description: "Implement binary search to find a target in a sorted array.",
        example: `Input: nums = [1,2,3,4,5], target = 3
Output: 2`,
        starterCode: `function binarySearch(nums, target) {
  // Your code here
}

// Test cases
console.log(binarySearch([1,2,3,4,5], 3));
console.log(binarySearch([1,3,5,7,9], 7));`,
        expectedOutputs: ["2", "3"]
      },
      {
        id: 23,
        title: "First Bad Version",
        description: "Find the first bad version using binary search.",
        example: `Input: n = 5, bad = 4
Output: 4`,
        starterCode: `function firstBadVersion(n) {
  // Your code here
}

// Test cases
console.log(firstBadVersion(5));
console.log(firstBadVersion(10));`,
        expectedOutputs: ["4", "8"]
      },
      {
        id: 24,
        title: "Search in Rotated Array",
        description: "Search for a target in a rotated sorted array.",
        example: `Input: nums = [4,5,6,7,0,1,2], target = 0
Output: 4`,
        starterCode: `function search(nums, target) {
  // Your code here
}

// Test cases
console.log(search([4,5,6,7,0,1,2], 0));
console.log(search([5,6,7,8,9,1,2,3], 3));`,
        expectedOutputs: ["4", "7"]
      }
    ]
  },
  {
    id: 9,
    title: "Sorting Algorithms",
    description: "Implement and understand different sorting techniques",
    videoUrl: "https://www.youtube.com/embed/Hoixgm4-P4M",
    language: "javascript",
    difficulty: "advanced",
    problems: [
      {
        id: 25,
        title: "Merge Sort",
        description: "Implement merge sort algorithm.",
        example: `Input: [64, 34, 25, 12, 22, 11, 90]
Output: [11, 12, 22, 25, 34, 64, 90]`,
        starterCode: `function mergeSort(arr) {
  // Your code here
}

// Test cases
console.log(mergeSort([64, 34, 25, 12, 22, 11, 90]));
console.log(mergeSort([5,2,8,1,9]));`,
        expectedOutputs: ["[11,12,22,25,34,64,90]", "[1,2,5,8,9]"]
      },
      {
        id: 26,
        title: "Quick Sort",
        description: "Implement quick sort algorithm.",
        example: `Input: [64, 34, 25, 12, 22, 11, 90]
Output: [11, 12, 22, 25, 34, 64, 90]`,
        starterCode: `function quickSort(arr) {
  // Your code here
}

// Test cases
console.log(quickSort([64, 34, 25, 12, 22, 11, 90]));
console.log(quickSort([5,2,8,1,9]));`,
        expectedOutputs: ["[11,12,22,25,34,64,90]", "[1,2,5,8,9]"]
      },
      {
        id: 27,
        title: "Bubble Sort",
        description: "Implement bubble sort algorithm.",
        example: `Input: [64, 34, 25, 12, 22, 11, 90]
Output: [11, 12, 22, 25, 34, 64, 90]`,
        starterCode: `function bubbleSort(arr) {
  // Your code here
}

// Test cases
console.log(bubbleSort([64, 34, 25, 12, 22, 11, 90]));
console.log(bubbleSort([5,2,8,1,9]));`,
        expectedOutputs: ["[11,12,22,25,34,64,90]", "[1,2,5,8,9]"]
      }
    ]
  },
  {
    id: 10,
    title: "Hash Tables",
    description: "Learn hash table implementations and problem-solving",
    videoUrl: "https://www.youtube.com/embed/shs0KM3wKv8",
    language: "javascript",
    difficulty: "intermediate",
    problems: [
      {
        id: 28,
        title: "Two Sum",
        description: "Find two numbers in an array that add up to a target.",
        example: `Input: nums = [2,7,11,15], target = 9
Output: [0,1]`,
        starterCode: `function twoSum(nums, target) {
  // Your code here
}

// Test cases
console.log(twoSum([2,7,11,15], 9));
console.log(twoSum([3,2,4], 6));`,
        expectedOutputs: ["[0,1]", "[1,2]"]
      },
      {
        id: 29,
        title: "First Unique Character",
        description: "Find the first non-repeating character in a string.",
        example: `Input: s = "leetcode"
Output: 0`,
        starterCode: `function firstUniqChar(s) {
  // Your code here
}

// Test cases
console.log(firstUniqChar("leetcode"));
console.log(firstUniqChar("loveleetcode"));`,
        expectedOutputs: ["0", "2"]
      },
      {
        id: 30,
        title: "Group Anagrams",
        description: "Group strings that are anagrams of each other.",
        example: `Input: ["eat","tea","tan","ate","nat","bat"]
Output: [["eat","tea","ate"],["tan","nat"],["bat"]]`,
        starterCode: `function groupAnagrams(strs) {
  // Your code here
}

// Test cases
console.log(groupAnagrams(["eat","tea","tan","ate","nat","bat"]));
console.log(groupAnagrams([""]));`,
        expectedOutputs: ['[["eat","tea","ate"],["tan","nat"],["bat"]]', '[[""]]']
      }
    ]
  },
  {
    id: 11,
    title: "Python Basics & Data Types",
    description: "Learn Python fundamentals including variables, data types, and basic operations",
    videoUrl: "https://www.youtube.com/embed/kqtD5dpn9C8",
    language: "python",
    difficulty: "beginner",
    problems: [
      {
        id: 31,
        title: "String Manipulation",
        description: "Create a function that reverses a string and converts it to uppercase.",
        example: `Input: "hello world"
Output: "DLROW OLLEH"`,
        starterCode: `def transform_string(text):
    # Your code here
    pass

# Test cases
print(transform_string("hello world"))
print(transform_string("python"))`,
        expectedOutputs: ["DLROW OLLEH", "NOHTYP"]
      },
      {
        id: 32,
        title: "Number Operations",
        description: "Write a function that checks if a number is prime and returns the next prime number.",
        example: `Input: 7
Output: 11`,
        starterCode: `def next_prime(n):
    # Your code here
    pass

# Test cases
print(next_prime(7))
print(next_prime(13))`,
        expectedOutputs: ["11", "17"]
      },
      {
        id: 33,
        title: "List Processing",
        description: "Create a function that removes duplicates from a list while preserving order.",
        example: `Input: [1, 3, 3, 4, 2, 1, 5]
Output: [1, 3, 4, 2, 5]`,
        starterCode: `def remove_duplicates(lst):
    # Your code here
    pass

# Test cases
print(remove_duplicates([1, 3, 3, 4, 2, 1, 5]))
print(remove_duplicates([1, 1, 1, 2, 2, 3]))`,
        expectedOutputs: ["[1, 3, 4, 2, 5]", "[1, 2, 3]"]
      }
    ]
  },
  {
    id: 12,
    title: "Python Lists & Dictionaries",
    description: "Master Python's built-in data structures and their operations",
    videoUrl: "https://www.youtube.com/embed/W8KRzm-HUcc",
    language: "python",
    difficulty: "intermediate",
    problems: [
      {
        id: 34,
        title: "Dictionary Manipulation",
        description: "Create a function that merges two dictionaries with nested values.",
        example: `Input: {"a": {"x": 1}}, {"a": {"y": 2}, "b": 3}
Output: {"a": {"x": 1, "y": 2}, "b": 3}`,
        starterCode: `def merge_dicts(dict1, dict2):
    # Your code here
    pass

# Test cases
print(merge_dicts({"a": {"x": 1}}, {"a": {"y": 2}, "b": 3}))
print(merge_dicts({"a": 1}, {"b": 2}))`,
        expectedOutputs: ['{"a": {"x": 1, "y": 2}, "b": 3}', '{"a": 1, "b": 2}']
      },
      {
        id: 35,
        title: "List Comprehension",
        description: "Use list comprehension to filter and transform data.",
        example: `Input: [1, 2, 3, 4, 5, 6]
Output: [4, 16, 36] (squares of even numbers)`,
        starterCode: `def process_list(numbers):
    # Your code here
    pass

# Test cases
print(process_list([1, 2, 3, 4, 5, 6]))
print(process_list([1, 3, 5, 7, 8, 10, 12]))`,
        expectedOutputs: ["[4, 16, 36]", "[64, 100, 144]"]
      }
    ]
  },
  {
    id: 13,
    title: "Python OOP Concepts",
    description: "Learn object-oriented programming in Python with practical examples",
    videoUrl: "https://www.youtube.com/embed/Ej_02ICOIgs",
    language: "python",
    difficulty: "advanced",
    problems: [
      {
        id: 36,
        title: "Class Implementation",
        description: "Create a Bank Account class with methods for deposit, withdrawal, and interest calculation.",
        example: `account = BankAccount(1000)
account.deposit(500)
print(account.balance)  # 1500
account.withdraw(200)
print(account.balance)  # 1300`,
        starterCode: `class BankAccount:
    def __init__(self, initial_balance):
        # Your code here
        pass
    
    def deposit(self, amount):
        # Your code here
        pass
    
    def withdraw(self, amount):
        # Your code here
        pass
    
    def add_interest(self, rate):
        # Your code here
        pass

# Test cases
account = BankAccount(1000)
account.deposit(500)
print(account.balance)
account.withdraw(200)
print(account.balance)`,
        expectedOutputs: ["1500", "1300"]
      }
    ]
  },
  {
    id: 14,
    title: "Java Fundamentals",
    description: "Learn Java basics including syntax, data types, and control structures",
    videoUrl: "https://www.youtube.com/embed/eIrMbAQSU34",
    language: "java",
    difficulty: "beginner",
    problems: [
      {
        id: 37,
        title: "String Operations",
        description: "Create a method that checks if a string is a palindrome.",
        example: `Input: "racecar"
Output: true`,
        starterCode: `public class Solution {
    public static boolean isPalindrome(String str) {
        // Your code here
    }

    public static void main(String[] args) {
        System.out.println(isPalindrome("racecar"));
        System.out.println(isPalindrome("hello"));
    }
}`,
        expectedOutputs: ["true", "false"]
      },
      {
        id: 38,
        title: "Array Processing",
        description: "Write a method to find the second largest element in an array.",
        example: `Input: [10, 5, 8, 12, 3]
Output: 10`,
        starterCode: `public class Solution {
    public static int findSecondLargest(int[] arr) {
        // Your code here
    }

    public static void main(String[] args) {
        System.out.println(findSecondLargest(new int[]{10, 5, 8, 12, 3}));
        System.out.println(findSecondLargest(new int[]{1, 2, 3, 4, 5}));
    }
}`,
        expectedOutputs: ["10", "4"]
      }
    ]
  },
  {
    id: 15,
    title: "Java Collections Framework",
    description: "Master Java collections including ArrayList, HashMap, and Sets",
    videoUrl: "https://www.youtube.com/embed/rzA7UJ-hQn4",
    language: "java",
    difficulty: "intermediate",
    problems: [
      {
        id: 39,
        title: "ArrayList Operations",
        description: "Implement methods to manipulate an ArrayList of integers.",
        example: `Input: [1, 2, 3, 4, 5]
removeEven()
Output: [1, 3, 5]`,
        starterCode: `import java.util.ArrayList;

public class Solution {
    public static ArrayList<Integer> removeEven(ArrayList<Integer> list) {
        // Your code here
    }

    public static void main(String[] args) {
        ArrayList<Integer> numbers = new ArrayList<>();
        numbers.add(1);
        numbers.add(2);
        numbers.add(3);
        numbers.add(4);
        numbers.add(5);
        System.out.println(removeEven(numbers));
    }
}`,
        expectedOutputs: ["[1, 3, 5]"]
      },
      {
        id: 40,
        title: "HashMap Usage",
        description: "Create a method to find the first non-repeating character in a string using HashMap.",
        example: `Input: "leetcode"
Output: "l"`,
        starterCode: `import java.util.HashMap;

public class Solution {
    public static char firstNonRepeating(String str) {
        // Your code here
    }

    public static void main(String[] args) {
        System.out.println(firstNonRepeating("leetcode"));
        System.out.println(firstNonRepeating("loveleetcode"));
    }
}`,
        expectedOutputs: ["l", "v"]
      }
    ]
  },
  {
    id: 16,
    title: "Java OOP & Design Patterns",
    description: "Advanced object-oriented programming concepts and common design patterns",
    videoUrl: "https://www.youtube.com/embed/BSVKUk58K6U",
    language: "java",
    difficulty: "advanced",
    problems: [
      {
        id: 41,
        title: "Singleton Pattern",
        description: "Implement a thread-safe Singleton pattern for a configuration manager.",
        example: `ConfigManager cm1 = ConfigManager.getInstance();
ConfigManager cm2 = ConfigManager.getInstance();
// cm1 and cm2 should be the same instance`,
        starterCode: `public class ConfigManager {
    // Your code here

    public static ConfigManager getInstance() {
        // Your code here
    }

    public static void main(String[] args) {
        ConfigManager cm1 = ConfigManager.getInstance();
        ConfigManager cm2 = ConfigManager.getInstance();
        System.out.println(cm1 == cm2);
    }
}`,
        expectedOutputs: ["true"]
      },
      {
        id: 42,
        title: "Factory Pattern",
        description: "Implement a Factory pattern for creating different types of vehicles.",
        example: `Vehicle car = VehicleFactory.createVehicle("car");
car.start(); // Output: Car started`,
        starterCode: `interface Vehicle {
    void start();
}

class Car implements Vehicle {
    public void start() {
        System.out.println("Car started");
    }
}

class Bike implements Vehicle {
    public void start() {
        System.out.println("Bike started");
    }
}

public class VehicleFactory {
    // Your code here

    public static void main(String[] args) {
        Vehicle car = createVehicle("car");
        Vehicle bike = createVehicle("bike");
        car.start();
        bike.start();
    }
}`,
        expectedOutputs: ["Car started", "Bike started"]
      }
    ]
  },
  {
    id: 17,
    title: "Python Functions & Modules",
    description: "Learn about Python functions, modules, and package management",
    videoUrl: "https://www.youtube.com/embed/xwKO_y2gHxQ",
    language: "python",
    difficulty: "beginner",
    problems: [
      {
        id: 43,
        title: "Function Basics",
        description: "Create a function that calculates the factorial of a number using recursion.",
        example: `Input: 5
Output: 120`,
        starterCode: `def factorial(n):
    # Your code here
    pass

# Test cases
print(factorial(5))
print(factorial(3))`,
        expectedOutputs: ["120", "6"]
      },
      {
        id: 44,
        title: "Lambda Functions",
        description: "Use lambda functions to sort a list of tuples by the second element.",
        example: `Input: [(1, 4), (2, 1), (3, 3)]
Output: [(2, 1), (3, 3), (1, 4)]`,
        starterCode: `def sort_tuples(tuples):
    # Your code here
    pass

# Test cases
print(sort_tuples([(1, 4), (2, 1), (3, 3)]))
print(sort_tuples([(1, 2), (2, 1), (3, 3)]))`,
        expectedOutputs: ["[(2, 1), (3, 3), (1, 4)]", "[(2, 1), (1, 2), (3, 3)]"]
      },
      {
        id: 45,
        title: "Module Usage",
        description: "Create a function that uses the math module to calculate the hypotenuse of a right triangle.",
        example: `Input: 3, 4
Output: 5.0`,
        starterCode: `import math

def calculate_hypotenuse(a, b):
    # Your code here
    pass

# Test cases
print(calculate_hypotenuse(3, 4))
print(calculate_hypotenuse(5, 12))`,
        expectedOutputs: ["5.0", "13.0"]
      }
    ]
  },
  {
    id: 18,
    title: "Python File Handling",
    description: "Master file operations, reading, writing, and working with different file formats",
    videoUrl: "https://www.youtube.com/embed/Sx1Hjr67xO0",
    language: "python",
    difficulty: "intermediate",
    problems: [
      {
        id: 46,
        title: "File Reading",
        description: "Write a function that reads a text file and returns the most common word.",
        example: `Input: "sample.txt" with content "hello world hello python"
Output: "hello"`,
        starterCode: `from collections import Counter

def most_common_word(filename):
    # Your code here
    pass

# Test cases
with open("sample.txt", "w") as f:
    f.write("hello world hello python")
print(most_common_word("sample.txt"))`,
        expectedOutputs: ["hello"]
      },
      {
        id: 47,
        title: "CSV Processing",
        description: "Create a function that reads a CSV file and calculates the average of a numeric column.",
        example: `Input: "data.csv" with content "name,age\nJohn,25\nJane,30"
Output: 27.5`,
        starterCode: `import csv

def calculate_average_age(filename):
    # Your code here
    pass

# Test cases
with open("data.csv", "w") as f:
    f.write("name,age\nJohn,25\nJane,30")
print(calculate_average_age("data.csv"))`,
        expectedOutputs: ["27.5"]
      },
      {
        id: 48,
        title: "JSON Handling",
        description: "Write a function that reads a JSON file and updates specific values.",
        example: `Input: {"name": "John", "age": 25}
Output: {"name": "John", "age": 26}`,
        starterCode: `import json

def update_json(filename):
    # Your code here
    pass

# Test cases
with open("data.json", "w") as f:
    json.dump({"name": "John", "age": 25}, f)
print(update_json("data.json"))`,
        expectedOutputs: ['{"name": "John", "age": 26}']
      }
    ]
  },
  {
    id: 19,
    title: "Python Web Development",
    description: "Learn web development with Python using Flask and Django",
    videoUrl: "https://www.youtube.com/embed/Z1RJmh_OqeA",
    language: "python",
    difficulty: "advanced",
    problems: [
      {
        id: 49,
        title: "Flask Routes",
        description: "Create a Flask application with multiple routes and template rendering.",
        example: `GET / -> "Welcome to Flask"
GET /about -> "About Page"`,
        starterCode: `from flask import Flask, render_template

app = Flask(__name__)

# Your code here

if __name__ == '__main__':
    app.run(debug=True)`,
        expectedOutputs: ["Welcome to Flask", "About Page"]
      },
      {
        id: 50,
        title: "Django Models",
        description: "Create a Django model for a blog post with title, content, and author.",
        example: `class BlogPost(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    author = models.ForeignKey(User, on_delete=models.CASCADE)`,
        starterCode: `from django.db import models
from django.contrib.auth.models import User

# Your code here

class BlogPost(models.Model):
    # Your code here
    pass`,
        expectedOutputs: ["BlogPost model created successfully"]
      },
      {
        id: 51,
        title: "API Development",
        description: "Create a REST API endpoint using Flask-RESTful.",
        example: `GET /api/items -> [{"id": 1, "name": "Item 1"}]`,
        starterCode: `from flask import Flask
from flask_restful import Api, Resource

app = Flask(__name__)
api = Api(app)

# Your code here

if __name__ == '__main__':
    app.run(debug=True)`,
        expectedOutputs: ['[{"id": 1, "name": "Item 1"}]']
      }
    ]
  },
  {
    id: 20,
    title: "Java Exception Handling",
    description: "Master exception handling and error management in Java",
    videoUrl: "https://www.youtube.com/embed/1XAfapkBQjk",
    language: "java",
    difficulty: "beginner",
    problems: [
      {
        id: 52,
        title: "Basic Exception Handling",
        description: "Create a method that handles division by zero exception.",
        example: `Input: 10, 0
Output: "Cannot divide by zero"`,
        starterCode: `public class Solution {
    public static String divide(int a, int b) {
        // Your code here
    }

    public static void main(String[] args) {
        System.out.println(divide(10, 0));
        System.out.println(divide(10, 2));
    }
}`,
        expectedOutputs: ["Cannot divide by zero", "5"]
      },
      {
        id: 53,
        title: "Custom Exceptions",
        description: "Create a custom exception for age validation.",
        example: `Input: -5
Output: "InvalidAgeException: Age cannot be negative"`,
        starterCode: `class InvalidAgeException extends Exception {
    // Your code here
}

public class Solution {
    public static void validateAge(int age) throws InvalidAgeException {
        // Your code here
    }

    public static void main(String[] args) {
        try {
            validateAge(-5);
        } catch (InvalidAgeException e) {
            System.out.println(e.getMessage());
        }
    }
}`,
        expectedOutputs: ["InvalidAgeException: Age cannot be negative"]
      },
      {
        id: 54,
        title: "Multiple Exception Handling",
        description: "Handle multiple exceptions in a single try-catch block.",
        example: `Input: "abc", 0
Output: "NumberFormatException: Invalid number format"`,
        starterCode: `public class Solution {
    public static void processInput(String str, int divisor) {
        // Your code here
    }

    public static void main(String[] args) {
        processInput("abc", 0);
    }
}`,
        expectedOutputs: ["NumberFormatException: Invalid number format"]
      }
    ]
  },
  {
    id: 21,
    title: "Java Multithreading",
    description: "Learn concurrent programming and thread management in Java",
    videoUrl: "https://www.youtube.com/embed/4aYvLz4E1Ts",
    language: "java",
    difficulty: "intermediate",
    problems: [
      {
        id: 55,
        title: "Thread Creation",
        description: "Create a thread that prints numbers from 1 to 5.",
        example: `Output: "Thread started: 1 2 3 4 5"`,
        starterCode: `public class Solution {
    public static void main(String[] args) {
        // Your code here
    }
}`,
        expectedOutputs: ["Thread started: 1 2 3 4 5"]
      },
      {
        id: 56,
        title: "Synchronized Methods",
        description: "Implement a thread-safe counter using synchronized methods.",
        example: `Output: "Final count: 1000"`,
        starterCode: `public class Solution {
    private static int count = 0;
    
    public static synchronized void increment() {
        // Your code here
    }

    public static void main(String[] args) {
        // Your code here
    }
}`,
        expectedOutputs: ["Final count: 1000"]
      },
      {
        id: 57,
        title: "Thread Communication",
        description: "Implement producer-consumer pattern using wait and notify.",
        example: `Output: "Producer produced: 1"`,
        starterCode: `public class Solution {
    public static void main(String[] args) {
        // Your code here
    }
}`,
        expectedOutputs: ["Producer produced: 1"]
      }
    ]
  },
  {
    id: 22,
    title: "Java Design Patterns",
    description: "Implement common design patterns and best practices in Java",
    videoUrl: "https://www.youtube.com/embed/v9ejT8FO-7I",
    language: "java",
    difficulty: "advanced",
    problems: [
      {
        id: 58,
        title: "Observer Pattern",
        description: "Implement the Observer pattern for a weather station.",
        example: `Output: "Current temperature: 25°C"`,
        starterCode: `interface Observer {
    void update(int temperature);
}

class WeatherStation {
    // Your code here
}

public class Solution {
    public static void main(String[] args) {
        // Your code here
    }
}`,
        expectedOutputs: ["Current temperature: 25°C"]
      },
      {
        id: 59,
        title: "Strategy Pattern",
        description: "Implement the Strategy pattern for different payment methods.",
        example: `Output: "Payment processed using Credit Card"`,
        starterCode: `interface PaymentStrategy {
    void pay(int amount);
}

public class Solution {
    public static void main(String[] args) {
        // Your code here
    }
}`,
        expectedOutputs: ["Payment processed using Credit Card"]
      },
      {
        id: 60,
        title: "Decorator Pattern",
        description: "Implement the Decorator pattern for a coffee ordering system.",
        example: `Output: "Cost: $4.50"`,
        starterCode: `interface Coffee {
    double getCost();
    String getDescription();
}

public class Solution {
    public static void main(String[] args) {
        // Your code here
    }
}`,
        expectedOutputs: ["Cost: $4.50"]
      }
    ]
  },
  {
    id: 23,
    title: "SQL Basics",
    description: "Learn fundamental SQL concepts and basic queries",
    videoUrl: "https://www.youtube.com/embed/HXV3zeQKqGY",
    language: "sql",
    difficulty: "beginner",
    problems: [
      {
        id: 61,
        title: "Basic SELECT Query",
        description: "Write a SQL query to select all columns from the 'users' table where age is greater than 18.",
        example: `Input: users table with columns (id, name, age, email)
Output: All users above 18 years old`,
        starterCode: `SELECT *
FROM users
WHERE age > 18;`,
        expectedOutputs: ["id | name | age | email\n1 | John | 25 | john@example.com\n2 | Jane | 30 | jane@example.com"]
      },
      {
        id: 62,
        title: "COUNT and GROUP BY",
        description: "Write a query to count the number of users in each age group.",
        example: `Input: users table
Output: Age group counts`,
        starterCode: `SELECT age, COUNT(*) as count
FROM users
GROUP BY age
ORDER BY age;`,
        expectedOutputs: ["age | count\n18 | 5\n20 | 3\n25 | 2\n30 | 1"]
      },
      {
        id: 63,
        title: "JOIN Tables",
        description: "Write a query to join the 'users' and 'orders' tables to show user names with their order counts.",
        example: `Input: users and orders tables
Output: User names with their order counts`,
        starterCode: `SELECT u.name, COUNT(o.id) as order_count
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
GROUP BY u.id, u.name;`,
        expectedOutputs: ["name | order_count\nJohn | 3\nJane | 2\nBob | 0"]
      }
    ]
  },
  {
    id: 24,
    title: "SQL Advanced Queries",
    description: "Master complex SQL queries and optimization",
    videoUrl: "https://www.youtube.com/embed/FNYdBLwZ6cE",
    language: "sql",
    difficulty: "intermediate",
    problems: [
      {
        id: 64,
        title: "Subqueries",
        description: "Write a query to find users who have placed orders with total value greater than average.",
        example: `Input: users and orders tables
Output: Users with above-average order values`,
        starterCode: `SELECT u.name, o.total_amount
FROM users u
JOIN orders o ON u.id = o.user_id
WHERE o.total_amount > (
    SELECT AVG(total_amount)
    FROM orders
);`,
        expectedOutputs: ["name | total_amount\nJohn | 150\nJane | 200"]
      },
      {
        id: 65,
        title: "Window Functions",
        description: "Write a query to rank users by their total order value.",
        example: `Input: users and orders tables
Output: Ranked users by order value`,
        starterCode: `SELECT 
    u.name,
    SUM(o.total_amount) as total_spent,
    RANK() OVER (ORDER BY SUM(o.total_amount) DESC) as rank
FROM users u
JOIN orders o ON u.id = o.user_id
GROUP BY u.id, u.name
ORDER BY total_spent DESC;`,
        expectedOutputs: ["name | total_spent | rank\nJane | 500 | 1\nJohn | 300 | 2\nBob | 100 | 3"]
      },
      {
        id: 66,
        title: "Common Table Expressions",
        description: "Write a query using CTE to find the top 3 products by sales volume.",
        example: `Input: products and order_items tables
Output: Top 3 products by sales`,
        starterCode: `WITH product_sales AS (
    SELECT 
        p.name,
        SUM(oi.quantity) as total_sold
    FROM products p
    JOIN order_items oi ON p.id = oi.product_id
    GROUP BY p.id, p.name
)
SELECT *
FROM product_sales
ORDER BY total_sold DESC
LIMIT 3;`,
        expectedOutputs: ["name | total_sold\nProduct A | 100\nProduct B | 80\nProduct C | 60"]
      }
    ]
  },
  {
    id: 25,
    title: "SQL Performance & Optimization",
    description: "Learn SQL performance tuning and optimization techniques",
    videoUrl: "https://www.youtube.com/embed/xuxgxdbCPnY",
    language: "sql",
    difficulty: "advanced",
    problems: [
      {
        id: 67,
        title: "Index Optimization",
        description: "Write queries to demonstrate the effectiveness of proper indexing.",
        example: `Input: users table with 1M rows
Output: Query execution plans`,
        starterCode: `-- Create index
CREATE INDEX idx_users_email ON users(email);

-- Query using index
EXPLAIN ANALYZE
SELECT *
FROM users
WHERE email = 'test@example.com';`,
        expectedOutputs: ["Index Scan using idx_users_email on users\n(cost=0.42..8.44 rows=1 width=72)\n(actual time=0.016..0.017 rows=1 loops=1)"]
      },
      {
        id: 68,
        title: "Query Rewriting",
        description: "Rewrite a complex query to improve performance.",
        example: `Input: Complex query with multiple joins
Output: Optimized query`,
        starterCode: `-- Original query
SELECT u.name, COUNT(DISTINCT o.id) as order_count
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
GROUP BY u.id, u.name;

-- Optimized query
SELECT u.name, COALESCE(o.order_count, 0) as order_count
FROM users u
LEFT JOIN (
    SELECT user_id, COUNT(*) as order_count
    FROM orders
    GROUP BY user_id
) o ON u.id = o.user_id;`,
        expectedOutputs: ["name | order_count\nJohn | 3\nJane | 2\nBob | 0"]
      },
      {
        id: 69,
        title: "Materialized Views",
        description: "Create and use materialized views for better performance.",
        example: `Input: Complex reporting query
Output: Materialized view implementation`,
        starterCode: `-- Create materialized view
CREATE MATERIALIZED VIEW mv_user_stats AS
SELECT 
    u.id,
    u.name,
    COUNT(o.id) as order_count,
    SUM(o.total_amount) as total_spent
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
GROUP BY u.id, u.name;

-- Refresh materialized view
REFRESH MATERIALIZED VIEW mv_user_stats;`,
        expectedOutputs: ["id | name | order_count | total_spent\n1 | John | 3 | 300\n2 | Jane | 2 | 500\n3 | Bob | 0 | 0"]
      }
    ]
  },
  {
    id: 26,
    title: "Go Fundamentals",
    description: "Learn Go programming basics and core concepts",
    videoUrl: "https://www.youtube.com/embed/YS4e4q9oBaU",
    language: "go",
    difficulty: "beginner",
    problems: [
      {
        id: 70,
        title: "Basic Functions",
        description: "Create a function that calculates the factorial of a number.",
        example: `Input: 5
Output: 120`,
        starterCode: `package main

func factorial(n int) int {
    // Your code here
    return 0
}

func main() {
    fmt.Println(factorial(5))
    fmt.Println(factorial(3))
}`,
        expectedOutputs: ["120", "6"]
      },
      {
        id: 71,
        title: "Slice Operations",
        description: "Write a function that removes duplicates from a slice while preserving order.",
        example: `Input: []int{1, 3, 3, 4, 2, 1, 5}
Output: []int{1, 3, 4, 2, 5}`,
        starterCode: `package main

func removeDuplicates(nums []int) []int {
    // Your code here
    return nil
}

func main() {
    fmt.Println(removeDuplicates([]int{1, 3, 3, 4, 2, 1, 5}))
    fmt.Println(removeDuplicates([]int{1, 1, 1, 2, 2, 3}))
}`,
        expectedOutputs: ["[1 3 4 2 5]", "[1 2 3]"]
      },
      {
        id: 72,
        title: "Error Handling",
        description: "Create a function that divides two numbers and handles division by zero.",
        example: `Input: 10, 0
Output: "Cannot divide by zero"`,
        starterCode: `package main

func divide(a, b float64) (float64, error) {
    // Your code here
    return 0, nil
}

func main() {
    result, err := divide(10, 0)
    if err != nil {
        fmt.Println(err)
    } else {
        fmt.Println(result)
    }
}`,
        expectedOutputs: ["Cannot divide by zero"]
      }
    ]
  },
  {
    id: 27,
    title: "Go Concurrency",
    description: "Master Go's concurrency features and patterns",
    videoUrl: "https://www.youtube.com/embed/B9uR2gLM80E",
    language: "go",
    difficulty: "intermediate",
    problems: [
      {
        id: 73,
        title: "Goroutines",
        description: "Create a program that uses goroutines to calculate Fibonacci numbers concurrently.",
        example: `Input: n = 5
Output: [1, 1, 2, 3, 5]`,
        starterCode: `package main

func fibonacci(n int) int {
    // Your code here
    return 0
}

func main() {
    // Your code here
}`,
        expectedOutputs: ["[1 1 2 3 5]"]
      },
      {
        id: 74,
        title: "Channels",
        description: "Implement a producer-consumer pattern using channels.",
        example: `Output: "Producer: 1"`,
        starterCode: `package main

func main() {
    // Your code here
}`,
        expectedOutputs: ["Producer: 1"]
      },
      {
        id: 75,
        title: "Mutex",
        description: "Create a thread-safe counter using mutex.",
        example: `Output: "Final count: 1000"`,
        starterCode: `package main

type Counter struct {
    // Your code here
}

func (c *Counter) Increment() {
    // Your code here
}

func main() {
    // Your code here
}`,
        expectedOutputs: ["Final count: 1000"]
      }
    ]
  },
  {
    id: 28,
    title: "Go Web Development",
    description: "Build web applications using Go and popular frameworks",
    videoUrl: "https://www.youtube.com/embed/un6ZyFkqFKo",
    language: "go",
    difficulty: "advanced",
    problems: [
      {
        id: 76,
        title: "HTTP Server",
        description: "Create a basic HTTP server with multiple routes.",
        example: `GET / -> "Welcome to Go Server"
GET /about -> "About Page"`,
        starterCode: `package main

func main() {
    // Your code here
}`,
        expectedOutputs: ["Welcome to Go Server", "About Page"]
      },
      {
        id: 77,
        title: "Middleware",
        description: "Implement authentication middleware for protected routes.",
        example: `GET /protected -> "Protected Content"`,
        starterCode: `package main

func authMiddleware(next http.Handler) http.Handler {
    // Your code here
    return nil
}

func main() {
    // Your code here
}`,
        expectedOutputs: ["Protected Content"]
      },
      {
        id: 78,
        title: "Database Integration",
        description: "Create a REST API with database integration using GORM.",
        example: `GET /api/users -> [{"id": 1, "name": "John"}]`,
        starterCode: `package main

type User struct {
    // Your code here
}

func main() {
    // Your code here
}`,
        expectedOutputs: ['[{"id": 1, "name": "John"}]']
      }
    ]
  },
  {
    id: 29,
    title: "Rust Fundamentals",
    description: "Learn Rust programming basics and ownership concepts",
    videoUrl: "https://www.youtube.com/embed/BpPEoZW5IiY",
    language: "rust",
    difficulty: "beginner",
    problems: [
      {
        id: 79,
        title: "Basic Ownership",
        description: "Create a function that demonstrates ownership transfer in Rust.",
        example: `Input: String::from("Hello")
Output: "Hello"`,
        starterCode: `fn main() {
    let s = String::from("Hello");
    let result = process_string(s);
    println!("{}", result);
}

fn process_string(s: String) -> String {
    // Your code here
    s
}`,
        expectedOutputs: ["Hello"]
      },
      {
        id: 80,
        title: "Structs and Methods",
        description: "Create a Rectangle struct with methods to calculate area and perimeter.",
        example: `Input: width = 5, height = 3
Output: Area = 15, Perimeter = 16`,
        starterCode: `struct Rectangle {
    width: u32,
    height: u32,
}

impl Rectangle {
    // Your code here
}

fn main() {
    let rect = Rectangle {
        width: 5,
        height: 3,
    };
    println!("Area: {}", rect.area());
    println!("Perimeter: {}", rect.perimeter());
}`,
        expectedOutputs: ["Area: 15", "Perimeter: 16"]
      },
      {
        id: 81,
        title: "Error Handling",
        description: "Implement a function that divides two numbers and handles division by zero using Result.",
        example: `Input: 10, 0
Output: "Cannot divide by zero"`,
        starterCode: `fn divide(a: f64, b: f64) -> Result<f64, String> {
    // Your code here
    Ok(0.0)
}

fn main() {
    match divide(10.0, 0.0) {
        Ok(result) => println!("{}", result),
        Err(e) => println!("{}", e),
    }
}`,
        expectedOutputs: ["Cannot divide by zero"]
      }
    ]
  },
  {
    id: 30,
    title: "Rust Advanced Concepts",
    description: "Master Rust's advanced features and concurrency",
    videoUrl: "https://www.youtube.com/embed/joCFbTJt0o0",
    language: "rust",
    difficulty: "intermediate",
    problems: [
      {
        id: 82,
        title: "Traits and Generics",
        description: "Create a generic function that finds the maximum value in a vector of any comparable type.",
        example: `Input: vec![1, 5, 2, 8, 3]
Output: 8`,
        starterCode: `fn find_max<T: Ord>(numbers: &[T]) -> Option<&T> {
    // Your code here
    None
}

fn main() {
    let numbers = vec![1, 5, 2, 8, 3];
    println!("Maximum: {:?}", find_max(&numbers));
}`,
        expectedOutputs: ["Maximum: Some(8)"]
      },
      {
        id: 83,
        title: "Lifetimes",
        description: "Implement a function that returns the longer of two string slices.",
        example: `Input: "short", "longer string"
Output: "longer string"`,
        starterCode: `fn longer<'a>(s1: &'a str, s2: &'a str) -> &'a str {
    // Your code here
    s1
}

fn main() {
    let s1 = "short";
    let s2 = "longer string";
    println!("{}", longer(s1, s2));
}`,
        expectedOutputs: ["longer string"]
      },
      {
        id: 84,
        title: "Smart Pointers",
        description: "Create a custom smart pointer that implements Drop trait.",
        example: `Output: "Resource is being dropped"`,
        starterCode: `struct CustomSmartPointer {
    data: String,
}

impl Drop for CustomSmartPointer {
    // Your code here
}

fn main() {
    let c = CustomSmartPointer {
        data: String::from("my stuff"),
    };
}`,
        expectedOutputs: ["Resource is being dropped"]
      }
    ]
  },
  {
    id: 31,
    title: "Rust Systems Programming",
    description: "Learn systems programming concepts in Rust",
    videoUrl: "https://www.youtube.com/embed/gboGyccRVXI",
    language: "rust",
    difficulty: "advanced",
    problems: [
      {
        id: 85,
        title: "Unsafe Rust",
        description: "Implement a function that safely dereferences a raw pointer.",
        example: `Input: value = 42
Output: 42`,
        starterCode: `fn main() {
    let mut value = 42;
    let raw_ptr = &mut value as *mut i32;
    
    unsafe {
        // Your code here
        println!("{}", *raw_ptr);
    }
}`,
        expectedOutputs: ["42"]
      },
      {
        id: 86,
        title: "FFI Integration",
        description: "Create a Rust function that can be called from C.",
        example: `Output: "Called from C"`,
        starterCode: `#[no_mangle]
pub extern "C" fn rust_function() {
    // Your code here
    println!("Called from C");
}`,
        expectedOutputs: ["Called from C"]
      },
      {
        id: 87,
        title: "Custom Allocator",
        description: "Implement a simple custom allocator for a specific data structure.",
        example: `Output: "Memory allocated and freed"`,
        starterCode: `use std::alloc::{GlobalAlloc, Layout};

struct CustomAllocator;

unsafe impl GlobalAlloc for CustomAllocator {
    // Your code here
}

#[global_allocator]
static ALLOCATOR: CustomAllocator = CustomAllocator;

fn main() {
    // Your code here
}`,
        expectedOutputs: ["Memory allocated and freed"]
      }
    ]
  },
  {
    id: 32,
    title: "C Programming Basics",
    description: "Learn fundamental C programming concepts",
    videoUrl: "https://www.youtube.com/embed/KJgsSFOSQv0",
    language: "c",
    difficulty: "beginner",
    problems: [
      {
        id: 88,
        title: "Pointers and Arrays",
        description: "Write a function that reverses an array using pointers.",
        example: `Input: [1, 2, 3, 4, 5]
Output: [5, 4, 3, 2, 1]`,
        starterCode: `void reverse_array(int *arr, int size) {
    // Your code here
}

int main() {
    int arr[] = {1, 2, 3, 4, 5};
    int size = 5;
    reverse_array(arr, size);
    for(int i = 0; i < size; i++) {
        printf("%d ", arr[i]);
    }
    return 0;
}`,
        expectedOutputs: ["5 4 3 2 1"]
      },
      {
        id: 89,
        title: "Structures",
        description: "Create a structure to store student information and functions to manipulate it.",
        example: `Input: name="John", age=20, grade=85.5
Output: "Student: John, Age: 20, Grade: 85.5"`,
        starterCode: `struct Student {
    char name[50];
    int age;
    float grade;
};

void print_student(struct Student s) {
    // Your code here
}

int main() {
    struct Student s = {"John", 20, 85.5};
    print_student(s);
    return 0;
}`,
        expectedOutputs: ["Student: John, Age: 20, Grade: 85.5"]
      },
      {
        id: 90,
        title: "File Handling",
        description: "Write a program to read from a file and count the number of words.",
        example: `Input: "Hello world\nThis is a test"
Output: "Word count: 5"`,
        starterCode: `int count_words(const char *filename) {
    // Your code here
    return 0;
}

int main() {
    printf("Word count: %d\n", count_words("test.txt"));
    return 0;
}`,
        expectedOutputs: ["Word count: 5"]
      }
    ]
  },
  {
    id: 33,
    title: "C Memory Management",
    description: "Master C memory management and advanced concepts",
    videoUrl: "https://www.youtube.com/embed/KJgsSFOSQv0",
    language: "c",
    difficulty: "intermediate",
    problems: [
      {
        id: 91,
        title: "Dynamic Memory",
        description: "Implement a dynamic array with automatic resizing.",
        example: `Input: Add elements 1,2,3,4,5
Output: [1,2,3,4,5]`,
        starterCode: `struct DynamicArray {
    int *arr;
    int size;
    int capacity;
};

void init_array(struct DynamicArray *da, int initial_capacity) {
    // Your code here
}

void push_back(struct DynamicArray *da, int value) {
    // Your code here
}

int main() {
    struct DynamicArray da;
    init_array(&da, 2);
    push_back(&da, 1);
    push_back(&da, 2);
    push_back(&da, 3);
    // Print array
    return 0;
}`,
        expectedOutputs: ["[1,2,3]"]
      },
      {
        id: 92,
        title: "Linked List",
        description: "Implement a singly linked list with insert and delete operations.",
        example: `Input: Insert 1,2,3, Delete 2
Output: [1,3]`,
        starterCode: `struct Node {
    int data;
    struct Node *next;
};

struct Node* create_node(int data) {
    // Your code here
    return NULL;
}

void insert_node(struct Node **head, int data) {
    // Your code here
}

void delete_node(struct Node **head, int data) {
    // Your code here
}

int main() {
    struct Node *head = NULL;
    insert_node(&head, 1);
    insert_node(&head, 2);
    insert_node(&head, 3);
    delete_node(&head, 2);
    // Print list
    return 0;
}`,
        expectedOutputs: ["1->3->NULL"]
      },
      {
        id: 93,
        title: "Memory Leaks",
        description: "Fix memory leaks in a program that creates and manipulates structures.",
        example: `Output: "Memory properly freed"`,
        starterCode: `struct Resource {
    int *data;
    int size;
};

struct Resource* create_resource(int size) {
    // Your code here
    return NULL;
}

void free_resource(struct Resource *r) {
    // Your code here
}

int main() {
    struct Resource *r = create_resource(5);
    // Use resource
    free_resource(r);
    return 0;
}`,
        expectedOutputs: ["Memory properly freed"]
      }
    ]
  },
  {
    id: 34,
    title: "C Systems Programming",
    description: "Learn systems programming concepts in C",
    videoUrl: "https://www.youtube.com/embed/KJgsSFOSQv0",
    language: "c",
    difficulty: "advanced",
    problems: [
      {
        id: 94,
        title: "Process Management",
        description: "Create a program that spawns child processes and handles signals.",
        example: `Output: "Child process created and terminated"`,
        starterCode: `void handle_signal(int sig) {
    // Your code here
}

int main() {
    signal(SIGCHLD, handle_signal);
    pid_t pid = fork();
    if (pid == 0) {
        // Child process
    } else {
        // Parent process
    }
    return 0;
}`,
        expectedOutputs: ["Child process created and terminated"]
      },
      {
        id: 95,
        title: "Socket Programming",
        description: "Implement a basic TCP server that echoes client messages.",
        example: `Input: "Hello Server"
Output: "Echo: Hello Server"`,
        starterCode: `void handle_client(int client_socket) {
    // Your code here
}

int main() {
    int server_socket = socket(AF_INET, SOCK_STREAM, 0);
    // Setup server
    // Accept connections
    return 0;
}`,
        expectedOutputs: ["Echo: Hello Server"]
      },
      {
        id: 96,
        title: "Thread Synchronization",
        description: "Create a program that demonstrates mutex and condition variables.",
        example: `Output: "Threads synchronized successfully"`,
        starterCode: `pthread_mutex_t mutex = PTHREAD_MUTEX_INITIALIZER;
pthread_cond_t cond = PTHREAD_COND_INITIALIZER;

void* producer(void* arg) {
    // Your code here
    return NULL;
}

void* consumer(void* arg) {
    // Your code here
    return NULL;
}

int main() {
    pthread_t prod, cons;
    pthread_create(&prod, NULL, producer, NULL);
    pthread_create(&cons, NULL, consumer, NULL);
    pthread_join(prod, NULL);
    pthread_join(cons, NULL);
    return 0;
}`,
        expectedOutputs: ["Threads synchronized successfully"]
      }
    ]
  },
  {
    id: 35,
    title: "C++ Basics",
    description: "Learn fundamental C++ programming concepts",
    videoUrl: "https://www.youtube.com/embed/vLnPwxZdW4Y",
    language: "cpp",
    difficulty: "beginner",
    problems: [
      {
        id: 97,
        title: "Classes and Objects",
        description: "Create a BankAccount class with deposit and withdraw methods.",
        example: `Input: Initial balance = 1000, Deposit 500, Withdraw 300
Output: "Final balance: 1200"`,
        starterCode: `class BankAccount {
private:
    double balance;
public:
    BankAccount(double initial_balance) {
        // Your code here
    }
    
    void deposit(double amount) {
        // Your code here
    }
    
    void withdraw(double amount) {
        // Your code here
    }
    
    double get_balance() const {
        // Your code here
        return 0.0;
    }
};

int main() {
    BankAccount account(1000);
    account.deposit(500);
    account.withdraw(300);
    std::cout << "Final balance: " << account.get_balance() << std::endl;
    return 0;
}`,
        expectedOutputs: ["Final balance: 1200"]
      },
      {
        id: 98,
        title: "STL Containers",
        description: "Use STL containers to implement a simple task manager.",
        example: `Input: Add tasks "Study", "Exercise", "Code"
Output: "Tasks: Study, Exercise, Code"`,
        starterCode: `class TaskManager {
private:
    std::vector<std::string> tasks;
public:
    void add_task(const std::string& task) {
        // Your code here
    }
    
    void display_tasks() const {
        // Your code here
    }
};

int main() {
    TaskManager tm;
    tm.add_task("Study");
    tm.add_task("Exercise");
    tm.add_task("Code");
    tm.display_tasks();
    return 0;
}`,
        expectedOutputs: ["Tasks: Study, Exercise, Code"]
      },
      {
        id: 99,
        title: "Exception Handling",
        description: "Implement a function that handles division by zero using try-catch.",
        example: `Input: 10, 0
Output: "Cannot divide by zero"`,
        starterCode: `double divide(double a, double b) {
    // Your code here
    return 0.0;
}

int main() {
    try {
        double result = divide(10, 0);
        std::cout << result << std::endl;
    } catch (const std::exception& e) {
        std::cout << e.what() << std::endl;
    }
    return 0;
}`,
        expectedOutputs: ["Cannot divide by zero"]
      }
    ]
  },
  {
    id: 36,
    title: "C++ Advanced Features",
    description: "Master C++ advanced features and templates",
    videoUrl: "https://www.youtube.com/embed/vLnPwxZdW4Y",
    language: "cpp",
    difficulty: "intermediate",
    problems: [
      {
        id: 100,
        title: "Templates",
        description: "Create a generic Stack class using templates.",
        example: `Input: Push 1, 2, 3
Output: "Stack: 3, 2, 1"`,
        starterCode: `template<typename T>
class Stack {
private:
    std::vector<T> elements;
public:
    void push(const T& value) {
        // Your code here
    }
    
    T pop() {
        // Your code here
        return T();
    }
    
    void display() const {
        // Your code here
    }
};

int main() {
    Stack<int> s;
    s.push(1);
    s.push(2);
    s.push(3);
    s.display();
    return 0;
}`,
        expectedOutputs: ["Stack: 3, 2, 1"]
      },
      {
        id: 101,
        title: "Smart Pointers",
        description: "Implement a custom smart pointer class.",
        example: `Output: "Resource managed and freed"`,
        starterCode: `template<typename T>
class SmartPointer {
private:
    T* ptr;
    int* ref_count;
public:
    SmartPointer(T* p = nullptr) {
        // Your code here
    }
    
    ~SmartPointer() {
        // Your code here
    }
    
    SmartPointer(const SmartPointer& other) {
        // Your code here
    }
    
    SmartPointer& operator=(const SmartPointer& other) {
        // Your code here
        return *this;
    }
};

int main() {
    SmartPointer<int> ptr(new int(42));
    return 0;
}`,
        expectedOutputs: ["Resource managed and freed"]
      },
      {
        id: 102,
        title: "Move Semantics",
        description: "Implement move constructor and move assignment operator for a resource class.",
        example: `Output: "Resource moved successfully"`,
        starterCode: `class Resource {
private:
    int* data;
public:
    Resource() {
        // Your code here
    }
    
    Resource(Resource&& other) noexcept {
        // Your code here
    }
    
    Resource& operator=(Resource&& other) noexcept {
        // Your code here
        return *this;
    }
    
    ~Resource() {
        // Your code here
    }
};

int main() {
    Resource r1;
    Resource r2 = std::move(r1);
    return 0;
}`,
        expectedOutputs: ["Resource moved successfully"]
      }
    ]
  },
  {
    id: 37,
    title: "C++ Systems Programming",
    description: "Learn systems programming concepts in C++",
    videoUrl: "https://www.youtube.com/embed/vLnPwxZdW4Y",
    language: "cpp",
    difficulty: "advanced",
    problems: [
      {
        id: 103,
        title: "Threading",
        description: "Create a thread pool implementation using C++ threads.",
        example: `Output: "Tasks executed in parallel"`,
        starterCode: `class ThreadPool {
private:
    std::vector<std::thread> workers;
    std::queue<std::function<void()>> tasks;
    std::mutex queue_mutex;
    std::condition_variable condition;
    bool stop;
public:
    ThreadPool(size_t threads) {
        // Your code here
    }
    
    template<class F>
    void enqueue(F&& f) {
        // Your code here
    }
    
    ~ThreadPool() {
        // Your code here
    }
};

int main() {
    ThreadPool pool(4);
    for(int i = 0; i < 8; ++i) {
        pool.enqueue([i]() {
            std::this_thread::sleep_for(std::chrono::seconds(1));
            std::cout << "Task " << i << " completed\n";
        });
    }
    return 0;
}`,
        expectedOutputs: ["Tasks executed in parallel"]
      },
      {
        id: 104,
        title: "Network Programming",
        description: "Implement a basic HTTP server using C++ networking.",
        example: `GET / -> "Hello, World!"`,
        starterCode: `class HTTPServer {
private:
    int server_fd;
    struct sockaddr_in address;
public:
    HTTPServer(int port) {
        // Your code here
    }
    
    void start() {
        // Your code here
    }
    
    void handle_request(int client_socket) {
        // Your code here
    }
};

int main() {
    HTTPServer server(8080);
    server.start();
    return 0;
}`,
        expectedOutputs: ["Hello, World!"]
      },
      {
        id: 105,
        title: "Memory Management",
        description: "Create a custom memory allocator for a specific data structure.",
        example: `Output: "Memory allocated and freed efficiently"`,
        starterCode: `template<typename T>
class CustomAllocator {
private:
    struct Block {
        T* data;
        bool used;
        Block* next;
    };
    Block* head;
public:
    CustomAllocator() {
        // Your code here
    }
    
    T* allocate() {
        // Your code here
        return nullptr;
    }
    
    void deallocate(T* ptr) {
        // Your code here
    }
    
    ~CustomAllocator() {
        // Your code here
    }
};

int main() {
    CustomAllocator<int> allocator;
    int* ptr = allocator.allocate();
    *ptr = 42;
    allocator.deallocate(ptr);
    return 0;
}`,
        expectedOutputs: ["Memory allocated and freed efficiently"]
      }
    ]
  },
  {
    id: 38,
    title: "C# Fundamentals",
    description: "Learn C# programming basics and core concepts",
    videoUrl: "https://www.youtube.com/embed/GhQdlIFylQ8",
    language: "csharp",
    difficulty: "beginner",
    problems: [
      {
        id: 106,
        title: "Classes and Objects",
        description: "Create a Student class with properties and methods to manage student information.",
        example: `Input: name="John", age=20, grade=85.5
Output: "Student: John, Age: 20, Grade: 85.5"`,
        starterCode: `public class Student
{
    public string Name { get; set; }
    public int Age { get; set; }
    public double Grade { get; set; }

    public Student(string name, int age, double grade)
    {
        // Your code here
    }

    public string GetInfo()
    {
        // Your code here
        return "";
    }
}

class Program
{
    static void Main()
    {
        Student student = new Student("John", 20, 85.5);
        Console.WriteLine(student.GetInfo());
    }
}`,
        expectedOutputs: ["Student: John, Age: 20, Grade: 85.5"]
      },
      {
        id: 107,
        title: "Collections",
        description: "Use List<T> to implement a simple task manager with add, remove, and display functionality.",
        example: `Input: Add tasks "Study", "Exercise", "Code"
Output: "Tasks: Study, Exercise, Code"`,
        starterCode: `public class TaskManager
{
    private List<string> tasks = new List<string>();

    public void AddTask(string task)
    {
        // Your code here
    }

    public void RemoveTask(string task)
    {
        // Your code here
    }

    public void DisplayTasks()
    {
        // Your code here
    }
}

class Program
{
    static void Main()
    {
        TaskManager tm = new TaskManager();
        tm.AddTask("Study");
        tm.AddTask("Exercise");
        tm.AddTask("Code");
        tm.DisplayTasks();
    }
}`,
        expectedOutputs: ["Tasks: Study, Exercise, Code"]
      },
      {
        id: 108,
        title: "Exception Handling",
        description: "Implement a function that handles division by zero using try-catch blocks.",
        example: `Input: 10, 0
Output: "Cannot divide by zero"`,
        starterCode: `public class Calculator
{
    public static double Divide(double a, double b)
    {
        // Your code here
        return 0.0;
    }
}

class Program
{
    static void Main()
    {
        try
        {
            double result = Calculator.Divide(10, 0);
            Console.WriteLine(result);
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
        }
    }
}`,
        expectedOutputs: ["Cannot divide by zero"]
      }
    ]
  },
  {
    id: 39,
    title: "C# Advanced Features",
    description: "Master C# advanced features and LINQ",
    videoUrl: "https://www.youtube.com/embed/GhQdlIFylQ8",
    language: "csharp",
    difficulty: "intermediate",
    problems: [
      {
        id: 109,
        title: "LINQ Operations",
        description: "Use LINQ to filter and transform a collection of numbers.",
        example: `Input: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
Output: "Even squares: 4, 16, 36, 64, 100"`,
        starterCode: `using System.Linq;

class Program
{
    static void Main()
    {
        int[] numbers = { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 };
        
        var result = numbers
            .Where(n => n % 2 == 0)
            .Select(n => n * n);
            
        Console.WriteLine("Even squares: " + string.Join(", ", result));
    }
}`,
        expectedOutputs: ["Even squares: 4, 16, 36, 64, 100"]
      },
      {
        id: 110,
        title: "Async/Await",
        description: "Create an asynchronous method to fetch data from a simulated API.",
        example: `Output: "Data fetched successfully"`,
        starterCode: `public class DataService
{
    public async Task<string> FetchDataAsync()
    {
        // Your code here
        return "";
    }
}

class Program
{
    static async Task Main()
    {
        var service = new DataService();
        string result = await service.FetchDataAsync();
        Console.WriteLine(result);
    }
}`,
        expectedOutputs: ["Data fetched successfully"]
      },
      {
        id: 111,
        title: "Delegates and Events",
        description: "Implement a simple event system for a temperature monitor.",
        example: `Output: "Temperature changed: 25°C"`,
        starterCode: `public class TemperatureMonitor
{
    public delegate void TemperatureChangedHandler(double temperature);
    public event TemperatureChangedHandler OnTemperatureChanged;

    private double currentTemperature;

    public void UpdateTemperature(double newTemperature)
    {
        // Your code here
    }
}

class Program
{
    static void Main()
    {
        var monitor = new TemperatureMonitor();
        monitor.OnTemperatureChanged += (temp) => 
            Console.WriteLine($"Temperature changed: {temp}°C");
        monitor.UpdateTemperature(25);
    }
}`,
        expectedOutputs: ["Temperature changed: 25°C"]
      }
    ]
  },
  {
    id: 40,
    title: "C# Enterprise Development",
    description: "Learn enterprise-level C# development concepts",
    videoUrl: "https://www.youtube.com/embed/GhQdlIFylQ8",
    language: "csharp",
    difficulty: "advanced",
    problems: [
      {
        id: 112,
        title: "Dependency Injection",
        description: "Implement a simple dependency injection container.",
        example: `Output: "Service executed with dependency"`,
        starterCode: `public interface IService
{
    void Execute();
}

public class Dependency
{
    public void DoSomething()
    {
        Console.WriteLine("Dependency executed");
    }
}

public class Service : IService
{
    private readonly Dependency _dependency;

    public Service(Dependency dependency)
    {
        // Your code here
    }

    public void Execute()
    {
        // Your code here
    }
}

class Program
{
    static void Main()
    {
        var container = new ServiceContainer();
        container.Register<IService, Service>();
        container.Register<Dependency>();
        
        var service = container.Resolve<IService>();
        service.Execute();
    }
}`,
        expectedOutputs: ["Service executed with dependency"]
      },
      {
        id: 113,
        title: "Unit Testing",
        description: "Create unit tests for a calculator class using xUnit.",
        example: `Output: "All tests passed"`,
        starterCode: `public class Calculator
{
    public int Add(int a, int b)
    {
        // Your code here
        return 0;
    }

    public int Subtract(int a, int b)
    {
        // Your code here
        return 0;
    }
}

public class CalculatorTests
{
    private readonly Calculator _calculator;

    public CalculatorTests()
    {
        _calculator = new Calculator();
    }

    [Fact]
    public void Add_ShouldReturnSum()
    {
        // Your code here
    }

    [Fact]
    public void Subtract_ShouldReturnDifference()
    {
        // Your code here
    }
}`,
        expectedOutputs: ["All tests passed"]
      },
      {
        id: 114,
        title: "Design Patterns",
        description: "Implement the Observer pattern for a stock market system.",
        example: `Output: "Stock price updated: $100"`,
        starterCode: `public interface IObserver
{
    void Update(string message);
}

public class StockMarket
{
    private List<IObserver> observers = new List<IObserver>();
    private double currentPrice;

    public void Attach(IObserver observer)
    {
        // Your code here
    }

    public void Detach(IObserver observer)
    {
        // Your code here
    }

    public void UpdatePrice(double newPrice)
    {
        // Your code here
    }

    private void Notify()
    {
        // Your code here
    }
}

class Program
{
    static void Main()
    {
        var market = new StockMarket();
        var observer = new StockObserver();
        market.Attach(observer);
        market.UpdatePrice(100);
    }
}`,
        expectedOutputs: ["Stock price updated: $100"]
      }
    ]
  },
  {
    id: 41,
    title: "TypeScript Fundamentals",
    description: "Learn TypeScript basics and type system",
    videoUrl: "https://www.youtube.com/embed/BwuLxPH8IDs",
    language: "typescript",
    difficulty: "beginner",
    problems: [
      {
        id: 115,
        title: "Basic Types",
        description: "Create a function that demonstrates various TypeScript types and type annotations.",
        example: `Input: name="John", age=25, isStudent=true
Output: "Name: John, Age: 25, Is Student: true"`,
        starterCode: `interface Person {
    name: string;
    age: number;
    isStudent: boolean;
}

function displayPerson(person: Person): string {
    // Your code here
    return "";
}

const person: Person = {
    name: "John",
    age: 25,
    isStudent: true
};

console.log(displayPerson(person));`,
        expectedOutputs: ["Name: John, Age: 25, Is Student: true"]
      },
      {
        id: 116,
        title: "Arrays and Tuples",
        description: "Implement functions to work with typed arrays and tuples.",
        example: `Input: [1, 2, 3], ["a", "b"]
Output: "Sum: 6, Tuple: a,b"`,
        starterCode: `function sumArray(numbers: number[]): number {
    // Your code here
    return 0;
}

function processTuple(tuple: [string, string]): string {
    // Your code here
    return "";
}

const numbers: number[] = [1, 2, 3];
const tuple: [string, string] = ["a", "b"];

console.log("Sum:", sumArray(numbers));
console.log("Tuple:", processTuple(tuple));`,
        expectedOutputs: ["Sum: 6", "Tuple: a,b"]
      },
      {
        id: 117,
        title: "Enums and Unions",
        description: "Create an enum for days of the week and a union type for different user roles.",
        example: `Input: DayOfWeek.Monday, UserRole.Admin
Output: "Day: Monday, Role: Admin"`,
        starterCode: `enum DayOfWeek {
    Monday,
    Tuesday,
    Wednesday,
    Thursday,
    Friday,
    Saturday,
    Sunday
}

type UserRole = "Admin" | "User" | "Guest";

function displayInfo(day: DayOfWeek, role: UserRole): string {
    // Your code here
    return "";
}

console.log(displayInfo(DayOfWeek.Monday, "Admin"));`,
        expectedOutputs: ["Day: Monday, Role: Admin"]
      }
    ]
  },
  {
    id: 42,
    title: "TypeScript Advanced Features",
    description: "Master TypeScript advanced features and type system",
    videoUrl: "https://www.youtube.com/embed/BwuLxPH8IDs",
    language: "typescript",
    difficulty: "intermediate",
    problems: [
      {
        id: 118,
        title: "Generics",
        description: "Create a generic Stack class that can work with any type.",
        example: `Input: Push 1, 2, 3
Output: "Stack: 3, 2, 1"`,
        starterCode: `class Stack<T> {
    private items: T[] = [];

    push(item: T): void {
        // Your code here
    }

    pop(): T | undefined {
        // Your code here
        return undefined;
    }

    display(): string {
        // Your code here
        return "";
    }
}

const stack = new Stack<number>();
stack.push(1);
stack.push(2);
stack.push(3);
console.log(stack.display());`,
        expectedOutputs: ["Stack: 3, 2, 1"]
      },
      {
        id: 119,
        title: "Decorators",
        description: "Implement method and class decorators for logging and timing.",
        example: `Output: "Method executed in 100ms"`,
        starterCode: `function log(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    // Your code here
    return descriptor;
}

function measure(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    // Your code here
    return descriptor;
}

class Example {
    @log
    @measure
    async doSomething() {
        await new Promise(resolve => setTimeout(resolve, 100));
        console.log("Method executed");
    }
}

const example = new Example();
example.doSomething();`,
        expectedOutputs: ["Method executed in 100ms"]
      },
      {
        id: 120,
        title: "Type Guards",
        description: "Implement type guards to safely handle different types.",
        example: `Input: "Hello" and 42
Output: "String length: 5, Number squared: 1764"`,
        starterCode: `function isString(value: any): value is string {
    // Your code here
    return false;
}

function isNumber(value: any): value is number {
    // Your code here
    return false;
}

function processValue(value: any): string {
    // Your code here
    return "";
}

console.log(processValue("Hello"));
console.log(processValue(42));`,
        expectedOutputs: ["String length: 5", "Number squared: 1764"]
      }
    ]
  },
  {
    id: 43,
    title: "TypeScript Design Patterns",
    description: "Learn TypeScript design patterns and best practices",
    videoUrl: "https://www.youtube.com/embed/BwuLxPH8IDs",
    language: "typescript",
    difficulty: "advanced",
    problems: [
      {
        id: 121,
        title: "Observer Pattern",
        description: "Implement the Observer pattern with TypeScript interfaces and generics.",
        example: `Output: "Stock price updated: $100"`,
        starterCode: `interface Observer<T> {
    update(data: T): void;
}

class Subject<T> {
    private observers: Observer<T>[] = [];
    private state: T;

    constructor(initialState: T) {
        this.state = initialState;
    }

    attach(observer: Observer<T>): void {
        // Your code here
    }

    detach(observer: Observer<T>): void {
        // Your code here
    }

    setState(newState: T): void {
        // Your code here
    }

    private notify(): void {
        // Your code here
    }
}

class StockObserver implements Observer<number> {
    update(price: number): void {
        // Your code here
    }
}

const stock = new Subject<number>(0);
const observer = new StockObserver();
stock.attach(observer);
stock.setState(100);`,
        expectedOutputs: ["Stock price updated: $100"]
      },
      {
        id: 122,
        title: "Factory Pattern",
        description: "Create a factory pattern implementation for different types of shapes.",
        example: `Output: "Circle area: 78.54, Rectangle area: 20"`,
        starterCode: `interface Shape {
    calculateArea(): number;
}

class Circle implements Shape {
    constructor(private radius: number) {}

    calculateArea(): number {
        // Your code here
        return 0;
    }
}

class Rectangle implements Shape {
    constructor(private width: number, private height: number) {}

    calculateArea(): number {
        // Your code here
        return 0;
    }
}

class ShapeFactory {
    static createShape(type: string, ...args: number[]): Shape {
        // Your code here
        return new Circle(0);
    }
}

const circle = ShapeFactory.createShape("circle", 5);
const rectangle = ShapeFactory.createShape("rectangle", 4, 5);

console.log("Circle area:", circle.calculateArea());
console.log("Rectangle area:", rectangle.calculateArea());`,
        expectedOutputs: ["Circle area: 78.54", "Rectangle area: 20"]
      },
      {
        id: 123,
        title: "Dependency Injection",
        description: "Implement a simple dependency injection container with TypeScript.",
        example: `Output: "Service executed with dependency"`,
        starterCode: `interface Service {
    execute(): void;
}

class Dependency {
    doSomething(): void {
        console.log("Dependency executed");
    }
}

class ServiceImpl implements Service {
    constructor(private dependency: Dependency) {}

    execute(): void {
        // Your code here
    }
}

class Container {
    private dependencies = new Map<string, any>();

    register<T>(token: string, implementation: new (...args: any[]) => T): void {
        // Your code here
    }

    resolve<T>(token: string): T {
        // Your code here
        return {} as T;
    }
}

const container = new Container();
container.register("dependency", Dependency);
container.register("service", ServiceImpl);

const service = container.resolve<Service>("service");
service.execute();`,
        expectedOutputs: ["Service executed with dependency"]
      }
    ]
  }
];

// Grid Background Component
function GridBackground() {
  return (
    <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:24px_24px]">
      <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-full bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 blur-[100px]" />
    </div>
  );
}

// Language Selection Component
function LanguageSelection({ onComplete }: { onComplete: (language: string, level: string) => void }) {
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [showError, setShowError] = useState(false);
  const [typingEffect, setTypingEffect] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setTypingEffect(false), 1500);
    return () => clearTimeout(timer);
  }, [currentStep]);

  const handleNext = () => {
    if (currentStep === 1 && !selectedLanguage) {
      setShowError(true);
      return;
    }
    if (currentStep === 2 && !selectedLevel) {
      setShowError(true);
      return;
    }
    if (currentStep === 2 && selectedLanguage && selectedLevel) {
      onComplete(selectedLanguage, selectedLevel);
    } else {
      setCurrentStep(currentStep + 1);
      setShowError(false);
      setTypingEffect(true);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
       <div className="absolute inset-0">
                <div className="absolute inset-0"
                    style={{
                        backgroundImage: `
                            linear-gradient(to right, rgba(99, 102, 241, 0.05) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(99, 102, 241, 0.05) 1px, transparent 1px)
            `,
                        backgroundSize: '64px 64px'
                    }}
                />
            </div>
      <Card className="w-full max-w-3xl bg-white/80 backdrop-blur-lg  rounded-2xl overflow-hidden">
        <CardContent className="p-8">
          <div className="space-y-8">
            {/* Chat-like header */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <Code2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">EduVerse Assistant</h2>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span className="text-sm text-gray-600">Online</span>
                </div>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {currentStep === 1 ? (
                <motion.div
                  key="language-question"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  {/* Question bubble */}
                  <div className="bg-gray-100 rounded-2xl rounded-tl-none p-4 max-w-[80%] relative">
                    <div className="flex items-end gap-2">
                      <p className="text-gray-900 text-lg">
                        {typingEffect ? (
                          <span className="inline-flex gap-1">
                            <motion.span
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.2, delay: 0.1 }}
                            >
                              What
                            </motion.span>
                            <motion.span
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.2, delay: 0.3 }}
                            >
                              language
                            </motion.span>
                            <motion.span
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.2, delay: 0.5 }}
                            >
                              would
                            </motion.span>
                            <motion.span
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.2, delay: 0.7 }}
                            >
                              you
                            </motion.span>
                            <motion.span
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.2, delay: 0.9 }}
                            >
                              like
                            </motion.span>
                            <motion.span
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.2, delay: 1.1 }}
                            >
                              to
                            </motion.span>
                            <motion.span
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.2, delay: 1.3 }}
                            >
                              learn
                            </motion.span>
                            <motion.span
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.2, delay: 1.5 }}
                            >
                              today?
                            </motion.span>
                          </span>
                        ) : (
                          "What language would you like to learn today?"
                        )}
                      </p>
                      {typingEffect && (
                        <motion.div
                          animate={{ opacity: [1, 0] }}
                          transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                          className="w-2 h-4 bg-gray-400 rounded-sm"
                        />
                      )}
                    </div>
                  </div>

                  {/* Language selection grid */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                    className="grid grid-cols-2 sm:grid-cols-3 gap-4"
                  >
                    {programmingLanguages.map((lang) => (
                      <motion.button
                        key={lang.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedLanguage(lang.id)}
                        className={`relative p-6 rounded-xl border-2 transition-all duration-300 ${
                          selectedLanguage === lang.id
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-blue-200 hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex flex-col items-center gap-3">
                          <span className="text-4xl">{lang.icon}</span>
                          <span className="font-medium text-gray-900">{lang.name}</span>
                        </div>
                        {selectedLanguage === lang.id && (
                          <motion.div
                            layoutId="check"
                            className="absolute top-2 right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center"
                          >
                            <CheckCircle className="w-4 h-4 text-white" />
                          </motion.div>
                        )}
                      </motion.button>
                    ))}
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div
                  key="level-question"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  {/* Question bubble */}
                  <div className="bg-gray-100 rounded-2xl rounded-tl-none p-4 max-w-[80%] relative">
                    <div className="flex items-end gap-2">
                      <p className="text-gray-900 text-lg">
                        {typingEffect ? (
                          <span className="inline-flex gap-1">
                            <motion.span
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.2, delay: 0.1 }}
                            >
                              What's
                            </motion.span>
                            <motion.span
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.2, delay: 0.3 }}
                            >
                              your
                            </motion.span>
                            <motion.span
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.2, delay: 0.5 }}
                            >
                              current
                            </motion.span>
                            <motion.span
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.2, delay: 0.7 }}
                            >
                              skill
                            </motion.span>
                            <motion.span
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.2, delay: 0.9 }}
                            >
                              level?
                            </motion.span>
                          </span>
                        ) : (
                          "What's your current skill level?"
                        )}
                      </p>
                      {typingEffect && (
                        <motion.div
                          animate={{ opacity: [1, 0] }}
                          transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                          className="w-2 h-4 bg-gray-400 rounded-sm"
                        />
                      )}
                    </div>
                  </div>

                  {/* Skill level selection */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="space-y-4"
                  >
                    {skillLevels.map((level) => (
                      <motion.button
                        key={level.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedLevel(level.id)}
                        className={`w-full p-6 rounded-xl border-2 transition-all duration-300 text-left relative ${
                          selectedLevel === level.id
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-blue-200 hover:bg-gray-50"
                        }`}
                      >
                        <div className="pr-8">
                          <h3 className="font-semibold text-lg text-gray-900 mb-1">{level.name}</h3>
                          <p className="text-gray-600">{level.description}</p>
                        </div>
                        {selectedLevel === level.id && (
                          <motion.div
                            layoutId="check"
                            className="absolute top-1/2 right-6 -translate-y-1/2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center"
                          >
                            <CheckCircle className="w-4 h-4 text-white" />
                          </motion.div>
                        )}
                      </motion.button>
                    ))}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-4">
              {currentStep === 2 && (
                <Button
                  variant="ghost"
                  onClick={() => {
                    setCurrentStep(1);
                    setShowError(false);
                    setTypingEffect(true);
                  }}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              )}
              <Button
                className={`${currentStep === 2 ? 'ml-auto' : 'w-full'} bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-8 py-2 rounded-xl shadow-md hover:shadow-lg transition-all duration-300`}
                onClick={handleNext}
              >
                {currentStep === 1 ? 'Continue' : 'Start Learning'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            {showError && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-sm text-center"
              >
                Please make a selection to continue
              </motion.p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Topic Recommendation Component
function TopicRecommendation({
  language,
  level,
  onSelectTopic
}: {
  language: string;
  level: string;
  onSelectTopic: (topicId: number) => void;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredTopics, setFilteredTopics] = useState<Topic[]>([]);
  const [typingEffect, setTypingEffect] = useState(true);

  useEffect(() => {
    // Filter topics based on language, level and search query
    const filtered = topics.filter(topic =>
      (topic.language === language || language === "") &&
      (topic.difficulty === level || level === "") &&
      (searchQuery === "" ||
        topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    setFilteredTopics(filtered);
  }, [language, level, searchQuery]);

  useEffect(() => {
    const timer = setTimeout(() => setTypingEffect(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-8">
      {/* Conversational Header */}
      <Card className="bg-white/80 backdrop-blur-lg shadow-xl border-0 overflow-hidden">
        <CardContent className="p-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Book className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 space-y-4">
              {/* Typing effect message */}
              <div className="bg-gray-100 rounded-2xl rounded-tl-none p-4 max-w-[80%] relative">
                <div className="flex items-end gap-2">
                  <p className="text-gray-900 text-lg">
                    {typingEffect ? (
                      <span className="inline-flex gap-1">
                        {`Here's what you can learn in ${programmingLanguages.find(l => l.id === language)?.name}`.split(' ').map((word, i) => (
                          <motion.span
                            key={i}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.2, delay: i * 0.1 }}
                          >
                            {word}{' '}
                          </motion.span>
                        ))}
                      </span>
                    ) : (
                      `Here's what you can learn in ${programmingLanguages.find(l => l.id === language)?.name}`
                    )}
                  </p>
                  {typingEffect && (
                    <motion.div
                      animate={{ opacity: [1, 0] }}
                      transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                      className="w-2 h-4 bg-gray-400 rounded-sm"
                    />
                  )}
                </div>
              </div>

              {/* Search bar with modern styling */}
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  type="text"
                  placeholder="Search topics..."
                  className="pl-10 pr-4 py-2 w-full bg-white/50 backdrop-blur-sm border-gray-200 focus:border-indigo-500 rounded-xl text-gray-900"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Topics Grid with Enhanced Styling */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTopics.length > 0 ? (
          filteredTopics.map((topic, index) => (
            <motion.div
              key={topic.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card 
                className="group h-full bg-white/80 backdrop-blur-sm hover:bg-white/90 border border-gray-100 hover:border-indigo-200 overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1"
                onClick={() => onSelectTopic(topic.id)}
              >
                <CardHeader className="p-6 pb-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500/10 to-purple-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      {topic.language === "javascript" && (
                        <div className="flex items-center justify-center">
                          <img src="https://skillicons.dev/icons?i=js" alt="JavaScript" className="w-8 h-8" />
                        </div>
                      )}
                      {topic.language === "python" && (
                        <div className="flex items-center justify-center">
                          <img src="https://skillicons.dev/icons?i=python" alt="Python" className="w-8 h-8" />
                        </div>
                      )}
                      {topic.language === "java" && (
                        <div className="flex items-center justify-center">
                          <img src="https://skillicons.dev/icons?i=java" alt="Java" className="w-8 h-8" />
                        </div>
                      )}
                      {topic.language === "typescript" && (
                        <div className="flex items-center justify-center">
                          <img src="https://skillicons.dev/icons?i=ts" alt="TypeScript" className="w-8 h-8" />
                        </div>
                      )}
                    </div>
                    <Badge variant={
                      topic.difficulty === "beginner" ? "outline" :
                      topic.difficulty === "intermediate" ? "secondary" : "default"
                    } className="group-hover:scale-105 transition-transform duration-300">
                      {topic.difficulty}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors duration-300">
                    {topic.title}
                  </CardTitle>
                  <CardDescription className="text-gray-600 mt-2">
                    {topic.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-indigo-600 mb-3">
                      <BookOpen className="h-4 w-4" />
                      <span className="font-medium">{topic.problems.length} Interactive Challenges</span>
                    </div>
                    <ul className="space-y-2">
                      {topic.problems.slice(0, 2).map(problem => (
                        <li key={problem.id} className="flex items-center gap-2 text-sm text-gray-600">
                          <div className="w-1.5 h-1.5 rounded-full bg-indigo-400"></div>
                          {problem.title}
                        </li>
                      ))}
                      {topic.problems.length > 2 && (
                        <li className="text-sm font-medium text-indigo-600">
                          +{topic.problems.length - 2} more challenges
                        </li>
                      )}
                    </ul>
                  </div>
                </CardContent>
                <CardFooter className="p-6 pt-0">
                  <Button 
                    className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-md hover:shadow-xl transition-all duration-300"
                  >
                    Start Learning
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full">
            <Card className="bg-white/80 backdrop-blur-sm p-12 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">No topics found</h3>
                <p className="text-gray-600 max-w-md">
                  We couldn't find any topics matching your search. Try adjusting your search terms or explore other categories.
                </p>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

// CodeEditor Component
const CodeEditor = ({ initialCode, onOutput }: { initialCode: string; onOutput: (output: string) => void }) => {
  const [code, setCode] = useState(initialCode);

  const executeCode = () => {
    const logs: string[] = [];
    const customConsole = {
      log: (...args: any[]) => {
        logs.push(
          args
            .map((arg) =>
              typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
            )
            .join(' ')
        );
      },
    };

    try {
      const safeEval = new Function('console', code);
      safeEval(customConsole);
      onOutput(logs.join('\n'));
    } catch (err) {
      onOutput(`Error: ${err instanceof Error ? err.message : 'An error occurred'}`);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] rounded-lg overflow-hidden">
      <div className="flex-1 relative min-h-[200px]">
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="absolute inset-0 w-full h-full font-mono p-4 bg-transparent text-white focus:outline-none resize-none"
          spellCheck="false"
        />
      </div>
      <div className="flex justify-end p-3 bg-[#252525] border-t border-[#333]">
        <button
          onClick={executeCode}
          className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white px-4 py-1.5 rounded-md transition-all duration-200 shadow-md hover:shadow-xl group"
        >
          <Play className="w-4 h-4 transition-transform group-hover:scale-110" />
          Run Code
        </button>
      </div>
    </div>
  );
};

// Updated ProblemCard Component
function ProblemCard({ problem, isCompleted, onComplete, number, totalProblems }: {
  problem: Problem;
  isCompleted: boolean;
  onComplete: () => void;
  number: number;
  totalProblems: number;
}) {
  const [output, setOutput] = useState('');
  const [isSolved, setIsSolved] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [codeExpanded, setCodeExpanded] = useState(false);

  const handleRunCode = (output: string) => {
    setOutput(output);
    const expectedOutputs = problem.expectedOutputs;
    const currentOutput = output.trim();

    if (expectedOutputs.includes(currentOutput)) {
      setIsSolved(true);
      if (!isCompleted) onComplete();
    }
  };

  const hints = [
    "Start by understanding the problem requirements carefully.",
    "Break down the problem into smaller steps.",
    "Consider edge cases in your solution.",
    "Think about the time and space complexity of your algorithm."
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative w-full"
    >
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl overflow-visible w-full">
        {/* Progress indicator */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gray-100">
          <div
            className="h-full bg-gradient-to-r from-indigo-600 to-blue-600 transition-all duration-500"
            style={{ width: `${(number / totalProblems) * 100}%` }}
          />
        </div>

        <CardHeader className="p-8 pb-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                {number}
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                  {problem.title}
                </CardTitle>
                <CardDescription className="text-base text-gray-600 leading-relaxed">
                  {problem.description}
                </CardDescription>
              </div>
            </div>
            {isSolved ? (
              <div className="flex flex-col items-center">
                <div className="p-2 rounded-full bg-green-50">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                </div>
                <span className="text-sm font-medium text-green-600 mt-1">Solved</span>
              </div>
            ) : (
              <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200 px-3 py-1">
                Challenge
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-8 pt-0 space-y-6">
          {/* Example section */}
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-6 border border-indigo-100/50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-indigo-900">Example:</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowHint(!showHint)}
                className="text-indigo-700 hover:text-indigo-900 hover:bg-indigo-100/50"
              >
                {showHint ? "Hide Hint" : "Show Hint"}
              </Button>
            </div>
            <pre className="text-sm text-indigo-700 font-mono bg-white/50 p-4 rounded-lg border border-indigo-100/50">
              {problem.example}
            </pre>

            <AnimatePresence>
              {showHint && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden mt-4"
                >
                  <div className="bg-white p-4 rounded-lg border border-indigo-100/50">
                    <h4 className="text-sm font-semibold text-indigo-900 mb-3">Hints:</h4>
                    <ul className="list-disc pl-5 text-sm text-indigo-700 space-y-2">
                      {hints.map((hint, i) => (
                        <li key={i}>{hint}</li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Code editor section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Your Solution:</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCodeExpanded(!codeExpanded)}
                className="bg-green-50 text-green-700 hover:bg-green-100 rounded-full px-4 py-1 transition-colors duration-200"
              >
                {codeExpanded ? "Collapse" : "Expand to run the code"}
              </Button>
            </div>
            <div 
              className="transition-all duration-300 rounded-lg overflow-hidden"
              style={{ height: codeExpanded ? '400px' : '200px' }}
            >
              <CodeEditor initialCode={problem.starterCode} onOutput={handleRunCode} />
            </div>
          </div>

          {/* Output section */}
          {output && (
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200/50 mt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Output:</h3>
                {isSolved && (
                  <Badge className="bg-green-500 text-white px-3 py-1">
                    Correct Answer
                  </Badge>
                )}
              </div>
              <pre className="text-sm font-mono text-gray-700 bg-white p-4 rounded-lg border border-gray-200/50 overflow-x-auto">
                {output}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Updated ProblemsList Component
function ProblemsList({ problems, topicTitle }: { problems: Problem[], topicTitle: string }) {
  const [completedProblems, setCompletedProblems] = useState<number[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleProblemComplete = (problemId: number) => {
    if (!completedProblems.includes(problemId)) {
      setCompletedProblems(prev => [...prev, problemId]);
    }
  };

  useEffect(() => {
    const progressValue = (completedProblems.length / problems.length) * 100;
    setProgress(progressValue);

    if (completedProblems.length === problems.length && completedProblems.length > 0) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 5000);
    }
  }, [completedProblems, problems.length]);

  return (
    <div className="space-y-8 w-full">
      {/* Progress tracking card */}
      <Card className="bg-white w-full">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Practice Challenges</h3>
              <p className="text-gray-600 text-sm">
                {completedProblems.length} of {problems.length} challenges completed
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className={`w-5 h-5 ${progress === 100 ? 'text-yellow-500' : 'text-gray-400'}`} />
              <span className="font-medium text-lg">{Math.round(progress)}%</span>
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </CardContent>
      </Card>

      {/* Problems list */}
      <div className="space-y-6 w-full">
        {problems.map((problem, index) => (
          <motion.div
            key={problem.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="w-full"
          >
            <ProblemCard
              problem={problem}
              isCompleted={completedProblems.includes(problem.id)}
              onComplete={() => handleProblemComplete(problem.id)}
              number={index + 1}
              totalProblems={problems.length}
            />
          </motion.div>
        ))}
      </div>

      {showCelebration && (
        <>
          <Confetti
            width={window.innerWidth}
            height={window.innerHeight}
            recycle={false}
            numberOfPieces={500}
          />
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Card className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-xl border-0">
              <CardContent className="p-8 text-center">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4">
                    <Trophy className="w-10 h-10 text-yellow-500" />
                  </div>
                  <h2 className="text-3xl font-bold mb-2">
                    🎉 Congratulations! 🎉
                  </h2>
                  <p className="text-indigo-100 max-w-md mx-auto mb-6">
                    You've successfully completed all challenges in this topic.
                    Keep up the great work!
                  </p>
                  <div className="grid grid-cols-3 gap-4 w-full max-w-md">
                    <div className="bg-white/20 p-3 rounded-lg">
                      <div className="text-2xl font-bold">{problems.length}</div>
                      <div className="text-xs text-indigo-100">Challenges</div>
                    </div>
                    <div className="bg-white/20 p-3 rounded-lg">
                      <div className="text-2xl font-bold">100%</div>
                      <div className="text-xs text-indigo-100">Accuracy</div>
                    </div>
                    <div className="bg-white/20 p-3 rounded-lg">
                      <div className="text-2xl font-bold">★★★</div>
                      <div className="text-xs text-indigo-100">Rating</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </>
      )}
    </div>
  );
}

// Updated VideoSection Component
function VideoSection({
  videoUrl,
  onStartPractice,
  practiceStarted,
  title,
  description,
  language,
  difficulty
}: {
  videoUrl: string;
  onStartPractice: () => void;
  practiceStarted: boolean;
  title: string;
  description: string;
  language: string;
  difficulty: string;
}) {
  return (
    <div className="space-y-6">
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl overflow-hidden">
        <div className="flex flex-col">
          {/* Title and Badges Section */}
          <div className="p-8">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <Badge 
                variant="outline" 
                className="bg-gradient-to-r from-indigo-50 to-blue-50 text-indigo-700 border-indigo-200 px-4 py-1.5 text-sm font-medium"
              >
                {programmingLanguages.find(l => l.id === language)?.name}
              </Badge>
              <Badge 
                variant={difficulty === "beginner" ? "outline" : difficulty === "intermediate" ? "secondary" : "default"}
                className={`px-4 py-1.5 text-sm font-medium ${
                  difficulty === "beginner" 
                    ? "bg-green-50 text-green-700 border-green-200" 
                    : difficulty === "intermediate"
                    ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                    : "bg-red-50 text-red-700 border-red-200"
                }`}
              >
                {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
              </Badge>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">{title}</h1>
            <p className="text-gray-600 text-lg leading-relaxed">{description}</p>
          </div>

          {/* Video Player */}
          <div className="relative w-full aspect-video bg-gray-900">
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/20 to-transparent"></div>
            <iframe
              className="absolute inset-0 w-full h-full"
              src={videoUrl}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          {/* Features and Start Button */}
          <div className="p-8 bg-gradient-to-b from-white/50 to-white">
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="flex items-center gap-3 group">
                  <div className="p-2 rounded-lg bg-indigo-50 group-hover:bg-indigo-100 transition-colors">
                    <BookOpen className="w-5 h-5 text-indigo-600" />
                  </div>
                  <span className="font-medium text-gray-700">Comprehensive tutorial</span>
                </div>
                <div className="flex items-center gap-3 group">
                  <div className="p-2 rounded-lg bg-blue-50 group-hover:bg-blue-100 transition-colors">
                    <Code2 className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="font-medium text-gray-700">Interactive challenges</span>
                </div>
                <div className="flex items-center gap-3 group">
                  <div className="p-2 rounded-lg bg-purple-50 group-hover:bg-purple-100 transition-colors">
                    <Zap className="w-5 h-5 text-purple-600" />
                  </div>
                  <span className="font-medium text-gray-700">Hands-on practice</span>
                </div>
                <div className="flex items-center gap-3 group">
                  <div className="p-2 rounded-lg bg-green-50 group-hover:bg-green-100 transition-colors">
                    <Trophy className="w-5 h-5 text-green-600" />
                  </div>
                  <span className="font-medium text-gray-700">Track progress</span>
                </div>
              </div>

              {!practiceStarted && (
                <Button
                  onClick={onStartPractice}
                  className="w-full md:w-auto md:min-w-[240px] mx-auto flex items-center justify-center gap-3 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-lg py-6 shadow-lg hover:shadow-xl transition-all duration-200 group"
                >
                  <Play className="w-5 h-5 transition-transform group-hover:scale-110" />
                  Start Practice Challenges
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default function Feature4Page() {
  const [selectedTopic, setSelectedTopic] = useState<number | null>(null);
  const [practiceStarted, setPracticeStarted] = useState(false);
  const [userLanguage, setUserLanguage] = useState("javascript");
  const [userLevel, setUserLevel] = useState("beginner");
  const [setupComplete, setSetupComplete] = useState(false);

  const handleTopicSelect = (topicId: number) => {
    setSelectedTopic(topicId);
    setPracticeStarted(false);
  };

  const handleStartPractice = () => {
    setPracticeStarted(true);
  };

  const handleBack = () => {
    if (selectedTopic) {
      setSelectedTopic(null);
      setPracticeStarted(false);
    } else {
      setSetupComplete(false);
    }
  };

  const handleSetupComplete = (language: string, level: string) => {
    setUserLanguage(language);
    setUserLevel(level);
    setSetupComplete(true);
  };

  const currentTopic = selectedTopic ? topics.find(t => t.id === selectedTopic) : null;

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <GridBackground />
      <div className="min-h-screen">
        <main className="w-full">
          <div className="max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-8">
            {!setupComplete ? (
              <LanguageSelection onComplete={handleSetupComplete} />
            ) : !selectedTopic ? (
              <div className="max-w-[1400px] w-full">
                <div className="flex items-center gap-4 mb-8">
                  <button
                    onClick={handleBack}
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    Back to Setup
                  </button>
                </div>
                <TopicRecommendation
                  language={userLanguage}
                  level={userLevel}
                  onSelectTopic={handleTopicSelect}
                />
              </div>
            ) : currentTopic ? (
              <div className="max-w-[1400px] w-full space-y-8">
                <div className="flex items-center gap-4 mb-2">
                  <button
                    onClick={handleBack}
                    className="group inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-all duration-200 hover:-translate-x-1"
                  >
                    <ArrowLeft className="w-5 h-5 transition-transform group-hover:scale-110" />
                    <span className="font-medium">Back to Topics</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-8">
                  <VideoSection
                    videoUrl={currentTopic.videoUrl}
                    onStartPractice={handleStartPractice}
                    practiceStarted={practiceStarted}
                    title={currentTopic.title}
                    description={currentTopic.description}
                    language={currentTopic.language}
                    difficulty={currentTopic.difficulty}
                  />

                  {practiceStarted && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="w-full overflow-visible"
                    >
                      <ProblemsList
                        problems={currentTopic.problems}
                        topicTitle={currentTopic.title}
                      />
                    </motion.div>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </main>
      </div>
    </div>
  );
}
  