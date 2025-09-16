# ATCG Computer Language Specification

## Overview

The ATCG Computer Language is a biological computing paradigm that uses the four DNA nucleotides as the foundation for programming concepts:

- **A** (Adenine) - Assignment and Action
- **T** (Thymine) - Termination and True
- **C** (Cytosine) - Condition and Control
- **G** (Guanine) - Goto and Group

## Basic Syntax

### Data Types
- `AAAA` - Integer type
- `TTTT` - Boolean type  
- `CCCC` - String type
- `GGGG` - Array type

### Operations
- `AT` - Assignment operator
- `CG` - Comparison operator
- `AC` - Addition
- `TG` - Subtraction
- `AG` - Multiplication
- `CT` - Division

### Control Structures
- `CAAT` - If statement
- `CGGT` - While loop
- `TGCA` - For loop
- `GCTA` - Function definition

## Example Translations

### Hello World Program
```
Traditional:
print("Hello, World!")

ATCG:
GCTA CCCC-hello AT "Hello, World!"
AAAA-output AT CCCC-hello
```

### Variable Assignment
```
Traditional:
int x = 5;
boolean flag = true;

ATCG:
AAAA x AT 5
TTTT flag AT T
```

### Conditional Statement
```
Traditional:
if (x > 5) {
    print("Greater than 5")
}

ATCG:
CAAT (x CG 5)
    AAAA-output AT "Greater than 5"
CAAT-T
```

## Encoding Rules

1. Each basic operation is encoded using nucleotide pairs
2. Complex structures use longer sequences
3. Comments use `//` followed by nucleotide sequences
4. Variables are prefixed with their data type

## Translation Guidelines

- Maintain original program logic
- Use biological terminology where appropriate
- Avoid restricted terms as specified
- Preserve functionality while adapting to ATCG syntax