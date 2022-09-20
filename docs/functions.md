# Mathpad funciont

Mathpad is heavily based on [Nerdamer](https://nerdamer.com/) so further documentation could be inferred from its own web site. For simplicity in this doc we will use the *inline code* usage, but the same goes for the sidebar tool. Just remember that in the sidebar inputs you don't have to append the "=?" prefix. 
Note that some function could return different result depending on the "evaluation" flags (the symbolic/numeric bunnon in the sidebar or the `==?` vs `=~?` postfic): in the example it is reported explicitely in order to force evaluation in some cases. Sometimes, for clarity, only the result is displayed.
Also the examples tends to use numeric evaluation to show actual results, but all functions also work with symbolic arguments.


# General Math Functions




| function     | meaning                    | example             | result                                                                                            |
|--------------|----------------------------|---------------------|---------------------------------------------------------------------------------------------------|
| `log`        | Natural Logarithm          | `log(e^2)==?`       | $\ln\left( {e}^{2}\right) = 2$                                                                    |
| `log10`      | Logarithm (mase 10)        | `log10(100)=~?`     | $\log_{10}\left( 100\right) = 2$                                                                  |
| `min`        | Mininum                    | `min(1,2,3)=?`      | $\mathrm{min}\left(1,2,3\right) = 1$                                                              |
| `max`        | Maximum                    | `max(1,2,3)=?`      | $\mathrm{max}\left(1,2,3\right) = 3$                                                              |
| `abs`        | Absolute Value             | `abs(-1)=?`         | $\left\|- 1\right\| = 1$                                                                          |
| `sign`       | Sign                       | `sign(pi)=~?`       | $\mathrm{sign}\left(\pi\right) = 1$                                                               |
| `sqrt`       | Square Root                | `sqrt(-1)=?`        | $\sqrt{- 1} = i$                                                                                  |
| `exp`        | Exponential                | `diff(exp(x))=?`    | $\frac{d}{d x}\left({\mathrm{exp}\left(x\right)}\right) = e^{x}$                                  |
| `floor`      | Floor                      | `floor(3/2)=~?`     | $\left \lfloor{\frac{3}{2}}\right \rfloor = 1$                                                    |
| `ceil`       | Ceiling                    | `ceil(3/2)=~?`      | $\left \lceil{\frac{3}{2}}\right \rceil = 2$                                                      |
| `round`      | Round to Nearest Integer   | `round(5.7)=~?`     | $\mathrm{round}\left(5.7\right) = 6$                                                              |
| `mod`        | Modulus                    | `mod(7,4)=?`        | $7 \bmod 4 = 3$                                                                                   |
| `fact`       | Factorial                  | `fact(5)=~?`        | $\mathrm{fact}\left(5\right) = 120$                                                               |
| `factorial`  | Factorial                  | `factorial(1/2)==?` | $\frac{1}{2}! = \frac{\sqrt{\pi}}{2}$                                                             |
| `!`          | Factorial                  | `5! =~?`            | $5 != 120$                                                                                        |
| `dfactorial` | Double Factorial           | `dfactorial(5)=~?`  | $5!! = 15$                                                                                        |
| `!!`         | Double Factorial           | `5!!=~?`            | $5!! = 15$                                                                                        |
| `Si`         | Sine Integral              | `Si(5)=~?`          | $\mathrm{Si}\left(5\right) = 1.5499312449446738$                                                  |
| `Ci`         | Cosine Integral            | `Ci(5)=~?`          | $\mathrm{Ci}\left(5\right) = -0.19002974965664432$                                                |
| `Ei`         | Exponential Integral       | `Ei(0)=~?`          | $\mathrm{Ei}\left(0\right) = -\infty$                                                             |
| `sinc`       | Cardinal Sine              | `sinc(0)=~?`        | $\mathrm{sinc}\left(0\right) = 1$                                                                 |
| `Shi`        | Hyperbolic Sine Integral   | `Shi(0)=~?`         | $\mathrm{Shi}\left(0\right) = 0$                                                                  |
| `Chi`        | Hyperbolic Cosine Integral | `Chi(0)=~?`         | $\mathrm{Chi}\left(0\right) = -\infty$                                                            |
| `erf`        | Error Function             | `erf(1)=~?`         | $\mathrm{erf}\left(1\right) = 0.8427007877600067$                                                 |
| `step`       | Heaviside Step Function    | `step(0)=~?`        | $\mathrm{step}\left(0\right) = 0.5$                                                               |
| `tri`        | Triangular Funtion         | `tri(0)=~?`         | $\mathrm{tri}\left(0\right) = 1$                                                                  |
| `rect`       | Rectangular Function       | `rect(0)=~?`        | $\mathrm{rect}\left(0\right) = 1$                                                                 |
 

## Simplification
Attempts to simplify an expression

`simplify(expression)`

example:

`simplify((x^2-9)/(x+3))=?`

will convert to

$$ simplify\left(\frac{{x}^{2} - 9}{x + 3}\right) =  x-3$$

## Expansion
Expand an expression

`expand(expression)`

example:

`expand((a+b)(a-b))=?`

will concert to:

$$expand\left(\left(a + b\right) \cdot \left(a - b\right)\right) = -b^{2}+a^{2}$$

## Fibonacci

Returns the Nth fibonacci number

`fib(N)`

example

`fib(6)=~?`

$\mathrm{fib}\left(6\right) = 6$

## Prime Factors
Returns the prime factors of a number (evaluating returns the initial number)

`pfactor(N)`   

example:
`pfactor(126)==?`   

$$\mathrm{pfactor}\left(126\right) = \left(2\right) \cdot \left(3^{2}\right) \cdot \left(7\right)$$

## Interpolating Line
Returns the equation of a line passing between two points

`line(p1, p2)`

example:

`line([1,2], [2,3])=?`

$$line\left(\left(1 , 2\right) , \left(2 , 3\right)\right) = x+1$$

## Continued Fraction
Returns the number as a continued fraction.
First number is the sign, the other number represents the continued fraction. 

`continued_fraction(N)`

example:

`continued_fraction(1.234)=?`

$$\mathrm{continued\_fraction}\left(1.234\right) = [1, 1, \left[4 ,\,3 ,\,1 ,\,1 ,\,1 ,\,10 \right]]$$


# Trigonometry
Trigonometric functions works in radians and will try to return known values when possible. 
Available funcions: 

| function | meaning               | example          | result                                                                                                               |
|----------|-----------------------|------------------|----------------------------------------------------------------------------------------------------------------------|
| `cos`    | cosine                | `cos(pi)=?`      | $\mathrm{cos}\left(\pi\right) = -1$                                                                                  |
| `sin`    | sine                  | `sin(1/2)=~?`    | $\mathrm{sin}\left(1/2\right)=0.47942553860420299549$                                                                |
| `tan`    | tangent               | `tan(2pi)=?`     | $\mathrm{tan}\left(2*\pi\right)=0$                                                                                   |
| `sec`    | secant                | `diff(sec(x))=?` | $\frac{d}{d x}\left({\mathrm{sec}\left(x\right)}\right)=\mathrm{sec}\left(x\right) \cdot \mathrm{tan}\left(x\right)$ |
| `csc`    | cosecant              | `csc(pi/2)=?`    | $\mathrm{csc}\left(\pi/2\right)=1$                                                                                   |
| `cot`    | cotangent             | `cot(pi/4)==?`   | $\mathrm{cot}\left(\pi/4\right)=1$                                                                                   |
| `acos`   | arccosine             | `acos(-1)=~?`    | $\mathrm{acos}\left(-1\right)=3.14159265358979316028$                                                                |
| `asin`   | arcsine               | `asin(0)=~?`     | $\mathrm{asin}\left(0\right)=0$                                                                                      |
| `atan`   | arctangent            | `atan(-1)==?`    | $\mathrm{atan}\left(-1\right)=-\frac{\pi}{4}$                                                                        |
| `atan2`  | 2-argument arctangent | `atan2(1,2)=~?`  | $\mathrm{atan2}\left(1,2\right)=0.46364760900080610964$                                                              |
| `acsc`   | arccosecant           | `acsc(1)=~?`     | $\mathrm{acsc}\left(1\right)=1.57079632679489658014$                                                                 |
| `acot`   | arccotangent          | `acot(1)=~?`     | $\mathrm{acot}\left(1\right)=0.78539816339744838635$                                                                 |
| `asec`   | arcsecant             | `asec(1)==?`     | $\mathrm{asec}\left(1\right)=0$                                                                                      |

also available are the following hyberbolic functions:

`cosh`,`sinh`,`tanh`,`sech`,`csch`,`coth`,`acosh`,`asinh`,`atanh`,`asech`,`acsch` and `acoth`

# Matrix and Vector

## Defining a vector:

`vector(...elements)`

example:

`V1:=vector(1,2)`

or

`V1:=[1,2]`

$$[1, 2]$$
## Definine a matrix:

`matrix(...rows vectors)`

example:

`M:=matrix([a,b],[b,-a])`

$$\begin{vmatrix}a & b \cr b & -a\end{vmatrix}$$

`a+M=?`

$$\begin{vmatrix}2 \cdot a & a+b \cr a+b & 0\end{vmatrix}$$

## Getting the size of a matrix or vector

`size(matric or vector)`

example:

`size(M)=?`
$$\left[2, 2\right]$$

`size([1,2,3])=?`
$$3$$

## Transpose a matrix: 

`transpose(matrix)`

example:

`transpose(M)=?`

$$\begin{vmatrix}a & b \cr b & -a\end{vmatrix}$$

## Identity Matrix of given rank:

`imatrix(rank)`

example:

`imatrix(3)=?`

$$\begin{vmatrix}1 & 0 & 0 \cr 0 & 1 & 0 \cr 0 & 0 & 1\end{vmatrix}$$


## Determinant

`determinant(matric)`

example:

`determinant(matrix([8,7], [2,7]))=?`

$$42$$

## Inverse of a matrix:

`inverse(Matrix)`

example:

`A:=matrix([1,2],[4,4])`

$$\begin{vmatrix}1 & 2 \cr 4 & 4\end{vmatrix}$$

`invert(A)=?`

$$\begin{vmatrix}-1 & \frac{1}{2} \cr 1 & -\frac{1}{4}\end{vmatrix}$$

## Extracts a column (returning a vector). 
Note: it's 0-based

`matgetcol(matrix, columnIndex)`

example:

`matgetcol(M, 1)=?`

$$\begin{vmatrix}b \cr -a\end{vmatrix}$$

## Extracts a row (returning a vector). 
Note: it's 0-based

`matgetrow(matrix, rowIndex)`

example:

`matgetrow(M, 1)=?`

$$\begin{vmatrix}b & -a\end{vmatrix}$$

## Extract an element from a matrix, 
Note: 0-based

`matget(M, row, col)`

example:

`matget(M, 0, 1)=?`

$$b$$

## Setting an element in a matrix

`matset(Matrix, row, col, element)`

example:

`matset(M,0,1,x)=?`

$$\begin{vmatrix}a & x \cr b & -a\end{vmatrix}$$
## Setting a column in a matrix

`matsetcol(Matrix, columnIndex, column)`

example:

`matsetcol(M,1, [[x],[y]])=?`

$$\begin{vmatrix}a & x \cr b & y\end{vmatrix}$$

Note: columns needs to be passed as a vector of vectors.

## setting a row in a matrix

`matsetrow(Matrix, rowIndex, row)`

example:

`matsetrow(M,1, [y,z])=?`
$$\begin{vmatrix}a & b \cr y & z\end{vmatrix}$$

## Getting an element from a vector:

`vecget(vector, index)`

example:

`V1:=[a,x,x^2]`
$$[a, x, x^{2}]$$
`vecget(V1,1)=?`
$$x$$

## Setting an element into a vector:

`vecset(vector, index, element)`

example:

`vecset(V1,1, x-1)=?`
$$[a, x-1, x^{2}]$$

## Cross product

`cross(vector1, vector2)`

example:

`cross([1,2,3], [4,5,6])=?`
$$[-3, 6, -3]$$

## Dot product

`dot(vector1, vector2)`

example:

`dot([x,y,z],[1,0,-1])=?`
$$-z+x$$

# Imaginary numbers

Imaginary numbers are written like this:

`3i+4`

examples:

`(3i+4)+(2i-3)=?`
$$5 \cdot i+1$$

`(3i+4)(-3*i+4)=?`
$$\left(3 \cdot i+4\right) \cdot \left(-3 \cdot i+4\right)$$

`expand((3i+4)(-3*i+4))=?`
$$25$$

## Extracting Real part

`realpart(Z)`

example:

`a:=3i+4`

`realpart(a)=?`
will convert to

$$\operatorname{Re}\left(a\right) = 4$$

## Extracting imaginary part

`imagpart(a)=?`
will converto to
$$\operatorname{Im}\left(a\right) = 3$$

## Converting to polar form

`polarform(Z)`

example:

`polarform(a)==?`
$$5 \cdot e^{\mathrm{atan}\left(\frac{3}{4}\right) \cdot i}$$

NoteL actually evaluating the result will five back the original number.

## converting to rectangular form

`rectform(Z)`

example:

`rectform(e^(atan(1/5)*i)*sqrt(26))=~?`
will convert to:
$$rectform\left({e}^{\left(\mathrm{atan}\left(1/5\right) \cdot i\right)} \cdot \sqrt{26}\right) = i+5$$

## Getting the argument of a complex number

`arg(Z)`

example:

`arg(-1)==?`
$$\pi$$

## Getting the modulus of a complex number

you can use the `abs` (absolute value) funcion:

`abs(Z)`

example:

`abs(sqrt(2)/2+i*sqrt(2)/2)=~?`

will convert to:
$$\left|\frac{\sqrt{2}}{2} + i \cdot \frac{\sqrt{2}}{2}\right| = 1$$

# Calculus

## Summation

Sum an expression from a lower to an upper limit

`sum(expression,index, lower, upper)`

example:

`sum(x+1, x, 1, 5)=?`

converts to

$$\sum_{x = 1}^{5}{x + 1} = 20$$

## Product

Calculates the product of an expression from a lower to an upper limit

`product(expression, index, lower, upper)`

example:

`product(x+y, x, 1, 5)=?`

converts to:

$$\prod_{x = 1}^{5}{x + y} = \left(y+1\right) \cdot \left(y+2\right) \cdot \left(y+3\right) \cdot \left(y+4\right) \cdot \left(y+5\right)$$

## Differentiation (derivate)

Calculate the derivative of a function

`diff(expression or vector, variable?, order?)`

example:

`diff(sin(x))=?`

converts to:

$$\frac{d}{d x}\left({\mathrm{sin}\left(x\right)}\right) = \mathrm{cos}\left(x\right)$$


`diff(x*y^2,y)=?`

converts to:

$$\frac{d}{d y}\left({x \cdot {y}^{2}}\right) = 2 \cdot y \cdot x$$

`diff(3x^4+2x^2,x,2)=?`

coonverts to:

$$\frac{d^{2}}{d x^{2}}\left({3 \cdot {x}^{4} + 2 \cdot {x}^{2}}\right) = 36 \cdot x^{2}+4$$

`diff([x^2, cos(x), 1], x, 2)=?`

converts to:

$$\frac{d^{2}}{d x^{2}}\left({\left({x}^{2} , \mathrm{cos}\left(x\right) , 1\right)}\right) = [2, -\mathrm{cos}\left(x\right), 0]$$

## Integration

`integrate(expression or vector, dx)`

example:

`integrate(x,x)=?`

converts to:

$$\int {x}\, dx = \frac{x^{2}}{2}$$

`integrate(sin(x)*cos(x),x)==?`

converts to:

$$\int {\mathrm{sin}\left(x\right) \cdot \mathrm{cos}\left(x\right)}\, dx = -\frac{\mathrm{cos}\left(x\right)^{2}}{2}$$

## Definite Integral

`defint(expression or vector, from, to, dx )`

example:    

`defint(log(x),0,1,x)=?`

converts to:

$\int\limits_{0}^{1} {\ln\left( x\right)}\, dx = -1$

# Algebra

## Divide

Divide two polinomials

`divide(p1, p2)`

example:

`divide(x^2+2*x+1,x+1)=?`

converts to:

$$\mathrm{divide}\left(x^2+2*x+1,x+1\right) = x+1$$

## Factor

Factor an expression

`factor(expression)`

example:

`factor(6x^3-6x^2-12x)=?`

results in:

$$\mathrm{factor}\left(6*x^3-6*x^2-12*x\right) = 6 \cdot \left(x-2\right) \cdot \left(x+1\right) \cdot x$$

## Partial Fraction Decomposition

`partfrac(expression, variable)`

example:

`partfrac((x^2+a)/(x*(x-1)^3), x)=?`

results in:

$$partfrac\left(\frac{{x}^{2} + a}{x \cdot {\left(x - 1\right)}^{3}} , x\right) = \frac{a}{x-1}+\frac{-a+1}{\left(x-1\right)^{2}}+\frac{a+1}{\left(x-1\right)^{3}}-\frac{a}{x}$$

## Least Common Multiple (LCM)

Least Common Multiple of two polynomials (or two numbers)

`lcm(p1, p2)`

examples:

`lcm(4,6)=?`

results in:

$$\mathrm{lcm}\left(4,6\right) = 12$$

## Greatest Common Divisor

Greatest Common Divisor of two polynomials oe to numbers

`gcd(p1, p2)`

example:

`gcd(x^2+2*x+1, x^2+6*x+5)=?`

converts to:

$$\mathrm{gcd}\left(x^2+2*x+1,x^2+6*x+5\right) = x+1$$

## Roots

Returns the roots of a single variable expression

`roots(expression)`

example:

`roots(x^2-3*x-10)=?`

results in $[2, -2]$

## Coefficients

Returns the coefficient of a polynomial

`coeffs(polynomial, variable)`

example:

`coeffs(x^2-2x+10, x)=?`

results in $[10, -2, 1]$

## Degree

Returns the degree of a plynomial

`deg(polynomial, variable)`

example:

`deg(x^2-2x+10, x)=?`

results in $2$

## Complete The Square

Attempts to rewrite to polynomial to complete the square.

`sqcop(polynomial, variable)`

example:

`sqcomp(9*x^2-18*x+17)=?`

Results in $\left(3 \cdot x-3\right)^{2}+8$

# Solve

## Solve for a variable

Solve an equation, symbolically if possible

`solve(equation, variable?)`

example:

`solve(a*x^2+b*x=y, x)=?`

will results in $[\frac{0.5 \cdot \sqrt{4 \cdot a \cdot y+b^{2}}-b}{a}, \frac{0.5 \cdot -\sqrt{4 \cdot a \cdot y+b^{2}}-b}{a}]$

`solve(x^4=1)=?`
 
 will results in $[1, -1, i, -i]$

## System of linear equations

Solves a system of linear equations

`solveEquations([2*x^2*z-y=-59, 0.5*y^3-z=65.5, x^2+y^3-5*z^2=89])==?`

will results in:

$\left[\left[x, 3\right], \left[y, 5\right], \left[z, -3\right]\right]$

# Other functions

## Limit

Tries to calculate the limit of an expression

`limit(expression, variable, limit)`

example:

`limit(sin(x)/x,x,0)=?`

will convert to:

$$\lim_{x\to 0} {\frac{\mathrm{sin}\left(x\right)}{x}} = 1$$

## Laplace transform

Calculate the Laplace transform of a funcion

`laplace(expression, time, variable)`

example:

`laplace(t^6, t, s)==?`

will results in: $\frac{6!}{s^{7}}$

`laplace(cos(w*t)*t, t,x)=?`

will results in:

$\frac{1}{\left(\frac{w^{2}}{x^{2}}+1\right)^{2} \cdot x^{2}}-\frac{w^{2}}{\left(\frac{w^{2}}{x^{2}}+1\right)^{2} \cdot x^{4}}$

## Mean

Calculates the mean of a set of numbers

`mean(...numbers of expressions)`

example:

`mean(3,4,6,1,2,4)==?`

will results in $\frac{10}{3}$

## Mode

Calculates the mode of a set of numbers. Returns a symbolic function if mode cannot be calculated.

`mode(...numbers)`

example:

`mode(4,2,5,4)=?`

will results $4$

## Median

Returns the mediam of a set of numbers

`median(...numbers)`

example:

`median(11,12,13,14)==?`

will results in: $\frac{25}{2}$

## Z-Score

Calculates the z-score for a value

`zscore(x, mean, stdev)`

example:

`x:=[3,1,2,6]`

`zscore(2, mean(x), stdev(x))==?`

will results in: $-\frac{\sqrt{2}}{\sqrt{7}}$

`zscore(2, mean(x), stdev(x))=~?`

will results in: $-0.53452248382484878790$

## Sample Variance

Calculates the sample variance of a set of numbers.

`smpvar(...expressions or numbers)`

example:

`smpvar(4,2,4,5)==?`

will restults in: $\frac{19}{12}$

`smpvar([4,2,4,5])=~?`

will results in: $1.58333333333333333333$

## Variace

Calculate the population variance of a set of numbers

`variance(...expresions or numbers)`

example:

`variance(4,2,5,4)==?`

will restuls in $\frac{19}{16}$

## Sample Standard Deviation

Calculates the sample standard deviation of a set of numbers.

`smpstdev(...expressions or numbers)`

example:

`smpstdev(4,2,4,5)=~?`

will results in $1.25830573921179190689$

## Standard Deviation

Calculates the population standard deviation of a set of numbers

`stddev(...expressions or numbers)`

example:

`stdev(4,2,5,4)=~?`

will result in: $1.08972473588516841053$

